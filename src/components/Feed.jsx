import { useEffect, useRef } from 'react'
import { useFeed } from '../hooks/useFeed'
import { TimeAgo } from './TimeAgo'

export function Feed({ feedType = 'trending_24h', feedOptions = {} }) {
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
					<div
						key={cast.hash}
						className={`p-5 ${
							index < casts.length - 1
								? 'border-b border-gray-200 dark:border-neutral-800'
								: ''
						}`}
					>
						{/* Author Info */}
						{cast.author && (
							<div className="flex items-center gap-3 mb-4">
								{cast.author.pfp_url && (
									<img
										src={cast.author.pfp_url}
										alt={cast.author.username}
										className="w-10 h-10 rounded-full"
									/>
								)}
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<p className="text-gray-900 dark:text-white font-semibold">
											@{cast.author.username}
										</p>
									</div>
									<p className="text-gray-500 dark:text-neutral-500 text-sm">
										<TimeAgo timestamp={cast.timestamp} />
									</p>
								</div>
							</div>
						)}

						{/* Cast Text */}
						<p className="text-gray-900 dark:text-neutral-100 mb-4 leading-relaxed whitespace-pre-wrap wrap-break-words">
							{cast.text}
						</p>

						{/* Embeds */}
						{cast.embeds && cast.embeds.length > 0 && (
							<div className="mb-4 space-y-2">
								{cast.embeds.map((embed, idx) => {
									if (embed.url) {
										return (
											<a
												key={idx}
												href={embed.url}
												target="_blank"
												rel="noopener noreferrer"
												className="block text-blue-400 hover:underline truncate"
											>
												{embed.url}
											</a>
										)
									}
									return null
								})}
							</div>
						)}

						{/* Reactions Footer */}
						<div className="flex items-center justify-between pt-4">
							<div className="flex items-center gap-6 text-gray-500 dark:text-neutral-400 text-sm">
								<button className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors">
									<span>💬</span>
									<span>{cast.replies?.count || 0}</span>
								</button>
								<button className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors">
									<span>🔄</span>
									<span>{cast.reactions?.recasts_count || 0}</span>
								</button>
								<button className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors">
									<span>❤️</span>
									<span>{cast.reactions?.likes_count || 0}</span>
								</button>
							</div>
							{cast.hash && (
								<a
									href={`https://warpcast.com/~/conversations/${cast.hash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-gray-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
									title="View on Farcaster"
								>
									<span>🔗</span>
								</a>
							)}
						</div>
					</div>
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
