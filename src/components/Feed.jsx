import { useTrendingFeed } from '../hooks/useTrendingFeed'

export function Feed() {
	const { casts, loading, error } = useTrendingFeed()

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
				<p className="font-semibold">Error loading feed</p>
				<p className="text-sm">{error}</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col">
			{casts.length === 0 ? (
				<div className="text-center text-neutral-400 py-8">
					<p>No casts found</p>
				</div>
			) : (
				casts.map((cast, index) => (
					<div
						key={cast.hash}
						className={`p-6 ${index < casts.length - 1 ? 'border-b border-neutral-800' : ''}`}
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
										<p className="text-white font-semibold">
											{cast.author.display_name || cast.author.username}
										</p>
										<p className="text-neutral-500">@{cast.author.username}</p>
									</div>
									<p className="text-neutral-500 text-sm">
										{new Date(cast.timestamp).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
								</div>
							</div>
						)}

						{/* Cast Text */}
						<p className="text-neutral-100 mb-4 leading-relaxed whitespace-pre-wrap">
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
						<div className="flex items-center justify-between pt-4 border-t border-neutral-800">
							<div className="flex items-center gap-6 text-neutral-400 text-sm">
								<button className="flex items-center gap-2 hover:text-neutral-300 transition-colors">
									<span>💬</span>
									<span>{cast.replies?.count || 0}</span>
								</button>
								<button className="flex items-center gap-2 hover:text-neutral-300 transition-colors">
									<span>🔄</span>
									<span>{cast.reactions?.recasts_count || 0}</span>
								</button>
								<button className="flex items-center gap-2 hover:text-neutral-300 transition-colors">
									<span>❤️</span>
									<span>{cast.reactions?.likes_count || 0}</span>
								</button>
							</div>
							{cast.hash && (
								<a
									href={`https://warpcast.com/~/conversations/${cast.hash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-neutral-400 hover:text-blue-400 transition-colors text-sm"
									title="View on Farcaster"
								>
									<span>🔗</span>
								</a>
							)}
						</div>
					</div>
				))
			)}
		</div>
	)
}

export default Feed
