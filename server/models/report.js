const pool = require('../config/db');
const { randomUUID } = require('crypto');

async function createReport(data) {
  const id = randomUUID();

  await pool.query(
    `INSERT INTO reports (id, handle, brand_name, asking_price, trust_score, band, confidence, signals)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.handle,
      data.brandName,
      data.askingPrice,
      data.trustScore,
      data.band,
      data.confidence,
      JSON.stringify(data.signals)
    ]
  );

  return id;
}

async function findReportById(id) {
  const [rows] = await pool.query(`SELECT * FROM reports WHERE id = ?`, [id]);
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    handle: row.handle,
    brandName: row.brand_name,
    askingPrice: row.asking_price,
    trustScore: row.trust_score,
    band: row.band,
    confidence: row.confidence,
    signals: typeof row.signals === 'string' ? JSON.parse(row.signals) : row.signals,
    createdAt: row.created_at
  };
}

module.exports = { createReport, findReportById };