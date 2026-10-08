const { findReportById } = require('../models/report');

async function getReport(req, res) {
  try {
    const { id } = req.params;
    const report = await findReportById(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getReport };