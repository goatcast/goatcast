import { useEffect } from 'react'
import { useUserProfile } from '../hooks/useUserProfile'
import { CastItem } from './CastItem'
import { User, Users, ArrowLeft } from 'phosphor-react'

export function UserProfilePanel({
	userId,
	username,
	userData,
	onClose,
	onUserClick,
}) {
	const {
		user,
		casts,
		loading,
		loadingMore,
		error,
		hasMore,
		loadUserProfile,
		loadUserByUsername,
		loadMoreCasts,
		clearUser,
		setUserData,
	} = useUserProfile()

	useEffect(() => {
		if (username) {
			loadUserByUsername(username)
		} else if (userId) {
			loadUserProfile(userId, userData)
		} else {
			clearUser()
		}
	}, [
		userId,
		username,
		userData,
		loadUserProfile,
		loadUserByUsername,
		clearUser,
	])

	// Extract user data from first cast if user data not provided and casts are loaded
	useEffect(() => {
		if (!user && casts.length > 0 && casts[0]?.author) {
			setUserData(casts[0].author)
		}
	}, [casts, user, setUserData])

	return (
		<div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-lg overflow-hidden flex flex-col h-full min-w-[400px] max-w-[500px] shrink-0">
			{/* Header */}
			<div className="bg-gray-50 dark:bg-neutral-800 px-4 py-3 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between shrink-0">
				<div className="flex items-center gap-2">
					<button
						onClick={onClose}
						className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-2"
						disabled={loading}
					>
						<ArrowLeft size={20} />
					</button>
					<h2 className="text-xl font-bold text-gray-900 dark:text-white">
						Profile
					</h2>
				</div>
				<button
					onClick={onClose}
					className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors text-lg"
					disabled={loading}
				>
					✕
				</button>
			</div>

			{/* Content - Scrollable */}
			<div className="flex-1 overflow-y-auto">
				{loading && casts.length === 0 ? (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					</div>
				) : error ? (
					<div className="px-4 py-6">
						<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-900 dark:text-red-200 px-4 py-3 rounded-lg">
							<p className="font-semibold">Error loading profile</p>
							<p className="text-sm mt-1">{error}</p>
						</div>
					</div>
				) : user || casts.length > 0 ? (
					<>
						{/* User Profile Header */}
						{user && (
							<div className="px-4 py-6 border-b border-gray-200 dark:border-neutral-800">
								<div className="flex items-start gap-4">
									{user.pfp_url && (
										<img
											src={user.pfp_url}
											alt={user.username}
											className="w-20 h-20 rounded-full"
										/>
									)}
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<h3 className="text-xl font-bold text-gray-900 dark:text-white">
												{user.display_name || user.username}
											</h3>
										</div>
										{user.username && (
											<p className="text-gray-500 dark:text-neutral-400 text-sm mb-2">
												@{user.username}
											</p>
										)}
										{user.profile?.bio?.text && (
											<p className="text-gray-700 dark:text-neutral-300 text-sm mb-4 leading-relaxed">
												{user.profile.bio.text}
											</p>
										)}
										<div className="flex items-center gap-6 text-sm text-gray-600 dark:text-neutral-400">
											<div className="flex items-center gap-1">
												<Users size={16} />
												<span>
													{user.follower_count?.toLocaleString() || 0}{' '}
													{user.follower_count === 1 ? 'follower' : 'followers'}
												</span>
											</div>
											<div className="flex items-center gap-1">
												<User size={16} />
												<span>
													{user.following_count?.toLocaleString() || 0}{' '}
													following
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* User's Casts */}
						<div className="px-4 py-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Casts
							</h3>

							{loading && casts.length === 0 ? (
								<div className="flex justify-center items-center py-12">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
								</div>
							) : casts.length === 0 ? (
								<div className="text-center text-gray-500 dark:text-neutral-400 py-12">
									<p>No casts found</p>
								</div>
							) : (
								<div className="space-y-0">
									{casts.map((cast, index) => (
										<CastItem
											key={cast.hash}
											cast={cast}
											type="cast"
											onUserClick={onUserClick}
											showBorder={true}
											isLast={index === casts.length - 1 && !hasMore}
										/>
									))}
								</div>
							)}

							{/* Load More Button */}
							{hasMore && (
								<div className="pt-4 flex justify-center">
									<button
										onClick={loadMoreCasts}
										disabled={loadingMore}
										className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors text-sm flex items-center gap-2"
									>
										{loadingMore ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
												<span>Loading...</span>
											</>
										) : (
											<span>Load More</span>
										)}
									</button>
								</div>
							)}
						</div>
					</>
				) : (
					<div className="text-center text-gray-500 dark:text-neutral-400 py-12">
						<p>No user selected</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default UserProfilePanel
