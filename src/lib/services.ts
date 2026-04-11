import { supabase } from './supabase';
import { Service } from '@/types';

export async function createService(data: Omit<Service, 'id'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('services')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result.id;
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });
  
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