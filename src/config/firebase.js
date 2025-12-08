import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAV3LnfSnORDSPKCFWhhvwZPj6UqRzNqSU',
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'goatcast-website.firebaseapp.com',
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'goatcast-website',
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'goatcast-website.firebasestorage.app',
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1045683905459',
	appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1045683905459:web:68b9421f217cddee6ee1c6',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Initialize Cloud Firestore
export const db = getFirestore(app)

export default app





