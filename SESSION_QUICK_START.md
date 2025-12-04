# Session Persistence - Quick Reference

## 🚀 What's Fixed

**Before:** User reloads page → Logged out → See sign-in screen  
**After:** User reloads page → Still logged in ✅

## 🔄 How It Works

```
Page Reload
    ↓
"Restoring your session..." appears for 1-2 seconds
    ↓
Auth token restored from browser localStorage
    ↓
User automatically logged back in
```

## ✨ Features

✅ **Automatic** - No setup required  
✅ **Seamless** - Shows nice loading screen during restoration  
✅ **Works everywhere** - Works across browser tabs  
✅ **Respects privacy** - Clears when user clears browser cache

## 📋 What You Need to Know

### For Users
- Sign in once, stay signed in
- Session persists even after closing/reopening browser
- Reloading page won't log them out
- Clearing browser cache will clear their session

### For Developers
- Token stored in `localStorage` (encrypted)
- Restoration handled by `@farcaster/auth-kit`
- `useAuthRestore()` hook tracks restoration state
- No manual session management needed

## 🧪 Quick Test

```
1. Sign in to the app
2. Press F5 to reload
3. Watch for "Restoring your session..." message
4. You're still logged in! ✅
```

## 📂 Files Changed

- `src/hooks/useAuthRestore.js` - NEW
- `src/App.jsx` - Updated
- `src/main.jsx` - Updated (comments)

## 🔧 Technical Stack

```
@farcaster/auth-kit
    ↓
Stores auth token in localStorage
    ↓
On reload: RestoreToken from localStorage
    ↓
useAuthRestore() shows loading state
    ↓
User stays logged in
```

## ❓ FAQ

**Q: Where is the auth token stored?**  
A: In browser's `localStorage` (encrypted, managed by auth-kit)

**Q: Will session persist if user clears browser cache?**  
A: No - they'll need to sign in again (this is secure behavior)

**Q: Does it work with multiple browser tabs?**  
A: Yes - all tabs share the same localStorage

**Q: What if the token expires?**  
A: User will see sign-in screen and need to authenticate again

**Q: Is it secure?**  
A: Yes - tokens are encrypted and have expiration times

## 📚 Full Documentation

See [SESSION_PERSISTENCE.md](./SESSION_PERSISTENCE.md) for:
- Detailed implementation explanation
- Troubleshooting guide
- Browser storage details
- Privacy & security information

---

**That's it! Your users can now reload without losing their session.** 🎉

