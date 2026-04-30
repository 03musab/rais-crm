import { supabase } from './supabase';
import { Service } from '@/types';

export async function createService(data: Omit<Service, 'id' | 'created_at'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('services')
    .insert(data)
    .select('id')
    .single();
  
  if (error) throw error;
  return result.id;
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getActiveServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getService(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  return data;
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  const { error } = await supabase
    .from('services')
    .update(data)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
