import { useEffect } from 'react'
import { useProfile } from '@farcaster/auth-kit'

/**
 * Hook to debug session persistence
 * Logs auth state changes to help troubleshoot localStorage persistence
 */
export function useSessionPersistence() {
	const { profile, isLoading } = useProfile()

	useEffect(() => {
		console.log('Auth State Changed:', {
			isLoading,
			hasProfile: !!profile,
			username: profile?.username,
		})
		
		// Log localStorage content for debugging
		const keys = Object.keys(localStorage).filter(k => k.includes('farcaster') || k.includes('auth'))
		console.log('LocalStorage Auth Keys:', keys)
	}, [profile, isLoading])
}

