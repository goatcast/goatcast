import { useEffect, useState } from 'react'
import { useProfile } from '@farcaster/auth-kit'

/**
 * Hook to handle authentication restoration after page reload
 * 
 * When a user reloads the page:
 * 1. The auth state is restored from localStorage (handled by @farcaster/auth-kit)
 * 2. useProfile() returns isLoading=true while restoring
 * 3. This hook tracks the restore process
 * 4. Returns isRestoring flag to prevent UI flickering
 * 
 * @returns {boolean} isRestoring - true while auth is being restored from localStorage
 */
export function useAuthRestore() {
	const { isLoading, profile } = useProfile()
	const [isRestoring, setIsRestoring] = useState(true)

	useEffect(() => {
		// Auth restoration happens in two scenarios:
		// 1. Page load - auth state restored from localStorage (isLoading=true)
		// 2. User interaction - new auth (isLoading=false, profile exists)
		
		// If profile loaded or auth finished loading, we're done restoring
		if (!isLoading) {
			setIsRestoring(false)
		}
	}, [isLoading])

	return isRestoring
}

