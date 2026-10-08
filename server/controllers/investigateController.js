const { getLensMatches, getShoppingResults, getForumResults, getNewsResults, searchMapsPlace, getMapsReviews } = require('../services/serpApiService');

async function startInvestigation(req, res){
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }
        const matches = await getLensMatches(imageUrl);
        res.json({ visualMatches: matches });
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