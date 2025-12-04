import { useEffect, useState } from 'react'
import { useProfile } from '@farcaster/auth-kit'

/**
 * Hook to handle authentication restoration after page reload
 * 
 * Tracks if we're waiting for auth to be restored from localStorage on initial page load
 * 
 * @returns {boolean} isRestoring - true while checking for stored auth on initial load
 */
export function useAuthRestore() {
	const { isLoading, profile } = useProfile()
	const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

	useEffect(() => {
		// Mark that we've done the initial auth check
		// This happens after the first render when isLoading reflects actual state
		if (!hasCheckedAuth) {
			// Give it a moment for auth to be checked
			const timer = setTimeout(() => {
				setHasCheckedAuth(true)
			}, 500)
			return () => clearTimeout(timer)
		}
	}, [hasCheckedAuth])

	// Return true only while we're on initial page load before first auth check completes
	return !hasCheckedAuth
}

