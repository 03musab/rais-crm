-- ============================================
-- RAIS CRM - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Products Table
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'draft',
  section_id UUID,
  category_ids UUID[] DEFAULT '{}',
  low_stock_threshold INTEGER DEFAULT 5,
  price NUMERIC(10, 2) DEFAULT 0,
  inventory INTEGER DEFAULT 0,
  team_id TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Product Variants Table
-- ============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  price NUMERIC(10, 2) DEFAULT 0,
  compare_at_price NUMERIC(10, 2),
  inventory INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  attributes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Sections Table
-- ============================================
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('homepage', 'featured', 'promotions', 'category')) NOT NULL,
  description TEXT,
  team_id TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Categories Table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  team_id TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Section Products (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS section_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  UNIQUE(section_id, product_id)
);

-- ============================================
-- Services Table
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  badge TEXT CHECK (badge IN ('Popular', 'Corporate', 'Artisan', 'Bulk')),
  icon TEXT DEFAULT 'Star',
  whatsapp_message TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Portfolio Table
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT CHECK (category IN ('embroidery', 'stitching', 'logos', 'alterations')) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_team_id ON products(team_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_section_id ON products(section_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_section_products_section_id ON section_products(section_id);
CREATE INDEX IF NOT EXISTS idx_section_products_product_id ON section_products(product_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Public read access (for authenticated users)
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public can read sections" ON sections FOR SELECT USING (true);
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read section_products" ON section_products FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete products" ON products FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert variants" ON product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update variants" ON product_variants FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete variants" ON product_variants FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert sections" ON sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update sections" ON sections FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete sections" ON sections FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Authenticated can manage section_products" ON section_products FOR ALL USING (true);

-- Services policies (public read for frontend)
CREATE POLICY "Public can read services" ON services FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert services" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update services" ON services FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete services" ON services FOR DELETE USING (true);

-- Portfolio policies (public read for frontend)
CREATE POLICY "Public can read portfolio" ON portfolio FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert portfolio" ON portfolio FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update portfolio" ON portfolio FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete portfolio" ON portfolio FOR DELETE USING (true);

-- ============================================
-- Storage Bucket for Product Images
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product-images bucket
CREATE POLICY "Public can access product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated can delete product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');

-- ============================================
-- Function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data
-- ============================================
INSERT INTO sections (name, type, description) VALUES
  ('Homepage', 'homepage', 'Featured products on the homepage'),
  ('Featured', 'featured', 'Highlighted products across the site'),
  ('Promotions', 'promotions', 'Products on sale and promotions'),
  ('Categories', 'category', 'Products organized by category')
ON CONFLICT DO NOTHING;

INSERT INTO services (title, description, icon, badge, display_order) VALUES
  ('Custom Embroidery', 'Personalized embroidery on any garment with premium thread and expert craftsmanship', 'Needle', 'Popular', 1),
  ('Logo Design', 'Professional logo design services for businesses and organizations', 'Palette', 'Corporate', 2),
  ('Bespoke Tailoring', 'Custom-fit garments tailored to your exact measurements', 'Scissors', 'Artisan', 3),
  ('Bulk Orders', 'Special pricing and priority fulfillment for large quantity orders', 'Package', 'Bulk', 4)
ON CONFLICT DO NOTHING;

INSERT INTO portfolio (title, image_url, category, display_order) VALUES
  ('Floral Embroidery Design', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800', 'embroidery', 1),
  ('Corporate Logo Patch', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'logos', 2),
  ('Wedding Dress Alteration', 'https://images.unsplash.com/photo-1594552072238-5c4529a23b1e?w=800', 'alterations', 3),
  ('Custom Suit Tailoring', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800', 'stitching', 4)
ON CONFLICT DO NOTHING;
