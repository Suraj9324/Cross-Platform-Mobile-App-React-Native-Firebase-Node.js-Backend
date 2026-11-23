/**
 * Notification Center Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationCenter = ({ notifications, onUpdate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {notifications.length === 0 && (
        <Text style={styles.empty}>No notifications</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    color: '#8E8E93',
    fontSize: 14,
  },
});

export default NotificationCenter;

