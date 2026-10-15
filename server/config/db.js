const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

function getSslCert() {
  // On Render (and anywhere using env-based cert), DB_SSL_CA holds the cert content directly
  if (process.env.DB_SSL_CA) {
    return process.env.DB_SSL_CA;
  }
  // Locally, fall back to the file on disk
  const localCertPath = path.join(__dirname, 'aiven-ca.pem');
  if (fs.existsSync(localCertPath)) {
    return fs.readFileSync(localCertPath);
  }
  return undefined;
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: getSslCert(),
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
  .then((conn) => {
    console.log('MySQL connected');
    conn.release();
  })
  .catch((err) => {
    console.error('MySQL connection failed:', err.message);
  });

module.exports = pool;