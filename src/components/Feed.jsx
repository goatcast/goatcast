import { useEffect, useRef } from 'react'
import { useFeed } from '../hooks/useFeed'
import { CastItem } from './CastItem'

export function Feed({
	feedType = 'trending_24h',
	feedOptions = {},
	onCastClick,
	onUserClick,
}) {
	const { casts, loading, loadingMore, error, hasMore, loadMore } = useFeed(
		feedType,
		feedOptions
	)
	const observerTarget = useRef(null)

	// Intersection Observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
					loadMore()
				}
			},
			{ threshold: 0.1 }
		)

		const currentTarget = observerTarget.current
		if (currentTarget) {
			observer.observe(currentTarget)
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget)
			}
		}
	}, [hasMore, loadingMore, loading, loadMore])

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-900 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
				<p className="font-semibold">Error loading feed</p>
				<p className="text-sm">{error}</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col">
			{casts.length === 0 ? (
				<div className="text-center text-gray-500 dark:text-neutral-400 py-8">
					<p>No casts found</p>
				</div>
			) : (
				casts.map((cast, index) => (
					<CastItem
						key={cast.hash}
						cast={cast}
						type="cast"
						onCastClick={onCastClick}
						onUserClick={onUserClick}
						showBorder={true}
						isLast={index === casts.length - 1}
					/>
				))
			)}

			{/* Load More Trigger */}
			{hasMore && (
				<div ref={observerTarget} className="py-8 flex justify-center">
					{loadingMore ? (
						<div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400">
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
							<span>Loading more...</span>
						</div>
					) : (
						<button
							onClick={loadMore}
							className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
						>
							Load More
						</button>
					)}
				</div>
			)}

			{!hasMore && casts.length > 0 && (
				<div className="text-center text-gray-500 dark:text-neutral-500 py-8">
					<p>No more casts to load</p>
				</div>
			)}
		</div>
	)
}

export default Feed
