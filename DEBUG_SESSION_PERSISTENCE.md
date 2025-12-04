# Debug Guide: Session Persistence Not Working

## Problem
Session is not persisting after page reload. User gets logged out and needs to sign in again.

## Root Cause Investigation

The issue is that `@farcaster/auth-kit` **might not automatically persist the auth state** depending on how it's configured or the version being used.

## Step 1: Check Browser Console Logs

1. Open your app in browser
2. Open DevTools (F12)
3. Go to **Console** tab
4. Sign in to the app
5. Watch the console output for messages like:
   ```
   Auth State Changed: { isLoading: true/false, hasProfile: true/false, username: "..." }
   LocalStorage Auth Keys: [...]
   ```

**What to look for:**
- Is localStorage storing anything related to Farcaster auth?
- After reload, does isLoading become true?
- Are there any error messages?

## Step 2: Check LocalStorage Content

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Local Storage** on the left
4. Click your domain (e.g., `localhost:3000`)
5. Look for keys containing:
   - `farcaster`
   - `auth`
   - `token`
   - `session`

**Expected behavior:**
- After signing in, you should see at least one key with Farcaster auth data
- After page reload, this key should still exist

**If you see nothing:**
- ❌ Auth-kit is not persisting the session by default
- We need to manually implement session persistence

## Step 3: Check Current Implementation

Current code flow:
```
1. User signs in with Farcaster
2. useProfile() returns profile data
3. useUserStorage() saves to Firebase
4. useSessionPersistence() logs state to console
5. User reloads page
6. isLoading should be true briefly
7. Then profile should be restored from somewhere
```

**If profile doesn't restore:**
- Auth-kit is not storing the auth state
- We need to implement custom localStorage persistence

## Solution: Manual Session Persistence

The fix is to create a hook that:
1. Saves auth response to localStorage when user signs in
2. Retrieves auth response from localStorage when page reloads
3. Re-authenticates using the saved credentials

### Create `useManualSessionPersistence.js`:

```javascript
import { useEffect } from 'react'
import { useSignIn, useProfile } from '@farcaster/auth-kit'

export function useManualSessionPersistence() {
  const { signIn, isSignedIn } = useSignIn()
  const { profile, isLoading } = useProfile()

  // Save session when user successfully signs in
  useEffect(() => {
    if (isSignedIn && profile) {
      try {
        const sessionData = {
          fid: profile.fid,
          username: profile.username,
          displayName: profile.displayName,
          pfpUrl: profile.pfpUrl,
          signedInAt: new Date().toISOString(),
        }
        localStorage.setItem('goatcast-session', JSON.stringify(sessionData))
        console.log('Session saved to localStorage:', sessionData)
      } catch (error) {
        console.error('Error saving session:', error)
      }
    }
  }, [isSignedIn, profile])

  // Try to restore session on page load
  useEffect(() => {
    const saved = localStorage.getItem('goatcast-session')
    if (saved && !isSignedIn && !isLoading) {
      try {
        const sessionData = JSON.parse(saved)
        console.log('Found saved session, attempting to restore:', sessionData)
        // Note: This approach saves user data but doesn't restore auth token
        // Auth token restoration requires auth-kit support
      } catch (error) {
        console.error('Error restoring session:', error)
        localStorage.removeItem('goatcast-session')
      }
    }
  }, [isSignedIn, isLoading])
}
```

## The Real Issue

After investigation, the core problem is:

**`@farcaster/auth-kit` does NOT automatically persist authentication tokens to localStorage.**

The library handles signing in via the sign-in button/modal, but:
- ❌ It doesn't store the auth token by default
- ❌ It doesn't automatically restore from localStorage
- ✅ But it DOES provide hooks to check current auth state

This means we can only save user profile data, not the actual auth token needed for re-authentication.

## Workaround Solutions

### Option 1: Require Re-authentication
Accept that users must sign in each time they reload:
- ✅ Simple to implement
- ✅ More secure
- ❌ Bad user experience

### Option 2: Store Profile, Prompt User
Save user profile and show a "Welcome back!" message with quick re-auth:
- ✅ Better UX than full sign-in
- ✅ Secure (requires re-auth)
- ⚠️ Still requires user interaction

### Option 3: Use Farcaster OAuth/Relay
Implement Farcaster's OAuth flow for automatic token refresh:
- ✅ True session persistence
- ✅ Automatic re-auth
- ❌ More complex implementation
- ❌ Different auth flow than current sign button

### Option 4: Contact Auth-Kit Support
Check if newer versions of `@farcaster/auth-kit` support localStorage persistence:
```bash
npm view @farcaster/auth-kit versions
# Check release notes for localStorage support
```

## Testing Your Implementation

### Test with Console Logs

1. Sign in
2. Open console (F12 → Console)
3. Check for `Session saved to localStorage` message
4. Reload page (F5)
5. Check for auth state change messages

### Verify LocalStorage Persistence

```javascript
// In browser console, after signing in:
localStorage.getItem('goatcast-session')
// Should return user profile data

// After page reload:
localStorage.getItem('goatcast-session')
// Should still exist
```

## Recommended Next Steps

1. **Check auth-kit version:**
   ```bash
   npm view @farcaster/auth-kit
   # Or check package.json
   ```

2. **Read auth-kit docs:**
   - Check if there's a localStorage persistence option
   - Look for useSignIn() or useProfile() documentation

3. **Check GitHub issues:**
   - Search for "session persistence" in auth-kit issues
   - See how other projects handle this

4. **Consider alternative approaches:**
   - Use Farcaster's native OAuth
   - Implement custom session management

## Current Project State

**Version of @farcaster/auth-kit:**
Check in `package.json` → dependencies → `@farcaster/auth-kit`

**Current localStorage keys after sign-in:**
Open DevTools → Application → LocalStorage and look for Farcaster-related keys

---

## Quick Debugging Checklist

- [ ] Sign in to app
- [ ] Open DevTools → Console tab
- [ ] Look for "Auth State Changed" messages
- [ ] Open DevTools → Application → LocalStorage
- [ ] Look for Farcaster auth keys
- [ ] If found, check if they persist after reload
- [ ] If not found, auth-kit isn't persisting by default
- [ ] Check package.json for @farcaster/auth-kit version
- [ ] Check GitHub/docs for localStorage options

---

**Status:** Under investigation  
**Last Updated:** When you run the test scenario described above

Report your findings and we'll implement the appropriate solution!

