import { TimeAgo } from './TimeAgo'
import { ChatCircle, ArrowsClockwise, Heart, LinkSimple } from 'phosphor-react'
import { CastText } from './CastText'

export function CastItem({
	cast,
	type = 'cast',
	onClick,
	onUserClick,
	showBorder = true,
	isLast = false,
}) {
	if (!cast) return null

	const isComment = type === 'comment'

	const handleUserClick = (e) => {
		e.stopPropagation()
		if (onUserClick && cast.author?.fid) {
			onUserClick(cast.author.fid, cast.author)
		}
	}

	return (
		<div
			onClick={onClick}
			className={`${isComment ? 'py-4 px-2' : 'p-5'} ${
				onClick
					? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800/50'
					: ''
			} transition-colors ${
				showBorder && !isLast
					? 'border-b border-gray-200 dark:border-neutral-800'
					: ''
			}`}
		>
			{/* Author Info */}
			{cast.author && (
				<div
					className={`flex items-center gap-3 ${isComment ? 'mb-2' : 'mb-4'}`}
				>
					{cast.author.pfp_url && (
						<img
							src={cast.author.pfp_url}
							alt={cast.author.username}
							onClick={handleUserClick}
							className={`${isComment ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${
								onUserClick
									? 'cursor-pointer hover:opacity-80 transition-opacity'
									: ''
							}`}
						/>
					)}
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<p
								onClick={handleUserClick}
								className={`text-gray-900 dark:text-white ${
									isComment ? 'font-semibold text-sm' : 'font-semibold'
								} ${onUserClick ? 'cursor-pointer hover:underline' : ''}`}
							>
								{cast.author.username}
							</p>
						</div>
						<p
							className={`text-gray-500 dark:text-neutral-500 ${
								isComment ? 'text-xs' : 'text-sm'
							}`}
						>
							<TimeAgo timestamp={cast.timestamp} />
						</p>
					</div>
				</div>
			)}

			{/* Cast Text */}
			<p
				className={`text-gray-900 dark:text-neutral-100 ${
					isComment ? 'mb-2' : 'mb-4'
				} leading-relaxed whitespace-pre-wrap wrap-break-word ${
					isComment ? 'text-sm' : ''
				}`}
			>
				<CastText
					text={cast.text}
					onUsernameClick={(username) => {
						if (onUserClick) {
							// We'll need to fetch user by username, so pass it to parent
							onUserClick(null, null, username)
						}
					}}
				/>
			</p>

			{/* Embeds */}
			{cast.embeds && cast.embeds.length > 0 && (
				<div className={`${isComment ? 'mb-2' : 'mb-4'} space-y-2`}>
					{cast.embeds.map((embed, idx) => {
						if (embed.url) {
							return (
								<a
									key={idx}
									href={embed.url}
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
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
			<div
				className={`flex items-center ${
					isComment ? 'justify-start' : 'justify-between'
				} ${isComment ? 'pt-2' : 'pt-4'}`}
			>
				<div
					className={`flex items-center ${
						isComment ? 'gap-4' : 'gap-6'
					} text-gray-500 dark:text-neutral-400 ${
						isComment ? 'text-xs' : 'text-sm'
					}`}
				>
					<button
						onClick={(e) => e.stopPropagation()}
						className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors"
					>
						<ChatCircle size={isComment ? 14 : 16} />
						<span>{cast.replies?.count || 0}</span>
					</button>
					<button
						onClick={(e) => e.stopPropagation()}
						className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors"
					>
						<ArrowsClockwise size={isComment ? 14 : 16} />
						<span>{cast.reactions?.recasts_count || 0}</span>
					</button>
					<button
						onClick={(e) => e.stopPropagation()}
						className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors"
					>
						<Heart size={isComment ? 14 : 16} />
						<span>{cast.reactions?.likes_count || 0}</span>
					</button>
				</div>
				{!isComment && cast.hash && (
					<a
						href={`https://warpcast.com/~/conversations/${cast.hash}`}
						target="_blank"
						rel="noopener noreferrer"
						onClick={(e) => e.stopPropagation()}
						className="flex items-center gap-2 text-gray-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
						title="View on Farcaster"
					>
						<LinkSimple size={16} />
					</a>
				)}
			</div>
		</div>
	)
}

export default CastItem
