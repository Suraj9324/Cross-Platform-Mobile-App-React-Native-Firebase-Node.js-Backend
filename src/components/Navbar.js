/**
 * Navigation Bar Component
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ user, onLogout, notifications }) => {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>App Name</Text>
      <TouchableOpacity onPress={onLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logout: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default Navbar;

