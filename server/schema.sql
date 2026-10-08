USE trustlens;

CREATE TABLE reports (
  id            VARCHAR(36) PRIMARY KEY,
  handle        VARCHAR(255) NOT NULL,
  brand_name    VARCHAR(255),
  asking_price  DECIMAL(10,2),
  trust_score   TINYINT,
  band          VARCHAR(32),
  confidence    TINYINT,
  signals       JSON,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);