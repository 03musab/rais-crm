import { 
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { Section, SectionType } from '@/types';

export async function createSection(data: Omit<Section, 'id' | 'created_at'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'sections'), {
    ...data,
    created_at: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getSections(teamId: string): Promise<Section[]> {
  const q = query(
    collection(db, 'sections'),
    where('teamId', '==', teamId),
    orderBy('created_at', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at,
  })) as Section[];
}

export async function getSection(id: string): Promise<Section | null> {
  const docRef = doc(db, 'sections', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Section;
}

export async function updateSection(id: string, data: Partial<Section>): Promise<void> {
  const docRef = doc(db, 'sections', id);
  await updateDoc(docRef, data);
}

export async function deleteSection(id: string): Promise<void> {
  const docRef = doc(db, 'sections', id);
  await deleteDoc(docRef);
}

export async function createDefaultSections(teamId: string): Promise<void> {
  const defaults: { name: string; type: SectionType; description: string }[] = [
    { name: 'Homepage', type: 'homepage', description: 'Featured products on the homepage' },
    { name: 'Featured', type: 'featured', description: 'Highlighted products across the site' },
    { name: 'Promotions', type: 'promotions', description: 'Products on sale and promotions' },
    { name: 'Categories', type: 'category', description: 'Products organized by category' },
  ];

  for (const section of defaults) {
    await createSection({ ...section, team_id: teamId });
  }
}
