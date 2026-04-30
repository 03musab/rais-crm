-- Migration: Services table for Rais website
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  icon TEXT DEFAULT 'star',
  image_url TEXT,
  whatsapp_message TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order ASC);

-- Seed data
INSERT INTO services (title, description, badge, icon, sort_order) VALUES
  ('Custom Embroidery', 'Personalized embroidery on any garment with premium thread and expert craftsmanship', 'Popular', 'star', 1),
  ('Logo Design', 'Professional logo design services for businesses and organizations', 'Corporate', 'building', 2),
  ('Bespoke Tailoring', 'Custom-fit garments tailored to your exact measurements', 'Artisan', 'ruler', 3),
  ('Bulk Orders', 'Special pricing and priority fulfillment for large quantity orders', 'Bulk', 'cog', 4)
ON CONFLICT DO NOTHING;
