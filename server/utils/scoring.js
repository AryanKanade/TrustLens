function scorePrice(askingPrice, shoppingResults) {
  if (!shoppingResults || shoppingResults.length === 0) return null;

  const prices = shoppingResults
    .map(r => {
      if (typeof r.extracted_price === 'number') return r.extracted_price;
      const cleaned = parseFloat(String(r.price || '').replace(/[^0-9.]/g, ''));
      return cleaned;
    })
    .filter(p => !isNaN(p) && p > 0);

  if (prices.length === 0) return null;

  prices.sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  const median = prices.length % 2 === 0
    ? (prices[mid - 1] + prices[mid]) / 2
    : prices[mid];

  const ratio = askingPrice / median;

  let score;
  if (ratio < 0.5) {
    score = 100 * (ratio / 0.5) * 0.3;
  } else if (ratio <= 1.3) {
    score = 100;
  } else if (ratio >= 4) {
    score = 0;
  } else {
    score = 100 * (4 - ratio) / 2.7;
  }

  score = Math.round(score);

  return { score, median: Math.round(median), ratio: Number(ratio.toFixed(2)) };
}

const DROPSHIP_DOMAINS = ['aliexpress', 'alibaba', 'dhgate', 'temu', 'chinabrands', 'wish.com', 'banggood'];

function scoreImages(visualMatches) {
  // visualMatches can be undefined, an empty object {}, or an array
  if (!visualMatches || !Array.isArray(visualMatches) || visualMatches.length === 0) {
    // No matches found anywhere — likely original photos, but not certain
    return { score: 90, dropshipMatchCount: 0, totalMatches: 0 };
  }

  const dropshipMatches = visualMatches.filter(match => {
    const link = (match.link || '').toLowerCase();
    const source = (match.source || '').toLowerCase();
    return DROPSHIP_DOMAINS.some(domain => link.includes(domain) || source.includes(domain));
  });

  const dropshipMatchCount = dropshipMatches.length;
  const totalMatches = visualMatches.length;

  let score;
  if (dropshipMatchCount === 0) score = 85;
  else if (dropshipMatchCount <= 2) score = 40;
  else score = 10;

  return { score, dropshipMatchCount, totalMatches };
}

const SCAM_WORDS = ['scam', 'fraud', 'fake', 'duped', 'cheated', 'ghost seller', 'never delivered', 'did not receive', 'not delivered', 'defrauded'];

function scoreComplaints(brandName, newsResults, forumResults, webResults) {
  const name = (brandName || '').toLowerCase();
  let hits = 0;

  const checkArray = (arr, weight) => {
    if (!arr || !Array.isArray(arr)) return;
    arr.forEach(item => {
      const text = `${item.title || ''} ${item.snippet || ''}`.toLowerCase();
      const mentionsBrand = name && text.includes(name);
      const hasScamWord = SCAM_WORDS.some(word => text.includes(word));
      if (mentionsBrand && hasScamWord) hits += weight;
    });
  };

  checkArray(newsResults, 1);
  checkArray(forumResults, 2);
  checkArray(webResults, 1); // general web, same weight as news

  let score = 80 - (hits * 20);
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return { score, hits };
}

const SCAM_PHRASES = ['100% advance', 'no cod', 'no return', 'no refund', 'limited stock', 'advance payment only', 'cash only'];

function scoreAccount(profile) {
  if (!profile) return null;

  let score = 50;

  if (profile.is_verified) score += 30;
  if (profile.is_professional_account) score += 5;
  if (profile.bio_links && profile.bio_links.length > 0) score += 5;
  if (profile.followers >= 1000) score += 10;

  if (profile.followers > 0 && profile.following > 0) {
    const followRatio = profile.following / profile.followers;
    if (followRatio > 3) score -= 15;
  }

  if (profile.followers < 100) score -= 10;

  // scan captions for scam phrases and posting-burst pattern
  let scamPhraseHits = 0;
  if (profile.posts && Array.isArray(profile.posts)) {
    profile.posts.forEach(post => {
      const captions = (post.media_captions || []).join(' ').toLowerCase();
      SCAM_PHRASES.forEach(phrase => {
        if (captions.includes(phrase)) scamPhraseHits++;
      });
    });
  }
  score -= Math.min(scamPhraseHits * 8, 30);

  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, scamPhraseHits, followRatio: profile.followers ? Number((profile.following / profile.followers).toFixed(2)) : null };
}

function scorePresence(mapsResults, reviews) {
  // mapsResults = array from searchMapsPlace, reviews = array from getMapsReviews
  // null means "address wasn't claimed / wasn't checked" — not "bad"
  if (!mapsResults || !Array.isArray(mapsResults) || mapsResults.length === 0) {
    return null;
  }

  const place = mapsResults[0]; // best match
  const rating = typeof place.rating === 'number' ? place.rating : null;
  const reviewCount = typeof place.reviews === 'number' ? place.reviews : 0;

  let score = 50 + (rating !== null ? (rating - 3) * 10 : 0) + Math.min(20, reviewCount / 10);

  // If we have actual review text, check for complaint words too
  let negativeReviewHits = 0;
  if (reviews && Array.isArray(reviews)) {
    reviews.forEach(r => {
      const text = (r.snippet || '').toLowerCase();
      if (SCAM_WORDS.some(word => text.includes(word))) negativeReviewHits++;
    });
  }
  score -= negativeReviewHits * 15; 

  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, rating, reviewCount, negativeReviewHits };
}

function combineScores(signals) {
  // signals = { price: {...}|null, images: {...}|null, complaints: {...}|null, account: {...}|null }
  const weights = { price: 25, images: 25, complaints: 20, account: 15, presence: 15 };

  let totalWeight = 0;
  let weightedSum = 0;
  const breakdown = {};

  for (const key in weights) {
    const signal = signals[key];
    if (signal && typeof signal.score === 'number') {
      weightedSum += weights[key] * signal.score;
      totalWeight += weights[key];
      breakdown[key] = signal;
    } else {
      breakdown[key] = null;
    }
  }

  if (totalWeight === 0) {
    return { trustScore: null, confidence: 0, breakdown };
  }

  const trustScore = Math.round(weightedSum / totalWeight);
  const confidence = Math.round(totalWeight); // out of 100 since weights sum to 100 when all present

  let band;
  if (trustScore >= 80) band = 'Looks Reliable';
  else if (trustScore >= 60) band = 'Some Concerns';
  else if (trustScore >= 40) band = 'High Risk';
  else band = 'Avoid';

  return { trustScore, band, confidence, breakdown };
}

module.exports = { scorePrice, scoreImages, scoreComplaints, scoreAccount, scorePresence, combineScores };