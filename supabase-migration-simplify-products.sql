-- Migration: Simplify products table for CRM + Portfolio sync
-- Run this in Supabase SQL Editor

-- 1. Add new columns for website compatibility
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'embroidery',
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Migrate existing data: copy name -> title, images[0] -> image_url
UPDATE products
SET 
  title = name,
  image_url = CASE 
    WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN images[1]
    ELSE NULL
  END
WHERE title IS NULL;

-- 3. Drop columns we no longer need in the simplified CRM
ALTER TABLE products
  DROP COLUMN IF EXISTS price,
  DROP COLUMN IF EXISTS inventory,
  DROP COLUMN IF EXISTS low_stock_threshold,
  DROP COLUMN IF EXISTS section_id,
  DROP COLUMN IF EXISTS category_ids,
  DROP COLUMN IF EXISTS images,
  DROP COLUMN IF EXISTS status;

-- 4. Make title required
ALTER TABLE products ALTER COLUMN title SET NOT NULL;

-- 5. Add indexes for website queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_desc ON products(created_at DESC);
