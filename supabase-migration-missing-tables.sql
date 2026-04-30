-- ============================================
-- RAIS CRM - Migration for Missing Tables
-- Run this in Supabase SQL Editor to create
-- the tables that don't exist yet:
-- - team_members
-- - inventory_alerts
-- Also adds contacts and reviews tables if missing
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Team Members Table
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'editor')) DEFAULT 'editor',
  team_id TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Inventory Alerts Table
-- ============================================
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('low_stock', 'out_of_stock')) NOT NULL,
  threshold INTEGER NOT NULL,
  current_inventory INTEGER NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  team_id TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Contacts Table (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Reviews Table (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_product_id ON inventory_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_team_id ON inventory_alerts(team_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_acknowledged ON inventory_alerts(acknowledged);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Team Members policies
DROP POLICY IF EXISTS "Authenticated can read team_members" ON team_members;
DROP POLICY IF EXISTS "Authenticated can insert team_members" ON team_members;
DROP POLICY IF EXISTS "Authenticated can update team_members" ON team_members;
DROP POLICY IF EXISTS "Authenticated can delete team_members" ON team_members;

CREATE POLICY "Authenticated can read team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert team_members" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update team_members" ON team_members FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete team_members" ON team_members FOR DELETE USING (true);

-- Inventory Alerts policies
DROP POLICY IF EXISTS "Authenticated can read inventory_alerts" ON inventory_alerts;
DROP POLICY IF EXISTS "Authenticated can insert inventory_alerts" ON inventory_alerts;
DROP POLICY IF EXISTS "Authenticated can update inventory_alerts" ON inventory_alerts;
DROP POLICY IF EXISTS "Authenticated can delete inventory_alerts" ON inventory_alerts;

CREATE POLICY "Authenticated can read inventory_alerts" ON inventory_alerts FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert inventory_alerts" ON inventory_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update inventory_alerts" ON inventory_alerts FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete inventory_alerts" ON inventory_alerts FOR DELETE USING (true);

-- Contacts policies
DROP POLICY IF EXISTS "Public can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can read contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can delete contacts" ON contacts;

CREATE POLICY "Public can insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Authenticated can delete contacts" ON contacts FOR DELETE USING (true);

-- Reviews policies
DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
DROP POLICY IF EXISTS "Public can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated can update reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated can delete reviews" ON reviews;

CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete reviews" ON reviews FOR DELETE USING (true);
