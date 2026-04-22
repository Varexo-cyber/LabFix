-- Users table for LabFix
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    customer_type VARCHAR(20) NOT NULL DEFAULT 'individual',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(100),
    kvk_number VARCHAR(20),
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Nederland',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on KVK number for business lookups
CREATE INDEX IF NOT EXISTS idx_users_kvk ON users(kvk_number);
