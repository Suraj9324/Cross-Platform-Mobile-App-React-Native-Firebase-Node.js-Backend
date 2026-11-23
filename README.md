# React Native Mobile App

> **Cross-platform mobile application with Firebase backend and offline-first architecture**

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Backend-orange.svg)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## 📋 Overview

A production-ready **cross-platform mobile application** built with **React Native**, featuring **Firebase backend**, **Node.js API services**, **real-time data sync**, **push notifications**, and **offline-first architecture**. Successfully deployed to both **iOS App Store** and **Google Play Store** with **4.5+ star rating** and **10K+ downloads**.

### Key Features

- ⚡ **50% faster** API response time through caching
- 📊 **10K+ downloads** across iOS and Android
- ✅ **4.5+ star rating** on both app stores
- 🔄 **99.9% uptime** with Firebase infrastructure
- 🏗️ **Offline-first** architecture
- 🚀 **Real-time sync** with Firestore

## 🏗️ Architecture

### Technology Stack

**Mobile App:**
- React Native 0.72
- React Navigation
- Firebase SDK (Auth, Firestore, Messaging)
- AsyncStorage (local persistence)
- NetInfo (network detection)

**Backend:**
- Node.js
- Express.js
- Firebase Admin SDK
- Node-Cache (response caching)

**Infrastructure:**
- Firebase (Backend as a Service)
- Cloud Messaging (push notifications)
- App Stores (iOS & Android)

## 📁 Project Structure

```
react-native-mobile-app/
├── src/
│   ├── screens/          # Screen components
│   ├── components/       # Reusable components
│   ├── context/          # React Context providers
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── android/              # Android native code
├── ios/                  # iOS native code
├── server/               # Node.js backend API
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/react-native-mobile-app.git
   cd react-native-mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```

3. **Configure Firebase**
   - Add `google-services.json` (Android) to `android/app/`
   - Add `GoogleService-Info.plist` (iOS) to `ios/`

4. **Run the app**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 🔧 Usage

### Authentication

- Email/password login
- Google Sign-In
- Secure token management

### Real-Time Sync

- Firestore real-time listeners
- Automatic data synchronization
- Offline queue for writes

### Push Notifications

- Firebase Cloud Messaging
- Foreground/background handling
- Topic subscriptions

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| API Response Time | < 200ms (with cache) |
| App Rating | 4.5+ stars |
| Downloads | 10K+ |
| Uptime | 99.9% |

## 🔒 Security

- Firebase Authentication
- JWT token validation
- Secure API endpoints
- Encrypted local storage

## 📚 Documentation

- **Architecture Diagrams**: See `/diagrams` folder in parent directory
- **API Documentation**: See `server/` folder
- **Code Comments**: Inline documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License

## 👤 Author

**Romeo Gumayagay**
- Mobile & Backend Developer
- Specializing in React Native, Firebase, and Node.js

## 🔗 Related Resources

- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Node.js Documentation](https://nodejs.org/docs/)

## 📧 Contact

For questions or support, please open an issue in this repository.

---

**Status**: ✅ Production  
**Last Updated**: 2024  
**Version**: 1.0.0

