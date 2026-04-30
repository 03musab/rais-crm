import { supabase } from './supabase';
import { InventoryAlert } from '@/types';

export async function createAlert(data: Omit<InventoryAlert, 'id' | 'created_at'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('inventory_alerts')
    .insert({ ...data, created_at: new Date().toISOString() })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function getAlerts(teamId?: string, acknowledged?: boolean): Promise<InventoryAlert[]> {
  let query = supabase
    .from('inventory_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (teamId && teamId !== 'default') {
    query = query.eq('team_id', teamId);
  }

  if (acknowledged !== undefined) {
    query = query.eq('acknowledged', acknowledged);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function acknowledgeAlert(id: string): Promise<void> {
  const { error } = await supabase
    .from('inventory_alerts')
    .update({ acknowledged: true })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteAlert(id: string): Promise<void> {
  const { error } = await supabase.from('inventory_alerts').delete().eq('id', id);
  if (error) throw error;
}

export async function checkAndCreateAlerts(
  teamId: string,
  productId: string,
  variantId: string | null,
  currentInventory: number,
  threshold: number
): Promise<void> {
  const type = currentInventory === 0 ? 'out_of_stock' : 'low_stock';

  const { data: existing, error: queryError } = await supabase
    .from('inventory_alerts')
    .select('id')
    .eq('product_id', productId)
    .eq('variant_id', variantId)
    .eq('acknowledged', false);

  if (queryError) throw queryError;

  if (!existing || existing.length === 0) {
    await createAlert({
      team_id: teamId,
      product_id: productId,
      variant_id: variantId,
      type,
      threshold,
      current_inventory: currentInventory,
      acknowledged: false,
    });
  }
}
