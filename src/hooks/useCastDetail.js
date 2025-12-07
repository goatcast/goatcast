import { useState, useCallback } from 'react'

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || 'NEYNAR_API_DOCS'
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2/farcaster'

/**
 * Hook to fetch cast details from Neynar API
 * Uses the /v2/farcaster/cast endpoint with identifier and type parameters
 * Also fetches replies using the /v2/farcaster/cast/conversation endpoint
 * which returns direct_replies array with nested replies
 */
export function useCastDetail() {
	const [cast, setCast] = useState(null)
	const [replies, setReplies] = useState([])
	const [nextCursor, setNextCursor] = useState(null)
	const [hasMoreReplies, setHasMoreReplies] = useState(false)
	const [loading, setLoading] = useState(false)
	const [loadingReplies, setLoadingReplies] = useState(false)
	const [loadingMoreReplies, setLoadingMoreReplies] = useState(false)
	const [error, setError] = useState(null)

	const fetchReplies = useCallback(
		async (castHash, cursor = null, append = false) => {
			if (!castHash) return

			if (append) {
				setLoadingMoreReplies(true)
			} else {
				setLoadingReplies(true)
			}

			try {
				// Use the conversation endpoint to get replies
				// This endpoint returns direct_replies array with nested replies
				let url = `${NEYNAR_BASE_URL}/cast/conversation?identifier=${encodeURIComponent(
					castHash
				)}&type=hash&reply_depth=2&limit=20`

				if (cursor) {
					url += `&cursor=${encodeURIComponent(cursor)}`
				}

				const response = await fetch(url, {
					headers: {
						'x-api-key': NEYNAR_API_KEY,
						'Content-Type': 'application/json',
					},
				})

				if (!response.ok) {
					throw new Error(`API Error: ${response.statusText}`)
				}

				const data = await response.json()

				// Extract direct_replies from conversation response
				// The structure is: data.conversation.cast.direct_replies
				let repliesData = []
				if (data.conversation?.cast?.direct_replies) {
					repliesData = data.conversation.cast.direct_replies
				} else if (data.conversation?.direct_replies) {
					repliesData = data.conversation.direct_replies
				} else if (data.direct_replies) {
					repliesData = data.direct_replies
				}

				// Update replies - append if loading more, replace if initial load
				if (append) {
					setReplies((prevReplies) => [...prevReplies, ...repliesData])
				} else {
					setReplies(repliesData)
				}

				// Update cursor and hasMore state
				const cursorValue = data.next?.cursor || data.cursor
				setNextCursor(cursorValue)
				setHasMoreReplies(
					cursorValue !== null &&
						cursorValue !== undefined &&
						repliesData.length > 0
				)
			} catch (err) {
				console.error('Failed to fetch replies:', err)
				// Don't set error state for replies, just log it
				if (!append) {
					setReplies([])
				}
			} finally {
				if (append) {
					setLoadingMoreReplies(false)
				} else {
					setLoadingReplies(false)
				}
			}
		},
		[]
	)

	const loadMoreReplies = useCallback(() => {
		if (cast?.hash && nextCursor && !loadingMoreReplies && !loadingReplies) {
			fetchReplies(cast.hash, nextCursor, true)
		}
	}, [cast?.hash, nextCursor, loadingMoreReplies, loadingReplies, fetchReplies])

	const fetchCastDetail = useCallback(
		async (castHash) => {
			if (!castHash) {
				setError('Cast hash is required')
				return
			}

			setLoading(true)
			setError(null)

			try {
				// Use the Neynar API endpoint for cast details
				// identifier can be hash or URL, type can be 'hash' or 'url'
				const url = `${NEYNAR_BASE_URL}/cast?identifier=${encodeURIComponent(
					castHash
				)}&type=hash`

				const response = await fetch(url, {
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
				// The API might return { result: { cast: {...} } } or { cast: {...} } or just the cast object
				let castData = null
				if (data.cast) {
					castData = data.cast
				} else if (data.result?.cast) {
					castData = data.result.cast
				} else if (data.result && !data.result.cast) {
					// Sometimes the result itself is the cast
					castData = data.result
				} else {
					castData = data
				}

				setCast(castData)

				// Fetch replies using thread feed endpoint
				if (castData?.hash) {
					fetchReplies(castData.hash)
				}
			} catch (err) {
				setError(err.message)
				console.error('Failed to fetch cast detail:', err)
				setCast(null)
			} finally {
				setLoading(false)
			}
		},
		[fetchReplies]
	)

	const clearCast = useCallback(() => {
		setCast(null)
		setReplies([])
		setNextCursor(null)
		setHasMoreReplies(false)
		setError(null)
	}, [])

	return {
		cast,
		replies,
		loading,
		loadingReplies,
		loadingMoreReplies,
		hasMoreReplies,
		error,
		fetchCastDetail,
		loadMoreReplies,
		clearCast,
	}
}
