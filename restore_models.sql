-- Restore all models for all subcategories
-- Run this after restore_subcategories.sql

-- Samsung Galaxy S Series models
INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s26-ultra', 'Galaxy S26 Ultra', 1 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s26-plus', 'Galaxy S26+', 2 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s26', 'Galaxy S26', 3 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s25-ultra', 'Galaxy S25 Ultra', 4 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s25-plus', 'Galaxy S25+', 5 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s25', 'Galaxy S25', 6 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s24-ultra', 'Galaxy S24 Ultra', 7 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s24-plus', 'Galaxy S24+', 8 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s24', 'Galaxy S24', 9 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s24-fe', 'Galaxy S24 FE', 10 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s23-ultra', 'Galaxy S23 Ultra', 11 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s23-plus', 'Galaxy S23+', 12 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s23', 'Galaxy S23', 13 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s23-fe', 'Galaxy S23 FE', 14 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s22-ultra', 'Galaxy S22 Ultra', 15 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s22-plus', 'Galaxy S22+', 16 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s22', 'Galaxy S22', 17 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s21-ultra', 'Galaxy S21 Ultra', 18 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s21-plus', 'Galaxy S21+', 19 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-s21', 'Galaxy S21', 20 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-s'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Samsung Galaxy A Series models
INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a56', 'Galaxy A56', 1 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a36', 'Galaxy A36', 2 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a26', 'Galaxy A26', 3 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a25', 'Galaxy A25', 4 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a16', 'Galaxy A16', 5 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a15', 'Galaxy A15', 6 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a14', 'Galaxy A14', 7 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a05', 'Galaxy A05', 8 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a05s', 'Galaxy A05s', 9 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-a04s', 'Galaxy A04s', 10 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-a'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Samsung Galaxy Z Series models
INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-z-fold6', 'Galaxy Z Fold6', 1 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-z'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-z-flip6', 'Galaxy Z Flip6', 2 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-z'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-z-fold5', 'Galaxy Z Fold5', 3 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-z'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-z-flip5', 'Galaxy Z Flip5', 4 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-z'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Samsung Galaxy Tab models
INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-tab-s10-ultra', 'Galaxy Tab S10 Ultra', 1 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-tab'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-tab-s10-plus', 'Galaxy Tab S10+', 2 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-tab'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-tab-s9-ultra', 'Galaxy Tab S9 Ultra', 3 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-tab'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-tab-s9-plus', 'Galaxy Tab S9+', 4 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-tab'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-tab-a9-plus', 'Galaxy Tab A9+', 5 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-tab'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'galaxy-tab-active5', 'Galaxy Tab Active5', 6 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'samsung' AND s.slug = 'galaxy-tab'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Apple iPhone models
INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-16-pro-max', 'iPhone 16 Pro Max', 1 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-16-pro', 'iPhone 16 Pro', 2 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-16-plus', 'iPhone 16 Plus', 3 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-16', 'iPhone 16', 4 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-15-pro-max', 'iPhone 15 Pro Max', 5 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-15-pro', 'iPhone 15 Pro', 6 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-15-plus', 'iPhone 15 Plus', 7 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-15', 'iPhone 15', 8 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-14-pro-max', 'iPhone 14 Pro Max', 9 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-14-pro', 'iPhone 14 Pro', 10 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-14-plus', 'iPhone 14 Plus', 11 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-14', 'iPhone 14', 12 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-se-3', 'iPhone SE (3rd gen)', 13 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-13-pro-max', 'iPhone 13 Pro Max', 14 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-13-pro', 'iPhone 13 Pro', 15 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-13', 'iPhone 13', 16 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-13-mini', 'iPhone 13 mini', 17 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-12', 'iPhone 12', 18 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-12-pro', 'iPhone 12 Pro', 19 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-12-pro-max', 'iPhone 12 Pro Max', 20 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-11', 'iPhone 11', 21 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-11-pro', 'iPhone 11 Pro', 22 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-11-pro-max', 'iPhone 11 Pro Max', 23 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-xr', 'iPhone XR', 24 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-xs', 'iPhone XS', 25 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-xs-max', 'iPhone XS Max', 26 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-x', 'iPhone X', 27 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-8', 'iPhone 8', 28 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-8-plus', 'iPhone 8 Plus', 29 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-7', 'iPhone 7', 30 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-7-plus', 'iPhone 7 Plus', 31 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-se-2', 'iPhone SE (2020)', 32 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'iphone-se-1', 'iPhone SE (2016)', 33 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'iphone'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Apple iPad models
INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-pro-13-2025', 'iPad Pro 13" (2025)', 1 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-pro-11-2025', 'iPad Pro 11" (2025)', 2 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-pro-13-2024', 'iPad Pro 13" (2024)', 3 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-pro-11-2024', 'iPad Pro 11" (2024)', 4 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-air-13-2024', 'iPad Air 13" (2024)', 5 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-air-11-2024', 'iPad Air 11" (2024)', 6 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-pro-12-9-2022', 'iPad Pro 12.9" (2022)', 7 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-pro-11-2022', 'iPad Pro 11" (2022)', 8 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-air-5', 'iPad Air (5th gen)', 9 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-10', 'iPad (10th gen)', 10 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-9', 'iPad (9th gen)', 11 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-mini-6', 'iPad mini (6th gen)', 12 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-pro-12-9-2021', 'iPad Pro 12.9" (2021)', 13 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

INSERT INTO models (subcategory_id, slug, name, sort_order)
SELECT s.id, 'ipad-pro-11-2021', 'iPad Pro 11" (2021)', 14 
FROM subcategories s 
JOIN brands b ON s.brand_id = b.id 
WHERE b.slug = 'apple' AND s.slug = 'ipad'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Done! Models restored
SELECT 'Models restored successfully!' as status;
