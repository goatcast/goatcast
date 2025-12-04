/**
 * Session Storage Utilities
 * Handles localStorage operations for user session persistence
 */

const PROFILE_KEY = 'goatcast_user_profile'
const SESSION_KEY = 'goatcast_session'

export const sessionStorage = {
	// Save user profile to localStorage
	saveProfile: (profile) => {
		try {
			localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
			return true
		} catch (err) {
			console.error('Error saving profile to localStorage:', err)
			return false
		}
	},

	// Load user profile from localStorage
	loadProfile: () => {
		try {
			const cached = localStorage.getItem(PROFILE_KEY)
			return cached ? JSON.parse(cached) : null
		} catch (err) {
			console.error('Error loading profile from localStorage:', err)
			return null
		}
	},

	// Check if user has a cached session
	hasCachedSession: () => {
		return localStorage.getItem(PROFILE_KEY) !== null
	},

	// Clear user session from localStorage
	clearSession: () => {
		try {
			localStorage.removeItem(PROFILE_KEY)
			localStorage.removeItem(SESSION_KEY)
			return true
		} catch (err) {
			console.error('Error clearing session:', err)
			return false
		}
	},

	// Get session metadata
	getSessionMeta: () => {
		try {
			const meta = localStorage.getItem(SESSION_KEY)
			return meta ? JSON.parse(meta) : null
		} catch (err) {
			return null
		}
	},

	// Update session metadata
	updateSessionMeta: (meta) => {
		try {
			localStorage.setItem(SESSION_KEY, JSON.stringify({
				...sessionStorage.getSessionMeta(),
				...meta,
				updatedAt: new Date().toISOString(),
			}))
			return true
		} catch (err) {
			console.error('Error updating session metadata:', err)
			return false
		}
	},
}

