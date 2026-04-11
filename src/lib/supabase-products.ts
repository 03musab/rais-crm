import { supabase } from './supabase';
import { Product, ProductVariant } from '@/types';

export async function createProduct(
  data: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
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
    query = query.eq('teamId', teamId);
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

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
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

export async function createVariant(
  productId: string,
  data: Omit<ProductVariant, 'id' | 'created_at' | 'product_id'>
): Promise<string> {
  const { data: result, error } = await supabase
    .from('product_variants')
    .insert({
      ...data,
      product_id: productId,
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function getVariants(productId: string): Promise<ProductVariant[]> {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId);

  if (error) throw error;
  return data || [];
}

export async function updateVariant(
  productId: string,
  variantId: string,
  data: Partial<ProductVariant>
): Promise<void> {
  const { error } = await supabase
    .from('product_variants')
    .update(data)
    .eq('id', variantId)
    .eq('product_id', productId);

  if (error) throw error;
}

export async function deleteVariant(
  productId: string,
  variantId: string
): Promise<void> {
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', variantId)
    .eq('product_id', productId);

  if (error) throw error;
}

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
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
