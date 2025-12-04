import { useEffect, useState } from 'react'

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || 'NEYNAR_API_DOCS'

export function useTrendingFeed() {
	const [casts, setCasts] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchTrendingFeed = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await fetch(
					'https://api.neynar.com/v2/farcaster/feed/trending?limit=10',
					{
						headers: {
							'x-api-key': NEYNAR_API_KEY,
						},
					}
				)

				if (!response.ok) {
					throw new Error(`API Error: ${response.statusText}`)
				}

				const data = await response.json()
				setCasts(data.casts || [])
			} catch (err) {
				setError(err.message)
				console.error('Failed to fetch trending feed:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchTrendingFeed()
	}, [])

	return { casts, loading, error }
}

