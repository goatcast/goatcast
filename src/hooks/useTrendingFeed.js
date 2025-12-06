import { useEffect, useState, useCallback } from 'react'

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || 'NEYNAR_API_DOCS'

export function useTrendingFeed() {
	const [casts, setCasts] = useState([])
	const [loading, setLoading] = useState(false)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState(null)
	const [nextCursor, setNextCursor] = useState(null)
	const [hasMore, setHasMore] = useState(false)

	const fetchTrendingFeed = useCallback(async (cursor = null) => {
		const isInitialLoad = cursor === null
		
		if (isInitialLoad) {
			setLoading(true)
		} else {
			setLoadingMore(true)
		}
		
		setError(null)
		
		try {
			let url = 'https://api.neynar.com/v2/farcaster/feed/trending?limit=10'
			if (cursor) {
				url += `&cursor=${encodeURIComponent(cursor)}`
			}

			const response = await fetch(url, {
				headers: {
					'x-api-key': NEYNAR_API_KEY,
				},
			})

			if (!response.ok) {
				throw new Error(`API Error: ${response.statusText}`)
			}

			const data = await response.json()
			const newCasts = data.casts || []
			
			if (isInitialLoad) {
				setCasts(newCasts)
			} else {
				setCasts(prevCasts => [...prevCasts, ...newCasts])
			}

			// Update cursor and hasMore based on next cursor
			const cursorValue = data.next?.cursor
			setNextCursor(cursorValue)
			setHasMore(cursorValue !== null && cursorValue !== undefined)
		} catch (err) {
			setError(err.message)
			console.error('Failed to fetch trending feed:', err)
		} finally {
			if (isInitialLoad) {
				setLoading(false)
			} else {
				setLoadingMore(false)
			}
		}
	}, [])

	const loadMore = useCallback(() => {
		if (nextCursor && !loadingMore && !loading) {
			fetchTrendingFeed(nextCursor)
		}
	}, [nextCursor, loadingMore, loading, fetchTrendingFeed])

	useEffect(() => {
		fetchTrendingFeed()
	}, [fetchTrendingFeed])

	return { casts, loading, loadingMore, error, hasMore, loadMore }
}


