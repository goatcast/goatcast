import { useEffect, useState } from 'react'
import { useProfile } from '@farcaster/auth-kit'
import { db } from '../config/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

/**
 * Custom hook to manage user session persistence
 * - Stores user data in Firebase Firestore
 * - Caches user data in localStorage for instant loading
 * - Syncs between Firebase and local storage
 */
export function useUserSession() {
	const { profile, isLoading } = useProfile()
	const [cachedProfile, setCachedProfile] = useState(null)
	const [isInitialized, setIsInitialized] = useState(false)

	// Load cached user data from localStorage on mount
	useEffect(() => {
		const loadCachedProfile = () => {
			try {
				const cached = localStorage.getItem('goatcast_user_profile')
				if (cached) {
					setCachedProfile(JSON.parse(cached))
				}
			} catch (err) {
				console.error('Error loading cached profile:', err)
			}
			setIsInitialized(true)
		}

		loadCachedProfile()
	}, [])

	// When profile updates (user signs in), save to Firebase and localStorage
	useEffect(() => {
		if (!profile || isLoading) return

		const saveUserSession = async () => {
			try {
				const userData = {
					fid: profile.fid,
					username: profile.username,
					displayName: profile.displayName,
					pfpUrl: profile.pfpUrl,
					bio: profile.bio,
					followerCount: profile.followerCount,
					followingCount: profile.followingCount,
					lastSignIn: new Date().toISOString(),
				}

				// Save to localStorage for instant loading
				localStorage.setItem('goatcast_user_profile', JSON.stringify(userData))
				setCachedProfile(userData)

				// Save to Firebase Firestore for persistence across devices
				try {
					await setDoc(
						doc(db, 'users', profile.fid.toString()),
						{
							...userData,
							updatedAt: new Date().toISOString(),
						},
						{ merge: true }
					)
					console.log('User session saved to Firebase')
				} catch (firebaseErr) {
					// Silently fail if Firebase is not available, but keep local cache
					console.warn('Could not save to Firebase, using local cache:', firebaseErr)
				}
			} catch (err) {
				console.error('Error saving user session:', err)
			}
		}

		saveUserSession()
	}, [profile, isLoading])

	// Return the most recent profile data (either from auth or cache)
	const effectiveProfile = profile || cachedProfile

	return {
		profile: effectiveProfile,
		isLoading: !isInitialized || isLoading,
		isCached: !profile && cachedProfile !== null,
		hasCachedProfile: cachedProfile !== null,
		clearCache: () => {
			localStorage.removeItem('goatcast_user_profile')
			setCachedProfile(null)
		},
	}
}

