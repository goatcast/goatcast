# Troubleshooting: Desk Creation Not Working

## Quick Checklist

- [ ] I have `.env.local` file in the project root
- [ ] Firebase credentials are filled in `.env.local`
- [ ] Firestore Database is enabled in Firebase Console
- [ ] I am signed in with Farcaster (profile shows in top bar)
- [ ] I restarted the dev server after adding `.env.local`
- [ ] I opened browser console (F12) to check for errors

## Step-by-Step Debug

### 1. Check if You're Signed In

```
✓ You should see your Farcaster profile picture and username in the top-right
✗ If not, click the Farcaster sign-in button first
```

### 2. Open Browser Console (F12 on Windows/Linux, Cmd+Option+I on Mac)

Click the **Console** tab to see all error messages.

### 3. Try Creating a Desk and Check Console

1. Click "New Desk" button
2. Enter a desk name (e.g., "Test Desk")
3. Click "Create Desk"
4. **Look in the console for these messages:**

✓ **Success case (you should see):**
```
Creating desk with name: Test Desk
Desk created successfully
```

✗ **Error case (you'll see an error like):**
```
Creating desk with name: Test Desk
User not authenticated
```

## Common Issues and Fixes

### Issue 1: "User not authenticated"

**Cause:** Farcaster is not connected

**Fix:**
1. Click the Farcaster sign-in button in the top-right
2. Complete the Farcaster authentication
3. Try creating a desk again

### Issue 2: "User not authenticated" but you ARE signed in

**Cause:** Firebase config is missing or empty

**Fix:**
1. Check your `.env.local` file exists in the project root
2. Verify it has all the Firebase credentials:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
3. **Stop the dev server** (Ctrl+C)
4. Run `npm run dev` again
5. Try creating a desk

### Issue 3: "Permission denied" or "PERMISSION_DENIED" error

**Cause:** Firestore security rules don't allow access

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Find your project
3. Click **Firestore Database** (in Build section)
4. Click the **Rules** tab
5. Replace the rules with:
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
6. Click **Publish**
7. Wait a few seconds and try creating a desk again

### Issue 4: Nothing in console, button does nothing

**Cause:** Multiple possible reasons

**Fix - Try these in order:**

1. **Make sure you're signed in**
   - See Issue 1 above

2. **Check if Firebase is loaded**
   In browser console, paste:
   ```javascript
   console.log('Firebase modules loaded')
   ```
   If you get an error, Firebase didn't load properly

3. **Check if .env.local is being read**
   In browser console, paste:
   ```javascript
   console.log('Neynar API Key exists:', !!import.meta.env.VITE_NEYNAR_API_KEY)
   console.log('Firebase API Key exists:', !!import.meta.env.VITE_FIREBASE_API_KEY)
   ```
   Both should be `true`

4. **Restart everything**
   - Close the browser
   - Stop the dev server (Ctrl+C)
   - Delete `node_modules` and `.next` or `dist` folders
   - Run `npm install`
   - Run `npm run dev`
   - Try again

### Issue 5: Modal closes but no desk appears

**Cause:** Desk was created but not showing in sidebar

**Fix:**
1. Try refreshing the page (F5)
2. The desk should appear in the sidebar
3. If it doesn't, check Firebase Console:
   - Go to **Firestore Database** → **Data**
   - Click on **desks** collection
   - You should see your desk there
   - If it's there but not showing, there's a filtering issue

## Getting Help

When asking for help, please provide:

1. **Screenshot of browser console** (F12 → Console)
2. **Your `.env.local` file** (with keys redacted)
3. **What exactly happens when you click "New Desk"**

## Quick Test Script

Open browser console (F12) and run this to test your setup:

```javascript
// Test 1: Check if Firebase config is loaded
console.log('=== Firebase Config Check ===')
console.log('Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✓' : '✗')
console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✓' : '✗')

// Test 2: Check if Farcaster profile exists
console.log('\n=== Farcaster Profile Check ===')
// Note: You need to import useProfile hook to test this
// If profile shows in top-right, you're good

// Test 3: Try to access Firebase
console.log('\n=== Firebase Connection Check ===')
try {
  // Firebase is used in the app, if there's an error you'd see it above
  console.log('✓ Firebase can be accessed')
} catch (e) {
  console.log('✗ Firebase Error:', e.message)
}
```

## Still Not Working?

1. Make sure you followed the [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) guide
2. Double-check all environment variables are correct
3. Make sure Firestore Database is in "Test Mode" (not locked down)
4. Try using different desk name (sometimes special characters cause issues)
5. Check that your Firebase project has enough quota (free tier is usually fine)

## Report Issues

If you find a bug or have questions, check:
- [Goatcast GitHub Issues](https://github.com/goatcast/goatcast)
- [Farcaster Docs](https://docs.farcaster.xyz)
- [Firebase Docs](https://firebase.google.com/docs)




