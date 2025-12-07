# User Data Storage - Firebase Implementation

## Overview

When a user logs in with their Farcaster account, their profile data is automatically stored in Firebase Firestore. This enables you to:

- Track user information across sessions
- Build user analytics and dashboards
- Display user profiles and statistics
- Implement user-specific features

## What Gets Stored

When a user logs in, the following data is saved to Firebase:

```javascript
{
  fid: 1234,                           // Farcaster ID (used as document ID)
  username: "vitalik",                 // Farcaster username
  displayName: "Vitalik Buterin",      // Display name
  pfpUrl: "https://...",               // Profile picture URL
  bio: "Ethereum creator",             // User bio
  followerCount: 50000,                // Number of followers
  followingCount: 1000,                // Number of following
  firstLoginAt: timestamp,             // First login timestamp
  lastLoginAt: timestamp,              // Last login timestamp (updated on each login)
}
```

## Firebase Collection Structure

**Collection:** `users`

**Document ID:** `{fid}` - The user's Farcaster ID (e.g., "1234")

### Example Firestore Path
```
users/
  └── 1234/
      ├── fid: 1234
      ├── username: "vitalik"
      ├── displayName: "Vitalik Buterin"
      ├── pfpUrl: "https://..."
      ├── bio: "Ethereum creator"
      ├── followerCount: 50000
      ├── followingCount: 1000
      ├── firstLoginAt: Timestamp
      └── lastLoginAt: Timestamp
```

## How It Works

### 1. **New Hook: `useUserStorage`**

Location: `src/hooks/useUserStorage.js`

This custom React hook:
- Monitors the user's authentication state using `useProfile()` from `@farcaster/auth-kit`
- Automatically saves user data to Firebase when they log in
- Updates `lastLoginAt` on each subsequent login
- Handles errors gracefully with console logging

### 2. **Integration in App.jsx**

The hook is called in the main `App` component:

```javascript
import { useUserStorage } from './hooks/useUserStorage'

function App() {
  const { isLoading, profile } = useProfile()
  useUserStorage() // This saves user data to Firebase on login
  // ... rest of component
}
```

### 3. **Auto-Save Logic**

The hook automatically:
- ✅ Detects when a user logs in (when `profile.fid` becomes available)
- ✅ Saves their profile data to Firestore
- ✅ Updates `lastLoginAt` timestamp on each login
- ✅ Preserves `firstLoginAt` (only set on first login)
- ✅ Handles profile updates (if user changes their display name, etc.)

## Firestore Rules for Users Collection

To keep your Firestore secure, add these rules to `firestore.rules`:

```rules
// Allow users to read/write only their own user data
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}

// Allow server-side operations
match /users/{userId} {
  allow write: if request.time < timestamp.date(2026, 1, 3);
}
```

**Note:** Update the timestamp in your current rules when adding this.

## Usage Examples

### Retrieve User Data

```javascript
import { useEffect, useState } from 'react'
import { db } from '../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export function getUserProfile(fid) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, 'users', fid.toString())
      const snapshot = await getDoc(userRef)
      if (snapshot.exists()) {
        setUser(snapshot.data())
      }
    }
    fetchUser()
  }, [fid])

  return user
}
```

### Query All Users (admin use only)

```javascript
import { collection, getDocs } from 'firebase/firestore'

async function getAllUsers() {
  const usersRef = collection(db, 'users')
  const snapshot = await getDocs(usersRef)
  const users = []
  snapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() })
  })
  return users
}
```

## Troubleshooting

### User data not saving?

1. **Check Firebase Authentication:** Ensure Firestore is enabled in your Firebase project
2. **Verify `.env.local`:** Make sure your Firebase credentials are correct:
   ```bash
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # ... other variables
   ```
3. **Check Browser Console:** Look for error messages
4. **Firestore Rules:** Verify your rules allow writes to the `users` collection

### Timestamps not working?

- `serverTimestamp()` creates server-side timestamps
- These are stored as Firebase Timestamp objects
- JavaScript converts them to Date objects automatically

### User data persists after logout?

- User data in Firestore remains (this is by design)
- Each user has exactly one document with their `fid` as the ID
- If you want to delete user data on logout, see the next section

## Deleting User Data (Optional)

If you need to delete user data when they sign out:

```javascript
import { doc, deleteDoc } from 'firebase/firestore'

async function deleteUserData(fid) {
  try {
    await deleteDoc(doc(db, 'users', fid.toString()))
    console.log('User data deleted')
  } catch (error) {
    console.error('Error deleting user data:', error)
  }
}
```

## Security Considerations

✅ **Current Implementation:**
- Uses Farcaster authentication for user verification
- Only saves publicly available profile data
- Uses Firestore's `serverTimestamp()` for audit trails

⚠️ **Recommendations:**
1. Add Firestore security rules (see section above)
2. Avoid storing sensitive information (passwords, private keys, etc.)
3. Implement rate limiting for production apps
4. Add user consent/privacy policy for data storage

## Next Steps

1. **Update Firestore Rules:** Add rules from the "Firestore Rules for Users Collection" section
2. **Test Login:** Create a test account and verify data appears in Firestore
3. **View Data:** Check Firebase Console → Firestore Database → `users` collection
4. **Extend:** Build features that use this stored user data!

## Related Files

- 📄 `src/hooks/useUserStorage.js` - Main storage hook
- 📄 `src/App.jsx` - Integration point
- 📄 `src/config/firebase.js` - Firebase configuration
- 📄 `firestore.rules` - Security rules (update these)

---

**Questions?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or the [Firebase Documentation](https://firebase.google.com/docs/firestore).

