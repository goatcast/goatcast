# 🔍 Verify Session Storage - Debug Guide

## Problem
Session data is NOT being saved to localStorage (farcaster-session-data key not found)

## Solution
I've added comprehensive console logging to help us debug exactly what's happening.

## 📋 Step-by-Step Debug Process

### Step 1: Open Browser Console
```
1. Open your app in browser
2. Press F12 to open DevTools
3. Click the "Console" tab
4. You should see logs from the app
```

### Step 2: Sign In and Watch Console

**When you click "Sign In":**

You should see logs like:
```
✅ Farcaster session saved to localStorage: vitalik
📍 Key: farcaster-session-data
📊 Data: { fid: 12345, username: "vitalik", ... }
```

**If you see these logs:**
✅ Session IS being saved!
Go to Step 3.

**If you DON'T see these logs:**
❌ Session is NOT being saved
Go to Step 4.

### Step 3: Check localStorage in DevTools

Once you see the console logs, verify it's actually stored:

```
1. Press F12 (DevTools)
2. Go to "Application" tab
3. Click "Local Storage" on the left sidebar
4. Click your domain (localhost:3000 or production URL)
5. You should see a list of keys
6. Look for: farcaster-session-data
7. Click on it to see the data
```

**Expected value:**
```json
{
  "fid": 12345,
  "username": "vitalik",
  "displayName": "Vitalik Buterin",
  "pfpUrl": "https://...",
  "bio": "Ethereum creator",
  "followerCount": 50000,
  "followingCount": 1000,
  "signedInAt": "2024-12-04T15:30:00.000Z"
}
```

### Step 4: If Nothing is Being Saved

**Check Console Logs More Carefully:**

When app loads, you should see:
```
🔍 App mounted - checking localStorage for farcaster-session-data
📋 All localStorage keys: [...]
📍 Looking for: farcaster-session-data
❌ No saved session found in localStorage
```

Then when you sign in, you should see:
```
✅ Farcaster session saved to localStorage: vitalik
📍 Key: farcaster-session-data
📊 Data: {...}
```

**If you see the first set (app loading) but NOT the second set (after sign in):**
- The hook is not detecting that user signed in
- This means `profile` is not being set
- Check if SignInButton is actually working

**Test this:**
```
1. Open Console (F12)
2. Click "Sign In" button
3. Complete Farcaster authentication
4. You should be redirected back to app
5. Check if console shows the save message
```

## 📊 Complete Console Output Example

### On App Load:
```
🔍 App mounted - checking localStorage for farcaster-session-data
📋 All localStorage keys: ["theme", "user-preferences"]
📍 Looking for: farcaster-session-data
❌ No saved session found in localStorage
```

### After Signing In:
```
✅ Farcaster session saved to localStorage: vitalik
📍 Key: farcaster-session-data
📊 Data: {fid: 12345, username: "vitalik", displayName: "Vitalik Buterin", ...}
```

### On Page Reload (F5):
```
🔍 App mounted - checking localStorage for farcaster-session-data
📋 All localStorage keys: ["theme", "user-preferences", "farcaster-session-data"]
📍 Looking for: farcaster-session-data
✅ Loaded cached profile for: vitalik
```

## ✅ If Session Storage is Working

Once you verify localStorage has `farcaster-session-data`:

### Test Persistence:

```
1. Sign in ✅
2. Check localStorage (should see farcaster-session-data)
3. Press F5 to reload
4. You should see:
   - "Loading your session..." screen
   - Then "Welcome back! @vitalik" message
   - Cached sidebar with your desks
   - Sign in button overlay
5. Click "Sign In"
6. Quick re-auth
7. Back in app ✅
```

## 🐛 Troubleshooting

### Issue: Console shows no logs at all

**Possible causes:**
1. Console is showing a different output (filter)
2. App is not loading correctly
3. Browser is in private/incognito mode

**Solution:**
```
1. Clear any filters in console
2. Refresh page (Ctrl+R or Cmd+R)
3. Look at console output at top
4. If using private mode, that's why localStorage doesn't work
```

### Issue: Sign-in button doesn't seem to work

**Check:**
1. Does Farcaster modal appear?
2. Do you complete the authentication?
3. Are you redirected back to app?
4. Check console for any error messages

**If Farcaster modal doesn't appear:**
- Your Farcaster auth-kit is not configured correctly
- Check FIREBASE_SETUP.md for auth-kit configuration

### Issue: Profile data not showing after sign in

**Check console for:**
```
❌ Error saving Farcaster session: [error message]
```

If you see an error, please share it!

## 📝 What Data Should Be Saved

After signing in, localStorage should contain:
```javascript
{
  "fid": 12345,                    // Your Farcaster ID
  "username": "vitalik",           // Your Farcaster username
  "displayName": "Vitalik Buterin", // Your display name
  "pfpUrl": "https://...",         // Your profile picture
  "bio": "Ethereum creator",       // Your bio
  "followerCount": 50000,          // Followers
  "followingCount": 1000,          // Following
  "signedInAt": "2024-12-04T15:30:00.000Z" // When you signed in
}
```

## 🔐 Security Check

localStorage data is:
- ✅ Public profile information only
- ✅ No authentication tokens
- ✅ No sensitive data
- ✅ Can be viewed/cleared by user anytime

## ⚡ How the Flow Works

```
User Signs In
    ↓
useProfile() detects profile data
    ↓
useFarcasterSession hook sees profile
    ↓
Saves to localStorage with key: farcaster-session-data
    ↓
Console logs: "✅ Farcaster session saved to localStorage"
    ↓
(Check DevTools Application → LocalStorage)
    ↓
User reloads page (F5)
    ↓
App mounts, checks localStorage
    ↓
Finds farcaster-session-data key
    ↓
Loads cached profile
    ↓
Shows "Welcome back! @username"
    ↓
User clicks Sign In
    ↓
Quick re-auth
    ↓
Back in app ✅
```

## 📋 Checklist

After following this guide, you should be able to:

- [ ] Sign in to app successfully
- [ ] See console log: "✅ Farcaster session saved to localStorage"
- [ ] See console log with user data in 📊 Data: {...}
- [ ] Open DevTools Application tab
- [ ] See "farcaster-session-data" key in localStorage
- [ ] Reload page (F5)
- [ ] See cached profile with "Welcome back!" message
- [ ] Click "Sign In" and re-authenticate
- [ ] See full app access restored

## 🆘 Report Issues

If session is not being saved, please let me know:

**What you see in console when signing in:**
```
(Copy the exact console output here)
```

**What you see in localStorage:**
```
(List of keys visible in DevTools)
```

**Error messages (if any):**
```
(Any error messages from console)
```

---

## 🎯 Expected Outcome

After all this is working:

✅ Session data saves automatically when you sign in  
✅ localStorage has "farcaster-session-data" key  
✅ Page reload shows "Welcome back!" message  
✅ Sidebar and app context visible while re-authenticating  
✅ Quick sign-in overlay for fast re-auth  
✅ Back in app after clicking "Sign In"

🎉 Session persistence is working!

---

**Try this now and let me know what you see in the console!** 🚀

