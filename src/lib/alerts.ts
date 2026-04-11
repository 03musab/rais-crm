import { 
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { InventoryAlert } from '@/types';

export async function createAlert(data: Omit<InventoryAlert, 'id' | 'created_at'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'alerts'), {
    ...data,
    created_at: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getAlerts(teamId: string, acknowledged?: boolean): Promise<InventoryAlert[]> {
  let q;
  if (acknowledged !== undefined) {
    q = query(
      collection(db, 'alerts'),
      where('teamId', '==', teamId),
      where('acknowledged', '==', acknowledged),
      orderBy('created_at', 'desc')
    );
  } else {
    q = query(
      collection(db, 'alerts'),
      where('teamId', '==', teamId),
      orderBy('created_at', 'desc')
    );
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at,
    team_id: doc.data().teamId,
  })) as InventoryAlert[];
}

export async function acknowledgeAlert(id: string): Promise<void> {
  const docRef = doc(db, 'alerts', id);
  await updateDoc(docRef, { acknowledged: true });
}

export async function deleteAlert(id: string): Promise<void> {
  const docRef = doc(db, 'alerts', id);
  await deleteDoc(docRef);
}

export async function checkAndCreateAlerts(
  teamId: string,
  productId: string,
  variantId: string | null,
  currentInventory: number,
  threshold: number
): Promise<void> {
  const type = currentInventory === 0 ? 'out_of_stock' : 'low_stock';

  const alertsRef = collection(db, 'alerts');
  const q = query(
    alertsRef,
    where('productId', '==', productId),
    where('variantId', '==', variantId),
    where('acknowledged', '==', false)
  );
  const existing = await getDocs(q);

  if (existing.empty) {
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
