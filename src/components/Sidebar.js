/**
 * Sidebar Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Sidebar = ({ user }) => {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.userName}>{user?.name || 'User'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Sidebar;

