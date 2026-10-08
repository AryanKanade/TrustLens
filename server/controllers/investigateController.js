const {
  getLensMatches,
  getShoppingResults,
  getForumResults,
  getNewsResults,
  getInstagramProfile
} = require('../services/serpApiService');

const {
  scorePrice,
  scoreImages,
  scoreComplaints,
  scoreAccount,
  combineScores
} = require('../utils/scoring');

async function startInvestigation(req, res) {
  try {
    const { handle, imageUrl, askingPrice, brandName } = req.body;

    if (!handle || !imageUrl || !askingPrice || !brandName) {
      return res.status(400).json({
        error: 'handle, imageUrl, askingPrice, and brandName are all required'
      });
    }

    // Run all SerpApi calls in parallel; allSettled so one failure doesn't kill the rest
    const [profileResult, lensResult, shoppingResult, newsResult, forumResult] =
      await Promise.allSettled([
        getInstagramProfile(handle),
        getLensMatches(imageUrl),
        getShoppingResults(brandName),
        getNewsResults(brandName),
        getForumResults(brandName)
      ]);

    const profile = profileResult.status === 'fulfilled' ? profileResult.value : null;
    const visualMatches = lensResult.status === 'fulfilled' ? lensResult.value : null;
    const shoppingResults = shoppingResult.status === 'fulfilled' ? shoppingResult.value : null;
    const newsResults = newsResult.status === 'fulfilled' ? newsResult.value : null;
    const forumResults = forumResult.status === 'fulfilled' ? forumResult.value : null;

    const priceScore = scorePrice(askingPrice, shoppingResults);
    const imageScore = scoreImages(visualMatches);
    const complaintsScore = scoreComplaints(brandName, newsResults, forumResults);
    const accountScore = scoreAccount(profile);

    const final = combineScores({
      price: priceScore,
      images: imageScore,
      complaints: complaintsScore,
      account: accountScore
    });

    const report = {
      handle,
      brandName,
      askingPrice,
      trustScore: final.trustScore,
      band: final.band,
      confidence: final.confidence,
      signals: final.breakdown,
      createdAt: new Date().toISOString()
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function checkPrice(req, res) {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        const results = await getShoppingResults(query);
        res.json({ shoppingResults: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function checkForums(req, res) {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        const results = await getForumResults(query);
        res.json({ forumResults: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function checkNews(req, res) {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        const results = await getNewsResults(query);
        res.json({ newsResults: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function checkMapsPlace(req, res) {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        const results = await searchMapsPlace(query);
        res.json({ mapsResults: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function checkMapsReviews(req, res) {
    try {
        const { dataId } = req.body;
        if (!dataId) {
            return res.status(400).json({ error: 'dataId is required' });
        }
        const results = await getMapsReviews(dataId);
        res.json({ reviews: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { startInvestigation , checkPrice, checkForums, checkNews, checkMapsPlace, checkMapsReviews };