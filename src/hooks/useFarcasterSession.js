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
					}
					localStorage.setItem('farcaster-session-data', JSON.stringify(sessionData))
					setLastSavedFid(profile.fid)
					console.log('✅ Farcaster session saved to localStorage:', profile.username)
					console.log('📍 Key: farcaster-session-data')
					console.log('📊 Data:', sessionData)
				} catch (error) {
					console.error('❌ Error saving Farcaster session:', error)
				}
			}
		}
	}, [profile, lastSavedFid])

	// Check for existing session on mount
	useEffect(() => {
		const checkExistingSession = async () => {
			try {
				const savedSession = localStorage.getItem('farcaster-session-data')
				
				// Just check quickly if we have a saved session
				if (savedSession) {
					try {
						const sessionData = JSON.parse(savedSession)
						console.log('✅ Found existing session for:', sessionData.username)
						console.log('📝 Session restored from localStorage')
					} catch (error) {
						console.error('❌ Error parsing saved session:', error)
						localStorage.removeItem('farcaster-session-data')
					}
				} else {
					console.log('📝 No saved session found')
				}
				
				// Don't wait, just mark as done immediately
				// The isLoading flag will show the actual loading state
				setIsRestoringSession(false)
			} catch (error) {
				console.error('❌ Error checking session:', error)
				setIsRestoringSession(false)
			}
		}

		checkExistingSession()
	}, [])

	// Clear session on sign out
	useEffect(() => {
		if (isSignedIn === false) {
			try {
				localStorage.removeItem('farcaster-session-data')
				console.log('✅ Session cleared on sign out')
			} catch (error) {
				console.error('❌ Error clearing session:', error)
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

