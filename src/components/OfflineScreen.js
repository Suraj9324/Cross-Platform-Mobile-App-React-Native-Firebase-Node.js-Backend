/**
 * Offline Screen Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OfflineScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline Mode</Text>
      <Text style={styles.message}>You're currently offline. Some features may be limited.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default OfflineScreen;

