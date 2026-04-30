import { supabase } from './supabase';
import { Section, SectionType } from '@/types';

export async function createSection(data: Omit<Section, 'id' | 'created_at'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('sections')
    .insert({ ...data, created_at: new Date().toISOString() })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function getSections(teamId?: string): Promise<Section[]> {
  let query = supabase
    .from('sections')
    .select('*')
    .order('created_at', { ascending: false });

  if (teamId && teamId !== 'default') {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getSection(id: string): Promise<Section | null> {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function updateSection(id: string, data: Partial<Section>): Promise<void> {
  const { error } = await supabase
    .from('sections')
    .update(data)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase.from('sections').delete().eq('id', id);
  if (error) throw error;
}

export async function createDefaultSections(teamId?: string): Promise<void> {
  const defaults: { name: string; type: SectionType; description: string }[] = [
    { name: 'Homepage', type: 'homepage', description: 'Featured products on the homepage' },
    { name: 'Featured', type: 'featured', description: 'Highlighted products across the site' },
    { name: 'Promotions', type: 'promotions', description: 'Products on sale and promotions' },
    { name: 'Categories', type: 'category', description: 'Products organized by category' },
  ];

  for (const section of defaults) {
    await supabase
      .from('sections')
      .insert({ ...section, team_id: teamId || 'default' });
  }
}
