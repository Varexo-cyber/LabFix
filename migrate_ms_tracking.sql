-- Add tracking number column for MobileSentrix order sync
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ms_tracking_number TEXT DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
