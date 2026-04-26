-- Restore all subcategories for all brands
-- Run this in your database to restore all missing subcategories

-- Apple subcategories
INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'iphone', 'iPhone', 1 FROM brands WHERE slug = 'apple'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'ipad', 'iPad', 2 FROM brands WHERE slug = 'apple'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'macbook', 'MacBook', 3 FROM brands WHERE slug = 'apple'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'apple-watch', 'Apple Watch', 4 FROM brands WHERE slug = 'apple'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'airpods', 'AirPods', 5 FROM brands WHERE slug = 'apple'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'imac', 'iMac', 6 FROM brands WHERE slug = 'apple'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'mac-mini', 'Mac Mini', 7 FROM brands WHERE slug = 'apple'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'ipod', 'iPod', 8 FROM brands WHERE slug = 'apple'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- Samsung subcategories
INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'galaxy-s', 'Galaxy S', 1 FROM brands WHERE slug = 'samsung'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'galaxy-a', 'Galaxy A', 2 FROM brands WHERE slug = 'samsung'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'galaxy-tab', 'Galaxy Tab', 3 FROM brands WHERE slug = 'samsung'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'galaxy-watch', 'Galaxy Watch', 4 FROM brands WHERE slug = 'samsung'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'galaxy-z', 'Galaxy Z', 5 FROM brands WHERE slug = 'samsung'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- Google subcategories
INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'pixel', 'Pixel', 1 FROM brands WHERE slug = 'google'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'pixel-tablet', 'Pixel Tablet', 2 FROM brands WHERE slug = 'google'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'pixel-watch', 'Pixel Watch', 3 FROM brands WHERE slug = 'google'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- Huawei subcategories
INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'p-series', 'P Series', 1 FROM brands WHERE slug = 'huawei'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'mate-series', 'Mate Series', 2 FROM brands WHERE slug = 'huawei'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'nova-series', 'Nova Series', 3 FROM brands WHERE slug = 'huawei'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'huawei-tablets', 'Tablets', 4 FROM brands WHERE slug = 'huawei'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- Xiaomi subcategories
INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'mi-series', 'Mi Series', 1 FROM brands WHERE slug = 'xiaomi'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'redmi', 'Redmi', 2 FROM brands WHERE slug = 'xiaomi'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'poco', 'Poco', 3 FROM brands WHERE slug = 'xiaomi'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'xiaomi-tablets', 'Tablets', 4 FROM brands WHERE slug = 'xiaomi'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- Motorola subcategories
INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'moto-g', 'Moto G', 1 FROM brands WHERE slug = 'motorola'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'moto-edge', 'Moto Edge', 2 FROM brands WHERE slug = 'motorola'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'razr', 'Razr', 3 FROM brands WHERE slug = 'motorola'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- OnePlus subcategories
INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'oneplus-series', 'OnePlus Series', 1 FROM brands WHERE slug = 'oneplus'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'nord-series', 'Nord Series', 2 FROM brands WHERE slug = 'oneplus'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- OPPO subcategories
INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'find-series', 'Find Series', 1 FROM brands WHERE slug = 'oppo'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'reno-series', 'Reno Series', 2 FROM brands WHERE slug = 'oppo'
ON CONFLICT (brand_id, slug) DO NOTHING;

INSERT INTO subcategories (brand_id, slug, name, sort_order) 
SELECT id, 'a-series', 'A Series', 3 FROM brands WHERE slug = 'oppo'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- Done!
SELECT 'Subcategories restored successfully!' as status;
