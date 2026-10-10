const { createReport } = require('../models/report');

const {
  getLensMatches,
  getShoppingResults,
  getForumResults,
  getNewsResults,
  getInstagramProfile,
  searchMapsPlace,
  getMapsReviews,
  getWebComplaints
} = require('../services/serpApiService');

const {
  scorePrice,
  scoreImages,
  scoreComplaints,
  scoreAccount,
  scorePresence,
  combineScores
} = require('../utils/scoring');

async function startInvestigation(req, res) {
  try {
    const { handle, imageUrl, askingPrice, brandName, addressQuery } = req.body;

    if (!handle || !imageUrl || !askingPrice || !brandName) {
      return res.status(400).json({
        error: 'handle, imageUrl, askingPrice, and brandName are all required'
      });
    }

    // Core calls always run
    const corePromises = [
      getInstagramProfile(handle),
      getLensMatches(imageUrl),
      getShoppingResults(brandName),
      getNewsResults(brandName),
      getForumResults(brandName),
      getWebComplaints(brandName)
    ];

    // Maps only runs if the user/frontend supplied an address to check
    const sellerName = handle; // or could use profile's full_name once fetched, but handle works as a reasonable proxy
const mapsPromise = addressQuery ? searchMapsPlace(`${sellerName} ${addressQuery}`) : Promise.resolve(null);

    const results = await Promise.allSettled([...corePromises, mapsPromise]);

    const [profileResult, lensResult, shoppingResult, newsResult, forumResult, webResult, mapsResult] = results;

    const profile = profileResult.status === 'fulfilled' ? profileResult.value : null;
    const visualMatches = lensResult.status === 'fulfilled' ? lensResult.value : null;
    const shoppingResults = shoppingResult.status === 'fulfilled' ? shoppingResult.value : null;
    const newsResults = newsResult.status === 'fulfilled' ? newsResult.value : null;
    const forumResults = forumResult.status === 'fulfilled' ? forumResult.value : null;
    const webResults = webResult.status === 'fulfilled' ? webResult.value : null;
    const mapsResults = mapsResult.status === 'fulfilled' ? mapsResult.value : null;

    // If we found a Maps place, fetch its reviews too (second call, only if needed)
    let reviews = null;
    if (mapsResults && Array.isArray(mapsResults) && mapsResults.length > 0 && mapsResults[0].data_id) {
      try {
        reviews = await getMapsReviews(mapsResults[0].data_id);
      } catch (e) {
        reviews = null; // non-fatal, presence score still works without review text
      }
    }

    const priceScore = scorePrice(askingPrice, shoppingResults);
    const imageScore = scoreImages(visualMatches);
    const complaintsScore = scoreComplaints(brandName, newsResults, forumResults, webResults);
    const accountScore = scoreAccount(profile);
    const presenceScore = scorePresence(mapsResults, reviews);

    const final = combineScores({
      price: priceScore,
      images: imageScore,
      complaints: complaintsScore,
      account: accountScore,
      presence: presenceScore
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

    const reportId = await createReport(report);
    res.json({ id: reportId, ...report });
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