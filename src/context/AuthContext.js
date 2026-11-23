/**
 * Authentication Context
 * Firebase authentication state management
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID', // From Firebase Console
    });

    // Listen for auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await firestore()
          .collection('users')
          .doc(firebaseUser.uid)
          .get();
        
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userDoc.data(),
        };

        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signUp = async (email, password, name) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Create user document in Firestore
      await firestore().collection('users').doc(userCredential.user.uid).set({
        email,
        name,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Update display name
      await userCredential.user.updateProfile({ displayName: name });
      
      return userCredential;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      // Create or update user document
      await firestore().collection('users').doc(userCredential.user.uid).set({
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        createdAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      return userCredential;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      throw new Error('Sign out failed');
    }
  };

  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'User account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/weak-password':
        return 'Password is too weak';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

