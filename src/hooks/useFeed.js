import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useProfile } from '@farcaster/auth-kit'

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || 'NEYNAR_API_DOCS'
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2/farcaster'

export function useFeed(feedType, options = {}) {
	const { profile } = useProfile()
	const [casts, setCasts] = useState([])
	const [loading, setLoading] = useState(false)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState(null)
	const [nextCursor, setNextCursor] = useState(null)
	const [hasMore, setHasMore] = useState(false)
	
	// Use ref to store options to avoid dependency issues
	const optionsRef = useRef(options)
	useEffect(() => {
		optionsRef.current = options
	}, [options])

	// Memoize user ID to avoid recalculating
	const userId = useMemo(() => {
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

	const fetchFeed = useCallback(
		async (cursor = null) => {
			const isInitialLoad = cursor === null

			if (isInitialLoad) {
				setLoading(true)
			} else {
				setLoadingMore(true)
			}

			setError(null)

			try {
				// Build URL inline to avoid dependency issues
				const opts = optionsRef.current
				const limit = opts.limit || 10
				const params = new URLSearchParams({ limit: limit.toString() })

				if (cursor) {
					params.append('cursor', cursor)
				}

				let url = ''
				switch (feedType) {
					case 'for_you':
						// Personalized feed - using following feed as fallback
						url = `${NEYNAR_BASE_URL}/feed/following`
						if (userId) {
							params.append('fid', userId)
						}
						break
					case 'trending_24h':
						url = `${NEYNAR_BASE_URL}/feed/trending`
						break
					case 'top_casts_24h':
						url = `${NEYNAR_BASE_URL}/feed/trending`
						params.append('with_recasts', 'true')
						break
					case 'following':
						url = `${NEYNAR_BASE_URL}/feed/following`
						if (userId) {
							params.append('fid', userId)
						}
						break
					case 'channel':
						if (opts.channelId) {
							url = `${NEYNAR_BASE_URL}/feed/channel`
							params.append('channel_id', opts.channelId)
						} else {
							url = `${NEYNAR_BASE_URL}/feed/trending`
						}
						break
					case 'search':
						if (opts.keyword) {
							url = `${NEYNAR_BASE_URL}/feed/search`
							params.append('q', opts.keyword)
						} else {
							url = `${NEYNAR_BASE_URL}/feed/trending`
						}
						break
					case 'user_casts':
						if (opts.fid) {
							url = `${NEYNAR_BASE_URL}/casts`
							params.append('fid', opts.fid)
						} else {
							url = `${NEYNAR_BASE_URL}/feed/trending`
						}
						break
					case 'liked':
						if (userId) {
							url = `${NEYNAR_BASE_URL}/feed/user_likes`
							params.append('fid', userId)
						} else {
							url = `${NEYNAR_BASE_URL}/feed/trending`
						}
						break
					case 'notifications':
						if (userId) {
							url = `${NEYNAR_BASE_URL}/notifications`
							params.append('fid', userId)
						} else {
							url = `${NEYNAR_BASE_URL}/feed/trending`
						}
						break
					case 'cast_detail':
						if (opts.castHash) {
							url = `${NEYNAR_BASE_URL}/cast`
							params.append('hash', opts.castHash)
						} else {
							url = `${NEYNAR_BASE_URL}/feed/trending`
						}
						break
					default:
						url = `${NEYNAR_BASE_URL}/feed/trending`
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

				if (isInitialLoad) {
					setCasts(newCasts)
				} else {
					setCasts((prevCasts) => [...prevCasts, ...newCasts])
				}

				// Update cursor and hasMore
				const cursorValue = data.next?.cursor || data.cursor
				setNextCursor(cursorValue)
				setHasMore(cursorValue !== null && cursorValue !== undefined && newCasts.length > 0)
			} catch (err) {
				setError(err.message)
				console.error(`Failed to fetch ${feedType} feed:`, err)
			} finally {
				if (isInitialLoad) {
					setLoading(false)
				} else {
					setLoadingMore(false)
				}
			}
		},
		[feedType, userId]
	)

	const loadMore = useCallback(() => {
		if (nextCursor && !loadingMore && !loading) {
			fetchFeed(nextCursor)
		}
	}, [nextCursor, loadingMore, loading, fetchFeed])

	// Only fetch when feedType changes, not when fetchFeed changes
	useEffect(() => {
		if (feedType) {
			fetchFeed()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feedType])

	return { casts, loading, loadingMore, error, hasMore, loadMore, refetch: () => fetchFeed() }
}

