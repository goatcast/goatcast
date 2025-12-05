# Deployment Checklist ✅

Use this checklist to ensure your app is ready for production deployment.

## Pre-Deployment

### Local Setup
- [ ] Node.js and npm installed
- [ ] Project cloned from GitHub
- [ ] `npm install` completed successfully
- [ ] `.env.local` file created with all credentials

### Firebase Setup
- [ ] Firebase account created ([firebase.google.com](https://firebase.google.com))
- [ ] Firebase project created
- [ ] Firestore Database enabled
- [ ] Firestore in "Test Mode" (or with proper security rules)

### Environment Variables
- [ ] `VITE_NEYNAR_API_KEY` set in `.env.local`
- [ ] `VITE_FIREBASE_API_KEY` set in `.env.local`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` set in `.env.local`
- [ ] `VITE_FIREBASE_PROJECT_ID` set in `.env.local`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` set in `.env.local`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` set in `.env.local`
- [ ] `VITE_FIREBASE_APP_ID` set in `.env.local`

### Firebase CLI Setup
- [ ] Firebase CLI installed globally (`npm install -g firebase-tools`)
- [ ] Logged in to Firebase (`firebase login` works)
- [ ] Project ID in `.firebaserc`
- [ ] Can list Firebase projects (`firebase projects:list`)

### Code Testing
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Can sign in with Farcaster
- [ ] Can create a desk
- [ ] Can create a column
- [ ] Can view trending feed in columns
- [ ] No console errors (F12 → Console)

### Build Testing
- [ ] Production build succeeds (`npm run build`)
- [ ] `dist/` folder created
- [ ] `dist/index.html` exists
- [ ] Build size is reasonable (`< 500KB` ideally)
- [ ] Preview works (`npm run preview`)

### Firestore Configuration
- [ ] Firestore rules in place (`firestore.rules`)
- [ ] Security rules allow authenticated users
- [ ] Firestore indexes defined (`firestore.indexes.json`)
- [ ] Rules reviewed for security

## Deployment

### First Deployment
- [ ] Run `npm run deploy`
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Wait for deployment to complete (1-2 minutes)
- [ ] No errors in console output

### Post-Deployment Verification
- [ ] Visit `https://your-project-id.web.app` in browser
- [ ] App loads without errors
- [ ] Farcaster sign-in works
- [ ] Can create desk on live site
- [ ] Can create column on live site
- [ ] Trending feed loads
- [ ] All features working as expected

### Browser Testing
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Mobile Safari: All features work
- [ ] Chrome Mobile: All features work

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No 404 errors in Network tab
- [ ] No warnings in Console
- [ ] Firebase rules working (no permission errors)

### Monitoring
- [ ] Check Firebase Hosting Analytics
- [ ] Monitor active users
- [ ] Check bandwidth usage
- [ ] Review error logs

## Post-Deployment

### Documentation
- [ ] README updated with live URL
- [ ] Live URL shared with team
- [ ] Deployment procedure documented

### Backups & Security
- [ ] Firebase backups configured (if needed)
- [ ] Firestore security rules reviewed
- [ ] No API keys exposed in frontend code
- [ ] `.env.local` not committed to git

### Monitoring Setup
- [ ] Set up Firebase alerts (optional)
- [ ] Monitor quota usage
- [ ] Plan for scaling if needed

### Ongoing
- [ ] Keep dependencies updated
- [ ] Monitor Firebase pricing
- [ ] Review Firestore usage monthly
- [ ] Update app features and redeploy

## Update Deployment (After Code Changes)

```bash
# Make code changes
git add .
git commit -m "feat: add new feature"

# Deploy only web app (faster)
npm run deploy:hosting

# Or deploy everything
npm run deploy
```

### Post-Update Verification
- [ ] Visit live URL
- [ ] Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
- [ ] New changes visible
- [ ] No new errors in console
- [ ] All features still working

## Emergency: Rollback

If something breaks:

```bash
# Build last working version
git revert HEAD
npm run deploy:hosting
```

Or deploy from backup:
```bash
npm run build
npm run deploy:hosting
```

## Useful Commands

```bash
# Check deployment status
firebase status

# View live site
firebase open hosting:site

# View analytics
firebase open hosting:analytics

# Monitor functions logs
firebase functions:log

# Emulate locally
firebase emulators:start
```

## Help Resources

- [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md) - 5-minute setup
- [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md) - Full deployment guide
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Debugging guide

## Deployment Complete! 🎉

Your Goatcast app is now live on the internet!

**App URL:** `https://your-project-id.web.app`

Share it with the world! 🚀



