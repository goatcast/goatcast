import { useState, useEffect } from 'react'
import { useDesks } from '../../hooks/useDesks'

// Feed type definitions with icons and descriptions
const FEED_TYPES = {
	feeds: [
		{
			id: 'for_you',
			name: 'For You',
			description: 'Personalized recommendations',
			icon: '✨',
		},
		{
			id: 'trending_24h',
			name: 'Trending in 24 hours',
			description: 'Popular casts',
			icon: '🔥',
		},
		{
			id: 'top_casts_24h',
			name: 'Top Casts in 24 hours',
			description: 'Most engaged casts',
			icon: '🏆',
		},
		{
			id: 'following',
			name: 'Chrono Reverse Feed',
			description: 'Casts from users you follow',
			icon: '⬆️',
		},
	],
	discover: [
		{
			id: 'search',
			name: 'Search by keyword',
			description: 'Find casts by keyword',
			icon: '🔍',
		},
		{
			id: 'channel',
			name: 'Channel',
			description: 'Casts from channels',
			icon: '#️⃣',
		},
		{
			id: 'frame_v2',
			name: 'Frame v2',
			description: 'Explore Frame v2 content and interactions',
			icon: '🌐',
		},
		{
			id: 'fid',
			name: 'FID-2',
			description: 'Flexible targets for messages',
			icon: '🔗',
		},
		{
			id: 'cast_detail',
			name: 'Cast Detail',
			description: 'View cast and its replies',
			icon: '💬',
		},
		{
			id: 'clanker',
			name: 'Clanker',
			description: 'Clanker world',
			icon: '📊',
		},
	],
	personal: [
		{
			id: 'liked',
			name: 'Liked Casts',
			description: 'Expert curated casts',
			icon: '❤️',
		},
		{
			id: 'user_casts',
			name: 'User Casts',
			description: 'Casts from users',
			icon: '👤',
		},
		{
			id: 'notifications',
			name: 'Notifications',
			description: 'Latest notifications',
			icon: '🔔',
		},
	],
}

export function CreateColumnModal({ isOpen, onClose, deskId, deskName }) {
	const [selectedFeedType, setSelectedFeedType] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const { createColumn } = useDesks()

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!selectedFeedType) {
			setError('Please select a feed type')
			return
		}

		setLoading(true)
		setError('')
		try {
			const feedTypeData = [...FEED_TYPES.feeds, ...FEED_TYPES.discover, ...FEED_TYPES.personal].find(
				(f) => f.id === selectedFeedType
			)
			await createColumn(deskId, feedTypeData.name, selectedFeedType)
			setSelectedFeedType(null)
			onClose()
		} catch (err) {
			setError(err.message || 'Failed to create column')
		} finally {
			setLoading(false)
		}
	}

	const handleClose = () => {
		setSelectedFeedType(null)
		setError('')
		onClose()
	}

	// Reset when modal opens
	useEffect(() => {
		if (isOpen) {
			setSelectedFeedType(null)
			setError('')
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-neutral-800 shrink-0">
					<h2 className="text-2xl font-bold text-white">Add new column</h2>
					<button
						onClick={handleClose}
						className="text-neutral-400 hover:text-white transition-colors text-xl"
						disabled={loading}
					>
						✕
					</button>
				</div>

				{/* Content - Scrollable */}
				<div className="flex-1 overflow-y-auto p-6">
					<p className="text-neutral-400 mb-6 text-sm">
						Adding to:{' '}
						<span className="font-semibold text-blue-400">{deskName}</span>
					</p>

					{/* Feeds Section */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-white mb-4">Feeds</h3>
						<div className="space-y-2">
							{FEED_TYPES.feeds.map((feed) => (
								<button
									key={feed.id}
									type="button"
									onClick={() => setSelectedFeedType(feed.id)}
									className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all ${
										selectedFeedType === feed.id
											? 'bg-blue-900 border-blue-600'
											: 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
									}`}
									disabled={loading}
								>
									<span className="text-2xl">{feed.icon}</span>
									<div className="flex-1 text-left">
										<p className="text-white font-medium">{feed.name}</p>
										<p className="text-neutral-400 text-sm mt-1">{feed.description}</p>
									</div>
									{selectedFeedType === feed.id && (
										<span className="text-blue-400">✓</span>
									)}
								</button>
							))}
						</div>
					</div>

					{/* Discover Section */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-white mb-4">Discover</h3>
						<div className="space-y-2">
							{FEED_TYPES.discover.map((feed) => (
								<button
									key={feed.id}
									type="button"
									onClick={() => setSelectedFeedType(feed.id)}
									className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all ${
										selectedFeedType === feed.id
											? 'bg-blue-900 border-blue-600'
											: 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
									}`}
									disabled={loading}
								>
									<span className="text-2xl">{feed.icon}</span>
									<div className="flex-1 text-left">
										<p className="text-white font-medium">{feed.name}</p>
										<p className="text-neutral-400 text-sm mt-1">{feed.description}</p>
									</div>
									{selectedFeedType === feed.id && (
										<span className="text-blue-400">✓</span>
									)}
								</button>
							))}
						</div>
					</div>

					{/* Personal Section */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-white mb-4">Personal</h3>
						<div className="space-y-2">
							{FEED_TYPES.personal.map((feed) => (
								<button
									key={feed.id}
									type="button"
									onClick={() => setSelectedFeedType(feed.id)}
									className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all ${
										selectedFeedType === feed.id
											? 'bg-blue-900 border-blue-600'
											: 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
									}`}
									disabled={loading}
								>
									<span className="text-2xl">{feed.icon}</span>
									<div className="flex-1 text-left">
										<p className="text-white font-medium">{feed.name}</p>
										<p className="text-neutral-400 text-sm mt-1">{feed.description}</p>
									</div>
									{selectedFeedType === feed.id && (
										<span className="text-blue-400">✓</span>
									)}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-neutral-800 shrink-0">
					{error && (
						<div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">
							{error}
						</div>
					)}

					<div className="flex gap-3">
						<button
							type="button"
							onClick={handleClose}
							className="flex-1 px-4 py-2 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors duration-200"
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-500"
							disabled={loading || !selectedFeedType}
						>
							{loading ? 'Creating...' : 'Create Column'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CreateColumnModal
