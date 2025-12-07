# Session Persistence Fix - Action Plan

## Problem Identified
Session is NOT persisting after page reload because `@farcaster/auth-kit` **doesn't automatically save the authentication token to localStorage by default**.

## Current Investigation Results

### What We Know
1. ✅ User can sign in successfully
2. ✅ Profile data is saved to Firebase
3. ❌ Auth token is NOT persisted in localStorage
4. ❌ Page reload requires re-authentication

### Test Steps to Verify

**Run this test to confirm the issue:**

```
1. Open DevTools (F12)
2. Go to Console tab
3. Sign in to app
4. Watch console for "Auth State Changed" and "LocalStorage Auth Keys" messages
5. Check what keys are in localStorage
6. Note if any Farcaster/auth keys are present
7. Press F5 to reload
8. Check if you're still logged in
9. Report what you see in localStorage
```

## Solution Options

### Option A: ⭐ RECOMMENDED - Use Native Auth-Kit localStorage  
**Status:** Needs verification

The `@farcaster/auth-kit` v0.8.1+ might have built-in localStorage support that's not activated in current config.

**To implement:**
1. Check `@farcaster/auth-kit` version (currently v0.8.1)
2. Read auth-kit docs/source for localStorage configuration
3. Add localStorage config to AuthKitProvider in `src/main.jsx`

**Code example (if supported):**
```javascript
const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: window.location.hostname,
  siweUri: window.location.origin,
  // Try adding persistence config if available:
  // storage: 'localStorage',  // or
  // persistence: true,         // or
  // enablePersistence: true,   // check actual API
}
```

**Pros:**
- ✅ Built-in, no manual implementation
- ✅ Handles token refresh automatically
- ✅ Most secure approach

**Cons:**
- ⚠️ Might not be available in v0.8.1
- ⚠️ Requires reading undocumented API

---

### Option B: Manual localStorage Implementation
**Status:** Ready to implement

Store and restore auth response manually without relying on auth-kit internals.

**To implement:**

Create `src/hooks/useManualPersistence.js`:
```javascript
import { useEffect } from 'react'
import { useSignIn, useProfile } from '@farcaster/auth-kit'

export function useManualPersistence() {
  const { isSignedIn } = useSignIn()
  const { profile } = useProfile()

  // Save when user signs in
  useEffect(() => {
    if (isSignedIn && profile) {
      localStorage.setItem('goatcast-auth', JSON.stringify({
        fid: profile.fid,
        username: profile.username,
        displayName: profile.displayName,
        pfpUrl: profile.pfpUrl,
      }))
      console.log('Session saved')
    }
  }, [isSignedIn, profile])

  // Show "Welcome back" if session exists but not authenticated
  useEffect(() => {
    const saved = localStorage.getItem('goatcast-auth')
    if (saved && !isSignedIn) {
      console.log('Session found, user needs to re-authenticate')
      // Can show welcome message here
    }
  }, [isSignedIn])
}
```

**Pros:**
- ✅ Works with current auth-kit version
- ✅ Full control over what gets saved
- ✅ Simple implementation

**Cons:**
- ❌ Doesn't persist auth token (user must re-sign)
- ❌ User data is saved but re-auth still needed
- ❌ UX: requires clicking "Sign In" again (but app remembers who they are)

---

### Option C: Use Farcaster OAuth Flow
**Status:** Complex, future consideration

Replace sign button with direct OAuth implementation for true token persistence.

**Pros:**
- ✅ True session persistence
- ✅ Automatic token refresh
- ✅ Industry standard

**Cons:**
- ❌ Complete rewrite of auth flow
- ❌ No longer use @farcaster/auth-kit
- ❌ More complex backend needed

---

## Immediate Action Items

### 1. First, Debug! (Required)

Run the debug test above and report:
- [ ] What's in localStorage after sign-in?
- [ ] Does localStorage persist after reload?
- [ ] Are there any error messages in console?
- [ ] What exactly happens when you reload?

**Report format:**
```
localStorage keys after sign-in: [list them]
localStorage keys after reload: [list them]
Console messages: [what appears]
User experience on reload: [what happens]
```

### 2. Check Auth-Kit Documentation

```bash
# View current version
npm list @farcaster/auth-kit

# Check for localStorage support in:
# - node_modules/@farcaster/auth-kit/README.md
# - node_modules/@farcaster/auth-kit/package.json
# - GitHub: https://github.com/farcasterxyz/auth-kit
```

### 3. Implement Solution Based on Findings

**If Option A works (localStorage built-in):**
- Update config in `src/main.jsx`
- Test
- Update documentation

**If Option B needed (manual implementation):**
- Create `useManualPersistence` hook
- Add to App.jsx
- Shows welcome back message even if re-auth needed
- Better UX than current behavior

**If Option C needed (OAuth):**
- Schedule for later phase
- Too complex for current scope

---

## Current Code State

**Files involved:**
- ✅ `src/main.jsx` - AuthKitProvider config
- ✅ `src/App.jsx` - Auth flow and UI
- ✅ `src/hooks/useSessionPersistence.js` - Debug logging
- ✅ `src/hooks/useAuthRestore.js` - Restoration tracking

**Debug tool available:**
- 📄 `DEBUG_SESSION_PERSISTENCE.md` - Step-by-step debug guide

---

## Expected Outcomes

### Best Case (Option A Works)
```
Sign in → Token saved automatically
Reload page → Token restored automatically  
User stays logged in ✅
```

### Good Case (Option B Implemented)
```
Sign in → User data saved to localStorage
Reload page → Show "Welcome back, [username]!" 
User clicks "Sign In" → Quickly authenticates with saved data
```

### Current (Broken)
```
Sign in → Nothing saved
Reload page → Full sign-in screen
User must sign in again from scratch ❌
```

---

## Next Steps (After Debug)

1. **Run debug tests** described above
2. **Report findings** - localStorage content and behavior
3. **Implement chosen solution**
4. **Test thoroughly**
5. **Update documentation**
6. **Commit final fix**

---

## Quick Reference

| Option | Effort | Result | Status |
|--------|--------|--------|--------|
| A: Native localStorage | Low | Auto-persist | Need to verify support |
| B: Manual persistence | Medium | Manual re-auth | Ready to implement |
| C: OAuth flow | High | Full persistence | Future work |

---

**Current Status: 🔍 Investigation in Progress**

Run the debug steps above and report what you find! 🚀

