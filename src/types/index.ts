export type UserRole = 'admin' | 'manager' | 'editor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: UserRole;
  user?: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  teamId: string;
  created_at: string;
  children?: Category[];
}

export type SectionType = 'homepage' | 'featured' | 'promotions' | 'category';

export interface Section {
  id: string;
  name: string;
  type: SectionType;
  description: string | null;
  teamId: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  inventory: number;
  low_stock_threshold: number;
  attributes: Record<string, string>;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  status: 'active' | 'draft' | 'archived';
  section_id: string | null;
  category_ids: string[];
  low_stock_threshold: number;
  teamId: string;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
  section?: Section;
  categories?: Category[];
}

export interface SectionProduct {
  id: string;
  section_id: string;
  product_id: string;
  position: number;
  start_date: string | null;
  end_date: string | null;
  product?: Product;
}

export interface InventoryAlert {
  id: string;
  product_id: string;
  variant_id: string | null;
  type: 'low_stock' | 'out_of_stock';
  threshold: number;
  current_inventory: number;
  acknowledged: boolean;
  teamId: string;
  created_at: string;
}

export interface SectionAnalytics {
  section_id: string;
  section_name: string;
  product_count: number;
  total_inventory: number;
  low_stock_count: number;
}

export type ServiceBadge = 'Popular' | 'Corporate' | 'Artisan' | 'Bulk' | null;

export interface Service {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  badge: ServiceBadge;
  icon: string;
  whatsapp_message?: string;
  whatsappMessage?: string;
  display_order?: number;
  displayOrder?: number;
  created_at?: string;
}

export type PortfolioCategory = 'embroidery' | 'stitching' | 'logos' | 'alterations';

export interface PortfolioItem {
  id: string;
  image_url?: string;
  imageUrl?: string;
  title: string;
  category: PortfolioCategory;
  display_order?: number;
  displayOrder?: number;
  created_at?: string;
}
