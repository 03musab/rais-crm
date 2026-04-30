import { supabase } from './supabase';
import { Product } from '@/types';

export async function createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('products')
    .insert({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function getProducts(teamId?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (teamId && teamId !== 'default') {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteProductImage(url: string): Promise<void> {
  const fileName = url.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from('product-images')
    .remove([fileName]);

  if (error) throw error;
}

export async function getDashboardStats(teamId?: string) {
  let query = supabase
    .from('products')
    .select('id, title, image_url');

  if (teamId && teamId !== 'default') {
    query = query.eq('team_id', teamId);
  }

  const { data: products } = await query;

  const productList = products || [];
  const totalProducts = productList.length;
  const productsWithImages = productList.filter(p => p.image_url).length;

  return {
    totalProducts,
    productsWithImages,
    missingImages: totalProducts - productsWithImages,
  };
}
