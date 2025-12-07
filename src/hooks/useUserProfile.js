import { useState, useCallback } from 'react'
import { useProfile } from '@farcaster/auth-kit'

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || 'NEYNAR_API_DOCS'
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2/farcaster'

/**
 * Hook to fetch user profile and their casts from Neynar API
 * Uses the /v2/farcaster/feed/user/casts endpoint
 */
export function useUserProfile() {
	const { profile } = useProfile()
	const [user, setUser] = useState(null)
	const [casts, setCasts] = useState([])
	const [loading, setLoading] = useState(false)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState(null)
	const [nextCursor, setNextCursor] = useState(null)
	const [hasMore, setHasMore] = useState(false)

	// Get viewer FID for API calls
	const getViewerFid = useCallback(() => {
		if (profile?.fid) {
			return profile.fid.toString()
		}
		try {
			const savedSession = localStorage.getItem('farcaster-session-data')
			if (savedSession) {
				const sessionData = JSON.parse(savedSession)
				if (sessionData.fid) {
					return sessionData.fid.toString()
				}
			}
		} catch (error) {
			console.error('Error reading cached session:', error)
		}
		return null
	}, [profile?.fid])

	// Set user data directly (from cast.author when available)
	const setUserData = useCallback((userData) => {
		setUser(userData)
	}, [])

	const fetchUserCasts = useCallback(
		async (fid, cursor = null, append = false) => {
			if (!fid) {
				setError('User FID is required')
				return
			}

			const isInitialLoad = cursor === null

			if (isInitialLoad) {
				setLoading(true)
			} else {
				setLoadingMore(true)
			}
			setError(null)

			try {
				const viewerFid = getViewerFid()
				const url = `${NEYNAR_BASE_URL}/feed/user/casts`
				const params = new URLSearchParams({
					fid: fid.toString(),
					limit: '25',
					include_replies: 'true',
				})

				if (cursor) {
					params.append('cursor', cursor)
				}

				if (viewerFid) {
					params.append('viewer_fid', viewerFid)
				}

				const fullUrl = `${url}?${params.toString()}`

				const response = await fetch(fullUrl, {
					headers: {
						'x-api-key': NEYNAR_API_KEY,
						'Content-Type': 'application/json',
					},
				})

				if (!response.ok) {
					throw new Error(`API Error: ${response.statusText}`)
				}

				const data = await response.json()

				// Handle different response structures
				let newCasts = []
				if (data.casts) {
					newCasts = data.casts
				} else if (data.result?.casts) {
					newCasts = data.result.casts
				} else if (Array.isArray(data)) {
					newCasts = data
				} else if (data.result && Array.isArray(data.result)) {
					newCasts = data.result
				}

				if (append) {
					setCasts((prevCasts) => [...prevCasts, ...newCasts])
				} else {
					setCasts(newCasts)
				}

				// Update cursor and hasMore
				const cursorValue = data.next?.cursor || data.cursor
				setNextCursor(cursorValue)
				setHasMore(
					cursorValue !== null &&
						cursorValue !== undefined &&
						newCasts.length > 0
				)
			} catch (err) {
				setError(err.message)
				console.error('Failed to fetch user casts:', err)
			} finally {
				if (isInitialLoad) {
					setLoading(false)
				} else {
					setLoadingMore(false)
				}
			}
		},
		[getViewerFid]
	)

	const loadUserProfile = useCallback(
		async (fid, userData = null) => {
			if (!fid) {
				setError('User FID is required')
				return
			}

			// Clear previous data and show loading state
			setUser(null)
			setCasts([])
			setError(null)
			setLoading(true)

			// Set user data if provided (from cast.author), otherwise extract from first cast
			if (userData) {
				setUser(userData)
			}

			// Fetch user's casts (this will handle loading state)
			await fetchUserCasts(fid)
		},
		[fetchUserCasts]
	)

	const loadMoreCasts = useCallback(() => {
		if (user?.fid && nextCursor && !loadingMore && !loading) {
			fetchUserCasts(user.fid, nextCursor, true)
		}
	}, [user?.fid, nextCursor, loadingMore, loading, fetchUserCasts])

	const fetchUserByUsername = useCallback(
		async (username) => {
			if (!username) {
				setError('Username is required')
				return null
			}

			setLoading(true)
			setError(null)

			try {
				const viewerFid = getViewerFid()
				const url = `${NEYNAR_BASE_URL}/user/by_username/`
				const params = new URLSearchParams({
					username: username,
				})

				if (viewerFid) {
					params.append('viewer_fid', viewerFid)
				}

				const fullUrl = `${url}?${params.toString()}`

				const response = await fetch(fullUrl, {
					headers: {
						'x-api-key': NEYNAR_API_KEY,
						'Content-Type': 'application/json',
					},
				})

				if (!response.ok) {
					throw new Error(`API Error: ${response.statusText}`)
				}

				const data = await response.json()
				const userData = data.user || data.result?.user || data

				return userData
			} catch (err) {
				setError(err.message)
				console.error('Failed to fetch user by username:', err)
				return null
			} finally {
				setLoading(false)
			}
		},
		[getViewerFid]
	)

	const loadUserByUsername = useCallback(
		async (username) => {
			if (!username) {
				setError('Username is required')
				return
			}

			// Clear previous data and show loading state
			setUser(null)
			setCasts([])
			setError(null)
			setLoading(true)

			// Fetch user by username
			const userData = await fetchUserByUsername(username)

			if (userData && userData.fid) {
				setUser(userData)
				// Fetch user's casts
				await fetchUserCasts(userData.fid)
			} else {
				setLoading(false)
			}
		},
		[fetchUserByUsername, fetchUserCasts]
	)

	const clearUser = useCallback(() => {
		setUser(null)
		setCasts([])
		setNextCursor(null)
		setHasMore(false)
		setError(null)
	}, [])

	return {
		user,
		casts,
		loading,
		loadingMore,
		error,
		hasMore,
		loadUserProfile,
		loadUserByUsername,
		loadMoreCasts,
		clearUser,
		setUserData,
	}
}
