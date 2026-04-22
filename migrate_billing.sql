-- Add billing address columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_postal_code VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_country VARCHAR(100) DEFAULT 'Nederland';
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_same_as_shipping BOOLEAN DEFAULT true;

-- Add missing personal info columns if not exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS customer_type VARCHAR(20) DEFAULT 'individual';
