import { useEffect } from 'react'
import { useProfile } from '@farcaster/auth-kit'

/**
 * Hook to debug session persistence
 * Logs auth state changes to help troubleshoot localStorage persistence
 */
export function useSessionPersistence() {
	const { profile, isLoading } = useProfile()

	useEffect(() => {
		// Auth state tracking (no logging)
	}, [profile, isLoading])
}

