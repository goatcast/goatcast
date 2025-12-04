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

### Features

- 🔐 **Farcaster Authentication** - Sign in with your Farcaster account using Auth Kit
- 📺 **Trending Feed** - View trending casts from the Farcaster network in real-time
- 🎨 **Modern UI** - Built with React, Tailwind CSS, and Vite for a fast, responsive experience
- ⚡ **Hot Module Replacement** - See changes instantly during development

### Technology Stack

- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **@farcaster/auth-kit** - Farcaster authentication
- **Neynar API** - Farcaster data and feed management
