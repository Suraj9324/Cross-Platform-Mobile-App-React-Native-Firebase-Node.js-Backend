/**
 * Push Notifications Service
 * Firebase Cloud Messaging integration
 */

import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PushNotificationService {
  async requestPermission() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        return true;
      }
      return false;
    } else {
      // Android
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }

  async getFCMToken() {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return null;
      }

      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcm_token', token);
        console.log('FCM Token:', token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  async deleteToken() {
    try {
      await messaging().deleteToken();
      await AsyncStorage.removeItem('fcm_token');
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }

  setupNotificationHandlers() {
    // Foreground message handler
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'You have a new message'
      );
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message:', remoteMessage);
    });

    // Notification opened handler
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened:', remoteMessage);
      // Navigate to specific screen based on notification data
    });

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
        }
      });
  }

  async subscribeToTopic(topic) {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  async unsubscribeFromTopic(topic) {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }
}

export default new PushNotificationService();

