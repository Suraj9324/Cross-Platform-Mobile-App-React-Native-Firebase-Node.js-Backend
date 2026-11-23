/**
 * Node.js Backend API for React Native Mobile App
 * RESTful API with Firebase Admin SDK and caching
 */

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Cache configuration (5 minutes TTL)
const cache = new NodeCache({ stdTTL: 300 });

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ==================== USER ROUTES ====================

// Get user profile
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const cacheKey = `user_${req.user.uid}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = { id: userDoc.id, ...userDoc.data() };
    cache.set(cacheKey, userData);

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

// Update user profile
app.put('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const { name, photoURL } = req.body;
    
    await db.collection('users').doc(req.user.uid).update({
      name,
      photoURL,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Clear cache
    cache.del(`user_${req.user.uid}`);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// ==================== DATA ROUTES ====================

// Get items with caching
app.get('/api/items', authenticateToken, async (req, res) => {
  try {
    const cacheKey = `items_${req.user.uid}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const snapshot = await db
      .collection('items')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    cache.set(cacheKey, items);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', details: error.message });
  }
});

// Create item
app.post('/api/items', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    const itemRef = await db.collection('items').add({
      userId: req.user.uid,
      title,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Clear cache
    cache.del(`items_${req.user.uid}`);

    res.status(201).json({ id: itemRef.id, message: 'Item created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item', details: error.message });
  }
});

// ==================== PUSH NOTIFICATIONS ====================

// Send push notification
app.post('/api/notifications/send', authenticateToken, async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token,
    };

    const response = await admin.messaging().send(message);
    res.json({ messageId: response, message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

// ==================== THIRD-PARTY INTEGRATIONS ====================

// Example: External API integration with caching
app.get('/api/external/data', authenticateToken, async (req, res) => {
  try {
    const cacheKey = 'external_data';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Call external API
    const response = await axios.get('https://api.example.com/data', {
      headers: { 'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}` },
    });

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch external data', details: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    cache: {
      keys: cache.keys().length,
      hits: cache.getStats().hits,
      misses: cache.getStats().misses,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

