# Firebase Hosting & Deployment Guide

Deploy your Goatcast app to Firebase Hosting in minutes! 🚀

## Prerequisites

- Firebase account ([firebase.google.com](https://firebase.google.com))
- Firebase Project created
- Firebase CLI installed

### Install Firebase CLI

```bash
npm install -g firebase-tools
```

Or use `npx`:
```bash
npx firebase-tools
```

## Step 1: Login to Firebase

```bash
firebase login
```

This will open a browser window to authenticate with your Google account.

## Step 2: Initialize Firebase Project

### Option A: Interactive Setup (Recommended)

```bash
firebase init
```

When prompted:
- **Which Firebase features do you want to setup?**
  - Select: `Hosting` and `Firestore`
- **Select a default Firebase project:**
  - Choose your existing project or create a new one
- **What do you want to use as your public directory?**
  - Enter: `dist`
- **Configure as a single-page app?**
  - Answer: `Yes`
- **Set up automatic builds and deploys?**
  - Answer: `No` (we'll do manual deploys)

### Option B: Manual Setup

1. Create `.firebaserc` file in project root:
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

Replace `your-firebase-project-id` with your actual Firebase project ID.

## Step 3: Configure Firestore Rules

The `firestore.rules` file already contains security rules for desks and columns.

To deploy:

```bash
firebase deploy --only firestore:rules
```

## Step 4: (Optional) Deploy Firestore Indexes

Firestore indexes are already configured in `firestore.indexes.json`.

To deploy:

```bash
firebase deploy --only firestore:indexes
```

## Deployment Commands

### Build and Deploy Everything

```bash
npm run deploy
```

This will:
1. Build the React app (`npm run build`)
2. Deploy to Firebase Hosting
3. Deploy Firestore rules and indexes

### Deploy Only Hosting

```bash
npm run deploy:hosting
```

Use this after code changes to update only the web app.

### Deploy Only Firestore Configuration

```bash
npm run deploy:firestore
```

Use this after updating security rules or indexes.

### Preview Locally

Test your production build locally:

```bash
npm run build
npm run preview
```

### Emulate Firebase Locally

Test Firebase Emulator Suite locally:

```bash
npm run firebase:emulate
```

This will start emulators for Auth, Firestore, and the UI at `http://localhost:4000`.

## File Structure

```
├── firebase.json              # Firebase configuration
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore index definitions
├── .firebaserc                # Firebase project ID (auto-generated or manual)
├── dist/                      # Built app (created by npm run build)
└── vite.config.js            # Vite build config
```

## What Gets Deployed

### Hosting
- Everything in the `dist/` folder
- Your built React app with all assets
- Automatic HTTPS and SSL certificate

### Firestore
- Security rules from `firestore.rules`
- Indexes from `firestore.indexes.json`

## First-Time Deployment Checklist

- [ ] Firebase account created
- [ ] Firebase project created
- [ ] Firebase CLI installed (`firebase login` works)
- [ ] `.firebaserc` has correct project ID
- [ ] `.env.local` has all Firebase credentials
- [ ] Firestore Database enabled in Firebase Console
- [ ] Firestore in "Test Mode" for development
- [ ] Run `npm run deploy`
- [ ] Visit `https://your-project.web.app`

## Your Live App URL

After deployment, your app is live at:

```
https://your-firebase-project-id.web.app
```

Or the default Firebase domain:

```
https://your-firebase-project-id.firebaseapp.com
```

## Troubleshooting

### "Authentication Error"

```bash
firebase logout
firebase login
```

Then try again.

### "Project ID not found"

Make sure `.firebaserc` has the correct project ID:

```bash
firebase projects:list
```

Copy your project ID and update `.firebaserc`.

### "Permission denied" on Firestore

Make sure you're on the Firebase project with Firestore enabled:

```bash
firebase use --add
```

Select your project when prompted.

### Hosting shows "404 Not Found"

- Ensure `dist/` folder exists: `npm run build`
- Check that `firebase.json` points to `dist` as public folder
- Verify build succeeded: `ls dist/index.html`

### Environment Variables Not Working

After updating `.env.local`:
1. Stop dev server (Ctrl+C)
2. Run `npm run build` again
3. Run `npm run deploy:hosting`

Environment variables are built into the app at build time, not runtime.

### Firestore Rules Not Updating

```bash
firebase deploy --only firestore:rules --force
```

## Cost & Limits

**Free Tier Includes:**
- 1 GB/month Firestore storage
- 50,000 read operations
- 20,000 write operations
- 100 MB download bandwidth
- Free HTTPS/SSL

**Hosting:**
- 10 GB/month bandwidth (free)
- Automatic HTTPS
- Custom domain support

[See Firebase Pricing](https://firebase.google.com/pricing)

## Custom Domain

To set up a custom domain:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Hosting
3. Click "Add custom domain"
4. Follow the DNS setup instructions

## Monitoring

View your app's performance and usage:

```bash
firebase open hosting:site
```

Or go to Firebase Console → Hosting → Analytics

## Next Steps

1. **Deploy:** `npm run deploy`
2. **Share your live URL:** `https://your-project.web.app`
3. **Monitor:** Check Firebase Console for usage
4. **Iterate:** Make changes locally, run `npm run deploy:hosting`

## Need Help?

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Your app is ready to deploy! 🚀**

```bash
npm run deploy
```





