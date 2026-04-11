import { 
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, ProductVariant } from '@/types';

export async function createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), {
    ...data,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  });
  return docRef.id;
}

export async function getProducts(teamId?: string): Promise<Product[]> {
  let q;
  if (teamId && teamId !== 'default') {
    q = query(
      collection(db, 'products'),
      where('teamId', '==', teamId),
      orderBy('created_at', 'desc')
    );
  } else {
    q = query(
      collection(db, 'products'),
      orderBy('created_at', 'desc')
    );
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at?.toDate?.()?.toISOString() || '',
    updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || '',
  })) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Product;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...data,
    updated_at: Timestamp.now(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
}

export async function createVariant(productId: string, data: Omit<ProductVariant, 'id' | 'created_at'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products', productId, 'variants'), {
    ...data,
    created_at: Timestamp.now(),
  });
  return docRef.id;
}

export async function getVariants(productId: string): Promise<ProductVariant[]> {
  const q = query(collection(db, 'products', productId, 'variants'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at?.toDate?.()?.toISOString() || '',
  })) as ProductVariant[];
}

export async function updateVariant(productId: string, variantId: string, data: Partial<ProductVariant>): Promise<void> {
  const docRef = doc(db, 'products', productId, 'variants', variantId);
  await updateDoc(docRef, data);
}

export async function deleteVariant(productId: string, variantId: string): Promise<void> {
  const docRef = doc(db, 'products', productId, 'variants', variantId);
  await deleteDoc(docRef);
}
