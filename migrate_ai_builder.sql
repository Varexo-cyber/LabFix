-- Create website_config table for AI Builder
CREATE TABLE IF NOT EXISTS website_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_website_config_type ON website_config(type);
CREATE INDEX IF NOT EXISTS idx_website_config_key ON website_config(key);

-- Add some default values
INSERT INTO website_config (key, value, type) VALUES
  ('footer_text', '© 2024 LabFix - Alle rechten voorbehouden', 'footer'),
  ('primary_color', '#dc2626', 'theme')
ON CONFLICT DO NOTHING;
