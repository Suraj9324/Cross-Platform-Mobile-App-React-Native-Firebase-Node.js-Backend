/**
 * React Native Mobile App - Main Application Component
 * Cross-platform mobile app with Firebase integration and offline support
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import OfflineScreen from './src/components/OfflineScreen';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NetworkProvider, useNetwork } from './src/context/NetworkContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

// Root Navigator
function RootNavigator() {
  const { user, loading } = useAuth();
  const { isConnected } = useNetwork();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {!isConnected && (
              <Stack.Screen 
                name="Offline" 
                component={OfflineScreen}
                options={{ presentation: 'modal' }}
              />
            )}
            <Stack.Screen name="Main" component={MainTabs} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App Component
function App() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Initialize app
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check for cached user data
      const cachedUser = await AsyncStorage.getItem('user');
      
      // Set up network listener
      const unsubscribe = NetInfo.addEventListener(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
      });

      setInitializing(false);
      
      return () => unsubscribe();
    } catch (error) {
      console.error('App initialization error:', error);
      setInitializing(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NetworkProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NetworkProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default App;

