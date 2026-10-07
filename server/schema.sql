USE trustlens;

CREATE TABLE reports (
  id            VARCHAR(36) PRIMARY KEY,
  handle        VARCHAR(255) NOT NULL,
  post_id       VARCHAR(255),
  asking_price  DECIMAL(10,2),
  score         TINYINT,
  band          VARCHAR(32),
  confidence    TINYINT,
  signals       JSON,
  alternative   JSON,
  api_trace     JSON,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);