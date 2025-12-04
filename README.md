![Goatcast Logo](https://goatcast.app/images/goatcast-frames.png)

Experience Farcaster like never before with multiple real-time feeds, powerful filtering, and a customizable interface designed for power users.

Goatcast helps you keep track of everything happening on Farcaster.

Like TweetDeck, you can create multiple columns to monitor different feeds, searches, and notifications—all updating in real-time.

The clean, customizable interface makes it easy to stay engaged with your Farcaster community without feeling overwhelmed.

[Download DMG](https://github.com/goatcast/goatcast/releases/download/prod/goatcast.dmg)  

Need Help? Join us on Farcaster: [@goatcast](https://warpcast.com/goatcast)

---

## Goatcast Web - Setup & Development

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Neynar API key:
```bash
VITE_NEYNAR_API_KEY=your_neynar_api_key_here
```

Get your free API key from [Neynar API Documentation](https://docs.neynar.com/)

### Development

Run the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000` with hot module replacement enabled.

### Build

Create a production build:
```bash
npm run build
```

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database and Authentication in your Firebase project
3. Add your Firebase configuration to `.env.local`:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Firestore Structure

The app uses the following Firestore collections:

**desks** - User's desk collections
- `id` - Document ID
- `name` - Desk name
- `userId` - Farcaster user ID
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

**columns** - Columns within desks
- `id` - Document ID
- `deskId` - Reference to parent desk
- `name` - Column name
- `userId` - Farcaster user ID
- `position` - Column order
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Features

- 🔐 **Farcaster Authentication** - Sign in with your Farcaster account using Auth Kit
- 📋 **Desk Management** - Create and organize multiple desks (groups of columns)
- 📺 **Custom Columns** - Build multiple columns within each desk for different feeds
- 💾 **Cloud Storage** - All desks and columns saved to Firebase Firestore
- 🎨 **Modern UI** - Built with React, Tailwind CSS, and Vite for a fast, responsive experience
- ⚡ **Hot Module Replacement** - See changes instantly during development
- 🔄 **Real-time Sync** - Live updates when desks and columns are modified

### Technology Stack

- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **@farcaster/auth-kit** - Farcaster authentication
- **Firebase 10** - Real-time database and authentication
- **Neynar API** - Farcaster data and feed management
