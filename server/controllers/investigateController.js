const { getLensMatches } = require('../services/serpApiService');

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

module.exports = { startInvestigation };