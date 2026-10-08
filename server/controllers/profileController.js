const { getInstagramProfile } = require('../services/serpApiService');

async function getProfile(req, res) {
    try {
        const { handle } = req.body;
        if (!handle) {
            return res.status(400).json({ error: 'Handle is required' });
        }
        const profile = await getInstagramProfile(handle);
        res.json({ profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getProfile };