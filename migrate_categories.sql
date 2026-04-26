-- Database schema for dynamic categories/brands
-- This replaces the hardcoded brandCategories in categories.ts

-- Main brands/categories table
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subcategories per brand
CREATE TABLE IF NOT EXISTS subcategories (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    slug VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brand_id, slug)
);

-- Models per subcategory
CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE CASCADE,
    slug VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subcategory_id, slug)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);
CREATE INDEX IF NOT EXISTS idx_subcategories_brand ON subcategories(brand_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_active ON subcategories(is_active);
CREATE INDEX IF NOT EXISTS idx_models_subcategory ON models(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_models_active ON models(is_active);

-- Insert initial data (migrating from hardcoded categories.ts)
INSERT INTO brands (slug, name, name_en, sort_order) VALUES
    ('apple', 'Apple', 'Apple', 1),
    ('samsung', 'Samsung', 'Samsung', 2),
    ('google', 'Google', 'Google', 3),
    ('huawei', 'Huawei', 'Huawei', 4),
    ('xiaomi', 'Xiaomi', 'Xiaomi', 5),
    ('motorola', 'Motorola', 'Motorola', 6),
    ('oneplus', 'OnePlus', 'OnePlus', 7),
    ('oppo', 'OPPO', 'OPPO', 8),
    ('sony', 'Sony', 'Sony', 9),
    ('lg', 'LG', 'LG', 10),
    ('nokia', 'Nokia', 'Nokia', 11),
    ('asus', 'ASUS', 'ASUS', 12)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Apple
INSERT INTO subcategories (brand_id, slug, name, name_en, sort_order)
SELECT id, 'iphone', 'iPhone', 'iPhone', 1 FROM brands WHERE slug = 'apple'
UNION ALL
SELECT id, 'ipad', 'iPad', 'iPad', 2 FROM brands WHERE slug = 'apple'
UNION ALL
SELECT id, 'macbook', 'MacBook', 'MacBook', 3 FROM brands WHERE slug = 'apple'
UNION ALL
SELECT id, 'apple-watch', 'Apple Watch', 'Apple Watch', 4 FROM brands WHERE slug = 'apple'
ON CONFLICT DO NOTHING;

-- Insert subcategories for Samsung
INSERT INTO subcategories (brand_id, slug, name, name_en, sort_order)
SELECT id, 'galaxy-s', 'Galaxy S Series', 'Galaxy S Series', 1 FROM brands WHERE slug = 'samsung'
UNION ALL
SELECT id, 'galaxy-a', 'Galaxy A Series', 'Galaxy A Series', 2 FROM brands WHERE slug = 'samsung'
UNION ALL
SELECT id, 'galaxy-tab', 'Galaxy Tab', 'Galaxy Tab', 3 FROM brands WHERE slug = 'samsung'
UNION ALL
SELECT id, 'galaxy-watch', 'Galaxy Watch', 'Galaxy Watch', 4 FROM brands WHERE slug = 'samsung'
UNION ALL
SELECT id, 'galaxy-z', 'Galaxy Z (Fold/Flip)', 'Galaxy Z (Fold/Flip)', 5 FROM brands WHERE slug = 'samsung'
ON CONFLICT DO NOTHING;

-- Insert models for iPhone
INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-16', 'iPhone 16', 1 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'apple' AND s.slug = 'iphone'
UNION ALL
SELECT s.id, 'iphone-15', 'iPhone 15', 2 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'apple' AND s.slug = 'iphone'
UNION ALL
SELECT s.id, 'iphone-14', 'iPhone 14', 3 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'apple' AND s.slug = 'iphone'
UNION ALL
SELECT s.id, 'iphone-13', 'iPhone 13', 4 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'apple' AND s.slug = 'iphone'
UNION ALL
SELECT s.id, 'iphone-12', 'iPhone 12', 5 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'apple' AND s.slug = 'iphone'
UNION ALL
SELECT s.id, 'iphone-11', 'iPhone 11', 6 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'apple' AND s.slug = 'iphone'
UNION ALL
SELECT s.id, 'iphone-se', 'iPhone SE', 7 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT DO NOTHING;

-- Insert models for Samsung Galaxy S
INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s24', 'Galaxy S24', 1 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
UNION ALL
SELECT s.id, 'galaxy-s23', 'Galaxy S23', 2 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
UNION ALL
SELECT s.id, 'galaxy-s22', 'Galaxy S22', 3 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
UNION ALL
SELECT s.id, 'galaxy-s21', 'Galaxy S21', 4 FROM subcategories s JOIN brands b ON s.brand_id = b.id WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT DO NOTHING;
