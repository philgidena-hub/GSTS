import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBVB5s9QuTxxJjjjLFOsY18v_BGMnD-aO0',
  authDomain: 'gsts-cb4d1.firebaseapp.com',
  projectId: 'gsts-cb4d1',
  storageBucket: 'gsts-cb4d1.firebasestorage.app',
  messagingSenderId: '831779851938',
  appId: '1:831779851938:web:7b52e945f6d6d93b1a51fb',
  measurementId: 'G-BTPKL71YSG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
