# Quick Start: Deploy to Firebase 🚀

Get your Goatcast app live on the internet in 5 minutes!

## 5-Minute Setup

### Step 1: Install Firebase CLI (1 minute)

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase (1 minute)

```bash
firebase login
```

This opens your browser to authenticate with Google.

### Step 3: Set Your Firebase Project ID (1 minute)

Create `.firebaserc` file:

```bash
cp .firebaserc.example .firebaserc
```

Then edit `.firebaserc` and replace `your-firebase-project-id`:

```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

**Where to find your project ID:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ → Project Settings
4. Copy "Project ID"

### Step 4: Deploy! (2 minutes)

```bash
npm run deploy
```

This will:
1. Build your React app
2. Deploy to Firebase Hosting
3. Deploy Firestore rules and indexes

### Done! ✅

Your app is live at:
```
https://your-firebase-project-id.web.app
```

## Next Deployments

After making changes locally:

```bash
npm run deploy:hosting
```

This only redeploys your code (faster for updates).

## Verify Setup

Check if Firebase CLI is working:

```bash
firebase projects:list
```

You should see your project listed.

## Troubleshooting

**"Authentication Error"**
```bash
firebase logout
firebase login
```

**"Project not found"**
- Double-check `.firebaserc` has correct project ID
- Run `firebase projects:list` to see your projects

**"Not in a Firebase project"**
```bash
firebase use your-firebase-project-id
```

## More Commands

```bash
# Check status
firebase status

# View hosting analytics
firebase open hosting:site

# View logs
firebase functions:log

# Stop a deployment
# (Just cancel with Ctrl+C)
```

## Full Deployment Guide

See [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md) for complete guide with:
- Custom domains
- Environment variables
- Firestore rules
- Emulator setup
- Troubleshooting

## Still Need Help?

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

**That's it! Your app is now live! 🎉**

Share your URL: `https://your-firebase-project-id.web.app`





