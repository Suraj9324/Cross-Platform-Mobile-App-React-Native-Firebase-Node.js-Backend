/**
 * Home Screen Component
 * Main screen with real-time data sync and offline support
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useNetwork } from '../context/NetworkContext';

const HomeScreen = () => {
  const { user } = useAuth();
  const { isConnected } = useNetwork();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    setupRealtimeListener();
  }, []);

  const loadData = async () => {
    try {
      if (isConnected) {
        // Load from Firestore
        const snapshot = await firestore()
          .collection('items')
          .where('userId', '==', user.uid)
          .orderBy('createdAt', 'desc')
          .limit(20)
          .get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(data);
        // Cache data for offline use
        await AsyncStorage.setItem('cached_items', JSON.stringify(data));
      } else {
        // Load from cache
        const cached = await AsyncStorage.getItem('cached_items');
        if (cached) {
          setItems(JSON.parse(cached));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeListener = () => {
    if (!isConnected) return;

    const unsubscribe = firestore()
      .collection('items')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .onSnapshot(
        snapshot => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setItems(data);
          // Update cache
          AsyncStorage.setItem('cached_items', JSON.stringify(data));
        },
        error => {
          console.error('Realtime listener error:', error);
        }
      );

    return () => unsubscribe();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemDate}>
        {new Date(item.createdAt?.toDate()).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        {!isConnected && (
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  offlineBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  itemDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default HomeScreen;

