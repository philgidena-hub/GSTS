import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User } from '../types';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    userData: { firstName: string; lastName: string }
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // Update display name
    await updateProfile(firebaseUser, {
      displayName: `${userData.firstName} ${userData.lastName}`,
    });

    // Create user document in Firestore
    const user: User = {
      id: firebaseUser.uid,
      email: email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'guest',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return user;
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userData = await this.getUserData(userCredential.user.uid);
    return userData;
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      // Create new user
      const nameParts = firebaseUser.displayName?.split(' ') || ['', ''];
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        role: 'guest',
        avatar: firebaseUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return user;
    }

    return userDoc.data() as User;
  },

  // Sign out
  async signOut(): Promise<void> {
    await signOut(auth);
  },

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Get user data from Firestore
  async getUserData(uid: string): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return userDoc.data() as User;
  },

  // Update user profile
  async updateUserProfile(
    uid: string,
    data: Partial<User>
  ): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },
};
