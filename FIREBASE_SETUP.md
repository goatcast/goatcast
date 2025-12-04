# Firebase Setup Guide

## Why Nothing Happens When You Click "Create Desk"

The most common reason is that **Firebase is not configured**. Follow these steps to fix it:

## Step 1: Create a Firebase Project

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Get Started" and create a new project
3. Enter a project name (e.g., "goatcast-web")
4. Disable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Get Your Firebase Credentials

1. In your Firebase project, click the settings icon (⚙️) at the top
2. Go to "Project Settings"
3. Scroll down to "Your apps" section
4. Click on the web icon `</>` if you haven't created a web app yet
5. Enter an app name (e.g., "Goatcast Web")
6. Copy the Firebase config - you'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 3: Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create Database**
3. Select **Start in test mode** (for development)
4. Choose a region (pick closest to you)
5. Click **Enable**

## Step 4: Set Environment Variables

1. Create a `.env.local` file in the project root (same level as `package.json`)
2. Add your Firebase config:

```bash
# Farcaster
VITE_NEYNAR_API_KEY=your_neynar_api_key

# Firebase
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Step 5: Configure Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /desks/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /columns/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Step 6: Test Your Setup

1. Stop your dev server (Ctrl+C)
2. Run: `npm install`
3. Run: `npm run dev`
4. Sign in with Farcaster
5. Try clicking "New Desk" and enter a desk name
6. **Open the browser console (F12)** to see debug logs
7. If you see errors, they'll show up in the console

### Note on Firebase Indexes

The app has been optimized to avoid requiring composite indexes. If you see an "index required" error:
- Just refresh the page (Cmd+R or Ctrl+F5)
- The app will work without creating any indexes

See [FIREBASE_INDEX.md](./FIREBASE_INDEX.md) for more details.

## Troubleshooting

### Still nothing happens when I click "Create Desk"?

**Check the browser console (F12):**

1. Open DevTools → Console tab
2. Try clicking "Create Desk" again
3. You should see console logs like:
   - `Creating desk with name: My Desk`
   - If successful: `Desk created successfully`
   - If error: The error message

### Common Errors

**"User not authenticated"**
- Make sure you're signed in with Farcaster
- The Farcaster sign-in must happen before trying to create a desk

**"Firebase config is incomplete"**
- Check that `.env.local` has all Firebase config values
- Don't put quotes around the values
- Restart your dev server after adding `.env.local`

**"Permission denied" error**
- Go to Firestore → Rules
- Make sure your rules allow authenticated users
- Copy the rules from Step 5 above

**"Collection not created"**
- This is normal! Collections auto-create when you add the first document
- Just create your first desk and it will automatically create the "desks" collection

### Verify Firebase Connection

Add this test to your browser console (F12):

```javascript
// Test Firebase connection
import { db } from './src/config/firebase'
console.log('Firebase db:', db)
```

## Next Steps

Once desks are working:
1. Create a desk (e.g., "Trending")
2. Select it from the sidebar
3. Click "New Column" to add columns
4. Each column will show the trending feed

## Need Help?

- Check browser console (F12) for error messages
- Make sure `.env.local` has correct values
- Verify Firestore Database is enabled in Firebase
- Make sure you're signed in with Farcaster
- Double-check Firebase credentials in `.env.local`

Happy desk organizing! 🐐

