import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

const isFirebaseConfigValid = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!isFirebaseConfigValid) {
  if (typeof window !== 'undefined') {
    console.error(
      'Firebase config is incomplete or invalid. Verify NEXT_PUBLIC_FIREBASE_* env vars in .env.local.'
    );
  }
  // Provide dummy values or throw error if preferred. 
  // For CRM, we probably want to throw or handle at higher level.
  // Here we'll cast to avoid null errors, assuming the user will fix env vars.
  app = null as any;
  auth = null as any;
  db = null as any;
} else {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db, firebaseConfig };
export const isConfigured = isFirebaseConfigValid;
