# User Session Persistence 🔐

## Overview

Goatcast now automatically stores user session data both locally and in Firebase, allowing users to maintain their login state without signing in again.

## Features

✅ **Local Caching** - User profile cached in browser localStorage for instant loading
✅ **Firebase Sync** - User data synced to Firestore for cross-device access
✅ **Automatic Login** - Users are automatically logged in on revisit if session exists
✅ **Session Management** - Logout button to clear session and sign out
✅ **Offline Support** - App works with cached data if Firebase is unavailable

## How It Works

### 1. **First Time Login**
1. User clicks "Sign In" and authenticates with Farcaster
2. User profile data is captured
3. Data is saved to:
   - Browser localStorage (instant loading)
   - Firebase Firestore (persistent storage)
4. User sees welcome message: "✓ Welcome back! Using saved session"

### 2. **Subsequent Visits**
1. App loads cached profile from localStorage
2. User is immediately logged in (no need to sign in again)
3. When auth kit connects, it verifies the session
4. Profile data is synced with Firebase

### 3. **Logout**
1. Click "Logout" button in top-right corner
2. Confirm logout
3. Session is cleared from:
   - Browser localStorage
   - Farcaster Auth Kit
4. User is sent back to login screen

## Data Stored

### localStorage
```json
{
  "fid": 12345,
  "username": "example.eth",
  "displayName": "Example User",
  "pfpUrl": "https://...",
  "bio": "User bio",
  "followerCount": 100,
  "followingCount": 50,
  "lastSignIn": "2024-12-04T10:30:00Z"
}
```

### Firebase (users collection)
```
/users/{fid}
├── fid
├── username
├── displayName
├── pfpUrl
├── bio
├── followerCount
├── followingCount
├── lastSignIn
└── updatedAt
```

## Implementation Details

### useUserSession Hook
Custom hook that manages session persistence:
- Loads cached profile on mount
- Monitors auth changes from Farcaster
- Syncs to Firebase and localStorage
- Provides `isCached` flag to show "Welcome back" message

```javascript
const { profile, isLoading, isCached, clearCache } = useUserSession()
```

### sessionStorage Utility
Helper functions for localStorage operations:
- `saveProfile()` - Save user profile
- `loadProfile()` - Load cached profile
- `clearSession()` - Clear all session data
- `hasCachedSession()` - Check if user has cached session

### LogoutButton Component
Standalone logout button that:
- Clears localStorage cache
- Signs out from Farcaster Auth Kit
- Redirects to login screen

## Security Considerations

⚠️ **Important**: User data is stored in localStorage, which is accessible to any JavaScript on the same domain. Consider the following:

- **Private Browsing**: Session is cleared when closing private/incognito window
- **Shared Devices**: User should logout if using shared device (click "Logout" button)
- **XSS Protection**: Ensure app protects against XSS attacks
- **No Sensitive Data**: Only public profile data is cached (no private keys or auth tokens)

## Clearing Cache

### Manual Clear
- Click "Logout" button in app
- Confirm logout
- Session is cleared

### Browser Clear
1. Open DevTools (F12)
2. Application → LocalStorage
3. Delete `goatcast_user_profile` entry

### Programmatic Clear
```javascript
import { sessionStorage } from './utils/sessionStorage'

sessionStorage.clearSession()
```

## Troubleshooting

### "Session not persisting"
1. Check if localStorage is enabled in browser
2. Check browser DevTools → Application → LocalStorage
3. Verify `goatcast_user_profile` key exists
4. Check browser console for errors

### "Seeing wrong user profile"
1. Click Logout button to clear cache
2. Sign in again with correct account
3. Session will be saved with new account

### "Can't logout"
1. Try manually clearing localStorage in DevTools
2. Clear browser cookies
3. Try different browser

## Future Enhancements

- [ ] Multiple device support (sync across devices)
- [ ] Session expiration (auto-logout after 30 days)
- [ ] Remember multiple accounts
- [ ] Biometric login (fingerprint/face ID)
- [ ] Session activity tracking
- [ ] Concurrent session limit

## Files Modified

- `src/hooks/useUserSession.js` - Main session hook
- `src/utils/sessionStorage.js` - localStorage utilities
- `src/components/LogoutButton.jsx` - Logout component
- `src/App.jsx` - Integrated session management

## Testing

### Test Session Persistence
1. Sign in to app
2. Refresh page → should stay logged in
3. Close browser completely
4. Reopen → should show "Welcome back" message
5. Check DevTools → localStorage for saved profile

### Test Logout
1. Click Logout button
2. Confirm logout
3. Should return to login screen
4. Check localStorage → `goatcast_user_profile` should be gone
5. Sign in again → should work normally

## API Reference

### useUserSession Hook
```javascript
const {
  profile,           // User profile object (auth or cached)
  isLoading,         // Loading state
  isCached,          // True if using cached profile
  hasCachedProfile,  // True if cache exists
  clearCache,        // Function to clear cache
} = useUserSession()
```

### sessionStorage Utility
```javascript
import { sessionStorage } from './utils/sessionStorage'

sessionStorage.saveProfile(profile)        // Save profile
sessionStorage.loadProfile()               // Load cached profile
sessionStorage.hasCachedSession()          // Check if cached
sessionStorage.clearSession()              // Clear session
sessionStorage.updateSessionMeta(meta)     // Update metadata
sessionStorage.getSessionMeta()            // Get metadata
```

## Questions?

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for help
- Check console for error messages
- Review [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for Firebase setup

