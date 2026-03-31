# Firebase Integration Complete

I have integrated Firebase into your SMM Dashboard project. All fake data has been replaced with real-time data from Firestore, and Google Authentication is now active.

## 1. Firebase Setup Steps

1.  **Create Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Firestore**:
    *   Initialize Firestore in Test Mode (or apply security rules below).
    *   Location: Choose nearest.
3.  **Enable Authentication**:
    *   Go to Authentication > Sign-in method.
    *   Enable **Google**.
4.  **Enable Storage**:
    *   Initialize Storage.

## 2. Environment Variables (.env)

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...
```

## 3. Firestore Security Rules

Copy these into your Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /projects/{projectId} {
      allow read, write: if request.auth != null && (resource == null || resource.data.userId == request.auth.uid);
    }
    match /posts/{postId} {
      allow read, write: if request.auth != null && (resource == null || resource.data.userId == request.auth.uid);
    }
    match /media_files/{fileId} {
      allow read, write: if request.auth != null && (resource == null || resource.data.userId == request.auth.uid);
    }
    match /activity_logs/{logId} {
      allow read: if request.auth != null && (resource == null || resource.data.userId == request.auth.uid);
      allow create: if request.auth != null;
    }
  }
}
```

## 4. How to Run

1.  Install dependencies: `npm install firebase react-hot-toast`
2.  Add your keys to `.env`
3.  Run `npm run dev`
