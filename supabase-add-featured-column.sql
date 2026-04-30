-- Run this in Supabase SQL Editor to add featured column to products table

ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;

-- Optional: Set some products as featured (uncomment and modify as needed)
-- UPDATE products SET featured = true WHERE id IN ('product-id-1', 'product-id-2');
