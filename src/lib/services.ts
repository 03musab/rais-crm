import { 
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, 
  query, orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { Service } from '@/types';

export async function createService(data: Omit<Service, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'services'), {
    ...data,
  });
  return docRef.id;
}

export async function getServices(): Promise<Service[]> {
  const q = query(
    collection(db, 'services'),
    orderBy('displayOrder', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Service[];
}

export async function getService(id: string): Promise<Service | null> {
  const docRef = doc(db, 'services', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Service;
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  const docRef = doc(db, 'services', id);
  await updateDoc(docRef, data);
}

export async function deleteService(id: string): Promise<void> {
  const docRef = doc(db, 'services', id);
  await deleteDoc(docRef);
}