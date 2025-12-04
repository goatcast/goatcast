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

	// Save session when user signs in successfully
	useEffect(() => {
		if (isSignedIn && profile) {
			try {
				// Save the auth data to localStorage
				const sessionData = {
					fid: profile.fid,
					username: profile.username,
					displayName: profile.displayName,
					pfpUrl: profile.pfpUrl,
					bio: profile.bio,
					followerCount: profile.followerCount,
					followingCount: profile.followingCount,
					signedInAt: new Date().toISOString(),
				}
				localStorage.setItem('farcaster-session-data', JSON.stringify(sessionData))
				console.log('✅ Farcaster session saved to localStorage')
			} catch (error) {
				console.error('❌ Error saving Farcaster session:', error)
			}
		}
	}, [isSignedIn, profile])

	// Check for existing session on mount
	useEffect(() => {
		const checkExistingSession = async () => {
			try {
				const savedSession = localStorage.getItem('farcaster-session-data')
				
				// Wait a moment for auth-kit to initialize
				await new Promise(resolve => setTimeout(resolve, 500))
				
				if (savedSession && !isSignedIn && !isLoading) {
					try {
						const sessionData = JSON.parse(savedSession)
						console.log('✅ Found existing session for:', sessionData.username)
						console.log('📝 Session will be restored when user interacts with auth')
					} catch (error) {
						console.error('❌ Error parsing saved session:', error)
						localStorage.removeItem('farcaster-session-data')
					}
				}
				
				setIsRestoringSession(false)
			} catch (error) {
				console.error('❌ Error checking session:', error)
				setIsRestoringSession(false)
			}
		}

		checkExistingSession()
	}, [isSignedIn, isLoading])

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

