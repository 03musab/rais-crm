import { 
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { Category } from '@/types';

export async function createCategory(data: Omit<Category, 'id' | 'created_at'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'categories'), {
    ...data,
    created_at: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getCategories(teamId: string): Promise<Category[]> {
  const q = query(
    collection(db, 'categories'),
    where('teamId', '==', teamId),
    orderBy('name', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at,
  })) as Category[];
}

export async function getCategory(id: string): Promise<Category | null> {
  const docRef = doc(db, 'categories', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Category;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, data);
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, 'categories', id);
  await deleteDoc(docRef);
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
