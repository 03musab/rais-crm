import { supabase } from './supabase';

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateReview(id: string, data: Partial<Review>): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .update(data)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}
