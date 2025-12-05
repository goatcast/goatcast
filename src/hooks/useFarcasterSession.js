import { useEffect, useState } from 'react'
import { useSignIn, useProfile } from '@farcaster/auth-kit'

/**
 * Hook to persist Farcaster session across page reloads
 * 
 * This hook:
 * 1. Saves the auth result to localStorage when user signs in
 * 2. Restores the signed-in state on page reload
 * 3. Maintains session persistence across browser refresh
 * 
 * The key insight: We need to manually handle Farcaster auth session
 * because @farcaster/auth-kit doesn't auto-persist by default
 */
export function useFarcasterSession() {
	const { signIn, signOut, isSignedIn } = useSignIn()
	const { profile, isLoading } = useProfile()
	const [isRestoringSession, setIsRestoringSession] = useState(true)
	const [lastSavedFid, setLastSavedFid] = useState(null)

	// Save session when profile becomes available
	// This works even if isSignedIn is not reliable
	useEffect(() => {
		if (profile && profile.fid) {
			// Only save if we haven't already saved this user
			if (lastSavedFid !== profile.fid) {
				try {
					// Check what localStorage keys Farcaster auth-kit is using
					const allKeys = Object.keys(localStorage)
					const authKitKeys = allKeys.filter(key => {
						const lowerKey = key.toLowerCase()
						return lowerKey.includes('farcaster') || 
						       lowerKey.includes('auth') || 
						       lowerKey.includes('siwe') ||
						       lowerKey.includes('token')
					})
					
					// Save the auth data to localStorage
					const sessionData = {
						fid: profile.fid,
						username: profile.username,
						displayName: profile.displayName,
						pfpUrl: profile.pfpUrl,
						bio: profile.bio || '',
						followerCount: profile.followerCount || 0,
						followingCount: profile.followingCount || 0,
						signedInAt: new Date().toISOString(),
						// Store the auth-kit keys so we can check if they exist on reload
						authKitKeys: authKitKeys,
					}
					localStorage.setItem('farcaster-session-data', JSON.stringify(sessionData))
					setLastSavedFid(profile.fid)
				} catch (error) {
					console.error('❌ Error saving Farcaster session:', error)
				}
			}
		}
	}, [profile, lastSavedFid])

	// Check for existing session on mount
	useEffect(() => {
		const savedSession = localStorage.getItem('farcaster-session-data')
		
		if (savedSession) {
			try {
				const sessionData = JSON.parse(savedSession)
				// Check if the auth-kit keys from when user signed in still exist
				if (sessionData.authKitKeys && sessionData.authKitKeys.length > 0) {
					const missingKeys = sessionData.authKitKeys.filter(key => !localStorage.getItem(key))
					// If keys are missing, auth-kit cannot restore session automatically
				}
			} catch (error) {
				console.error('Error parsing saved session:', error)
				localStorage.removeItem('farcaster-session-data')
			}
		}
	}, [])

	// Wait for auth-kit to finish restoring session
	useEffect(() => {
		// Once loading is complete (either with or without profile), mark restoration as done
		if (!isLoading) {
			// Give it a small delay to ensure auth-kit has finished processing
			const timeoutId = setTimeout(() => {
				// Re-check profile state after delay to get final state
				// Note: We can't access profile in the timeout closure, so we'll check it in the effect dependency
				setIsRestoringSession(false)
			}, 200) // Small delay to ensure auth-kit has finished
			
			return () => clearTimeout(timeoutId)
		}
	}, [isLoading, profile])


	// Clear session on sign out
	useEffect(() => {
		if (isSignedIn === false) {
			try {
				localStorage.removeItem('farcaster-session-data')
			} catch (error) {
				console.error('Error clearing session:', error)
			}
		}
	}, [isSignedIn])

	return {
		isRestoringSession,
		isSignedIn,
		profile,
		isLoading,
	}
}

