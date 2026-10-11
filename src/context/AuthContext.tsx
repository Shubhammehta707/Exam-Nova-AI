import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../services/firebase';

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt?: any;
  updatedAt?: any;
  targetExam?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  authActionLoading: boolean;
  authError: string | null;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogleProvider: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Human-friendly error translation helper
export function formatAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';
  const message = error.message || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in or reset your password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address (e.g. student@school.edu).';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please double-check your credentials.';
    case 'auth/user-not-found':
      return 'No registered account found with this email. Please check your spelling or sign up.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled before completion. Please try again.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups for this tab to sign in with Google.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please reset your password or wait a few minutes before trying again.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connectivity.';
    case 'auth/operation-not-allowed':
      return 'This sign-in provider is not enabled in Firebase Console. Please verify Email/Password or Google provider is enabled.';
    default:
      if (message.includes('offline')) {
        return 'Network offline. Please check your internet connection.';
      }
      return message || 'Authentication failed. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync or create user profile doc in Firestore
  const syncUserProfile = async (firebaseUser: User, customName?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      const resolvedName = customName || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Class 12 Scholar');

      if (!userSnap.exists()) {
        const newProfile: UserProfileData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: resolvedName,
          targetExam: 'CBSE Class 12 Boards 2026-27',
        };
        await setDoc(userRef, {
          userId: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: resolvedName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          targetExam: 'CBSE Class 12 Boards 2026-27',
        });
        setUserProfile(newProfile);
      } else {
        const data = userSnap.data();
        setUserProfile({
          uid: firebaseUser.uid,
          email: data.email || firebaseUser.email,
          displayName: data.displayName || resolvedName,
          targetExam: data.targetExam || 'CBSE Class 12 Boards 2026-27',
        });
      }
    } catch (err) {
      console.warn('Profile sync notice (non-fatal):', err);
      // Fallback local profile representation if Firestore rules or offline
      setUserProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: customName || firebaseUser.displayName || 'Class 12 Scholar',
        targetExam: 'CBSE Class 12 Boards 2026-27',
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  // Sign Up with Email and Password
  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setAuthActionLoading(true);
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim()) {
        try {
          await updateProfile(cred.user, { displayName: name.trim() });
        } catch (profileErr) {
          console.warn('Could not set displayName on auth user:', profileErr);
        }
      }
      await syncUserProfile(cred.user, name.trim());
    } catch (err: any) {
      setAuthError(formatAuthErrorMessage(err));
      throw err;
    } finally {
      setAuthActionLoading(false);
    }
  };

  // Sign In with Email and Password
  const signInWithEmail = async (email: string, pass: string) => {
    setAuthActionLoading(true);
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await syncUserProfile(cred.user);
    } catch (err: any) {
      setAuthError(formatAuthErrorMessage(err));
      throw err;
    } finally {
      setAuthActionLoading(false);
    }
  };

  // Google Sign In via Popup
  const signInWithGoogleProvider = async () => {
    setAuthActionLoading(true);
    setAuthError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(cred.user);
    } catch (err: any) {
      setAuthError(formatAuthErrorMessage(err));
      throw err;
    } finally {
      setAuthActionLoading(false);
    }
  };

  // Password Reset Email
  const resetPassword = async (email: string) => {
    setAuthActionLoading(true);
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      setAuthError(formatAuthErrorMessage(err));
      throw err;
    } finally {
      setAuthActionLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setAuthActionLoading(true);
    setAuthError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      setAuthError(formatAuthErrorMessage(err));
      throw err;
    } finally {
      setAuthActionLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authActionLoading,
        authError,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogleProvider,
        resetPassword,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
