import { supabase } from './supabase';
import { Category } from '@/types';

export async function createCategory(data: Omit<Category, 'id' | 'created_at'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('categories')
    .insert({ ...data, created_at: new Date().toISOString() })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function getCategories(teamId?: string): Promise<Category[]> {
  let query = supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (teamId && teamId !== 'default') {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getCategory(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  categories.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] });
  });

  map.forEach(cat => {
    if (cat.parent_id) {
      const parent = map.get(cat.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(cat);
      } else {
        roots.push(cat);
      }
    } else {
      roots.push(cat);
    }
  });

  return roots;
}
