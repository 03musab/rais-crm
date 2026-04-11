import { 
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, 
  query, orderBy, where 
} from 'firebase/firestore';
import { db } from './firebase';
import { PortfolioItem, PortfolioCategory } from '@/types';

export async function createPortfolioItem(data: Omit<PortfolioItem, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'portfolio'), {
    ...data,
  });
  return docRef.id;
}

export async function getPortfolioItems(category?: PortfolioCategory): Promise<PortfolioItem[]> {
  let q;
  
  if (category) {
    q = query(
      collection(db, 'portfolio'),
      where('category', '==', category),
      orderBy('displayOrder', 'asc')
    );
  } else {
    q = query(
      collection(db, 'portfolio'),
      orderBy('displayOrder', 'asc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as PortfolioItem[];
}

export async function getPortfolioItem(id: string): Promise<PortfolioItem | null> {
  const docRef = doc(db, 'portfolio', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as PortfolioItem;
}

export async function updatePortfolioItem(id: string, data: Partial<PortfolioItem>): Promise<void> {
  const docRef = doc(db, 'portfolio', id);
  await updateDoc(docRef, data);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const docRef = doc(db, 'portfolio', id);
  await deleteDoc(docRef);
}