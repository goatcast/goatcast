import { useEffect } from 'react'
import { useCastDetail } from '../hooks/useCastDetail'
import { CastItem } from './CastItem'
import { TimeAgo } from './TimeAgo'

export function CastDetailPanel({ castHash, onClose }) {
	const {
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
	} = useCastDetail()

	useEffect(() => {
		if (castHash) {
			fetchCastDetail(castHash)
		} else {
			clearCast()
		}
	}, [castHash, fetchCastDetail, clearCast])

	return (
		<div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-lg overflow-hidden flex flex-col h-full min-w-[400px] max-w-[500px] shrink-0">
			{/* Header */}
			<div className="bg-gray-50 dark:bg-neutral-800 px-4 py-3 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between shrink-0">
				<h2 className="text-xl font-bold text-gray-900 dark:text-white">
					Cast Details
				</h2>
				<button
					onClick={onClose}
					className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors text-lg"
					disabled={loading}
				>
					✕
				</button>
			</div>

			{/* Content - Scrollable */}
			<div className="flex-1 overflow-y-auto p-6">
				{loading ? (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					</div>
				) : error ? (
					<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-900 dark:text-red-200 px-4 py-3 rounded-lg">
						<p className="font-semibold">Error loading cast</p>
						<p className="text-sm mt-1">{error}</p>
					</div>
				) : cast ? (
					<div className="space-y-6">
						{/* Author Info */}
						{cast.author && (
							<div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-neutral-800">
								{cast.author.pfp_url && (
									<img
										src={cast.author.pfp_url}
										alt={cast.author.username}
										className="w-12 h-12 rounded-full"
									/>
								)}
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<p className="text-gray-900 dark:text-white font-semibold">
											{cast.author.display_name || cast.author.username}
										</p>
										{cast.author.username && (
											<p className="text-gray-500 dark:text-neutral-400 text-sm">
												@{cast.author.username}
											</p>
										)}
									</div>
									{cast.author.bio && (
										<p className="text-gray-600 dark:text-neutral-400 text-sm mt-1 line-clamp-2">
											{cast.author.bio}
										</p>
									)}
								</div>
							</div>
						)}

						{/* Cast Text */}
						<div>
							<p className="text-gray-900 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap wrap-break-word">
								{cast.text}
							</p>
							{cast.timestamp && (
								<p className="text-gray-500 dark:text-neutral-500 text-sm mt-3">
									<TimeAgo timestamp={cast.timestamp} />
								</p>
							)}
						</div>

						{/* Embeds */}
						{cast.embeds && cast.embeds.length > 0 && (
							<div className="space-y-3">
								<h3 className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
									Embeds
								</h3>
								{cast.embeds.map((embed, idx) => {
									if (embed.url) {
										return (
											<a
												key={idx}
												href={embed.url}
												target="_blank"
												rel="noopener noreferrer"
												className="block p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
											>
												<p className="text-blue-600 dark:text-blue-400 text-sm break-all">
													{embed.url}
												</p>
											</a>
										)
									}
									return null
								})}
							</div>
						)}

						{/* Reactions */}
						<div className="pt-4 border-t border-gray-200 dark:border-neutral-800">
							<h3 className="text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-3">
								Engagement
							</h3>
							<div className="flex items-center gap-6 text-gray-600 dark:text-neutral-400">
								<div className="flex items-center gap-2">
									<span>💬</span>
									<span className="text-sm">
										{cast.replies?.count || cast.reply_count || 0}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span>🔄</span>
									<span className="text-sm">
										{cast.reactions?.recasts_count || cast.recast_count || 0}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span>❤️</span>
									<span className="text-sm">
										{cast.reactions?.likes_count || cast.like_count || 0}
									</span>
								</div>
							</div>
						</div>

						{/* Cast Hash */}
						{cast.hash && (
							<div className="pt-4 border-t border-gray-200 dark:border-neutral-800">
								<div className="flex items-center justify-between">
									<p className="text-xs text-gray-500 dark:text-neutral-500 font-mono break-all">
										{cast.hash}
									</p>
									<a
										href={`https://warpcast.com/~/conversations/${cast.hash}`}
										target="_blank"
										rel="noopener noreferrer"
										className="ml-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm whitespace-nowrap"
									>
										<span>🔗</span>
										<span>View on Warpcast</span>
									</a>
								</div>
							</div>
						)}

						{/* Parent Cast Info */}
						{cast.parent_hash && (
							<div className="pt-4 border-t border-gray-200 dark:border-neutral-800">
								<p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">
									Reply to:
								</p>
								<p className="text-xs text-gray-500 dark:text-neutral-500 font-mono break-all">
									{cast.parent_hash}
								</p>
							</div>
						)}

						{/* Replies Section */}
						<div className="pt-4 border-t border-gray-200 dark:border-neutral-800">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Replies ({replies.length})
							</h3>

							{loadingReplies ? (
								<div className="flex justify-center items-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
								</div>
							) : replies.length === 0 ? (
								<p className="text-gray-500 dark:text-neutral-400 text-sm text-center py-8">
									No replies yet
								</p>
							) : (
								<>
									<div className="space-y-0">
										{replies.map((reply, index) => (
											<CastItem
												key={reply.hash}
												cast={reply}
												type="comment"
												showBorder={true}
												isLast={index === replies.length - 1}
											/>
										))}
									</div>

									{/* Load More Button */}
									{hasMoreReplies && (
										<div className="pt-4 flex justify-center">
											<button
												onClick={loadMoreReplies}
												disabled={loadingMoreReplies}
												className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors text-sm flex items-center gap-2"
											>
												{loadingMoreReplies ? (
													<>
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
														<span>Loading...</span>
													</>
												) : (
													<span>Load More Replies</span>
												)}
											</button>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				) : (
					<div className="text-center text-gray-500 dark:text-neutral-400 py-12">
						<p>No cast selected</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default CastDetailPanel
