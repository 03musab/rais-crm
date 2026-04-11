import { supabase } from './supabase';
import { PortfolioItem, PortfolioCategory } from '@/types';

export async function createPortfolioItem(data: Omit<PortfolioItem, 'id'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('portfolio')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result.id;
}

export async function getPortfolioItems(category?: PortfolioCategory): Promise<PortfolioItem[]> {
  let query = supabase
    .from('portfolio')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function getPortfolioItem(id: string): Promise<PortfolioItem | null> {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  return data;
}

export async function updatePortfolioItem(id: string, data: Partial<PortfolioItem>): Promise<void> {
  const { error } = await supabase
    .from('portfolio')
    .update(data)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}