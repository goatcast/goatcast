import { useState } from 'react'
import { useDesks } from '../hooks/useDesks'
import { useTheme } from '../contexts/ThemeContext'
import CreateDeskModal from './modals/CreateDeskModal'
import logoCircle from '../logo-circle.png'

export function Sidebar({ selectedDesk, onDeskSelect, profile }) {
	const { desks, loading, createDesk, deleteDesk } = useDesks()
	const { theme, toggleTheme } = useTheme()
	const [showCreateDeskModal, setShowCreateDeskModal] = useState(false)

	const handleCreateDesk = async (name) => {
		try {
			await createDesk(name)
		} catch (err) {
			console.error('Failed to create desk:', err)
			throw err
		}
	}

	const handleDeleteDesk = async (deskId) => {
		if (window.confirm('Are you sure you want to delete this desk?')) {
			try {
				await deleteDesk(deskId)
				if (selectedDesk?.id === deskId) {
					onDeskSelect(null)
				}
			} catch (err) {
				console.error('Failed to delete desk:', err)
			}
		}
	}

	return (
		<>
			<div className="w-64 bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 h-screen flex flex-col overflow-y-auto">
				{/* Header */}
				<div className="p-4 border-b border-gray-200 dark:border-neutral-800">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<img src={logoCircle} alt="Goatcast Logo" className="w-8 h-8" />
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">Goatcast</h2>
						</div>
						<button
							onClick={toggleTheme}
							className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
							title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
						>
							{theme === 'light' ? (
								<span className="text-gray-700 dark:text-gray-300 text-lg">🌙</span>
							) : (
								<span className="text-gray-700 dark:text-gray-300 text-lg">☀️</span>
							)}
						</button>
					</div>
					<button
						onClick={() => setShowCreateDeskModal(true)}
						className="w-full px-4 py-2 bg-gray-900 dark:bg-neutral-800 hover:bg-gray-800 dark:hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-2"
					>
						<span>+</span>
						<span>New Desk</span>
					</button>
				</div>

				{/* Desks List */}
				<div className="flex-1 overflow-y-auto p-4">
					<div className="space-y-2">
						{loading ? (
							<div className="text-gray-500 dark:text-neutral-400 text-sm text-center py-4">
								Loading desks...
							</div>
						) : desks.length === 0 ? (
							<div className="text-gray-500 dark:text-neutral-400 text-sm text-center py-4">
								No desks yet. Create one to get started!
							</div>
						) : (
							desks.map((desk) => (
								<div
									key={desk.id}
									className={`rounded-lg overflow-hidden transition-colors duration-200 ${
										selectedDesk?.id === desk.id
											? 'border border-blue-600 dark:border-blue-600'
											: 'bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-transparent'
									}`}
								>
									<button
										onClick={() => onDeskSelect(desk)}
										className="w-full text-left px-4 py-3 text-gray-900 dark:text-white font-medium flex items-center justify-between group"
									>
										<span className="truncate">{desk.name}</span>
										<span
											onClick={(e) => {
												e.stopPropagation()
												handleDeleteDesk(desk.id)
											}}
											className="opacity-0 group-hover:opacity-100 text-gray-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 text-sm cursor-pointer"
											title="Delete desk"
										>
											✕
										</span>
									</button>
								</div>
							))
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="p-4 border-t border-gray-200 dark:border-neutral-800">
					<p className="text-xs text-gray-500 dark:text-neutral-500 text-center">
						Organize your Farcaster feeds
					</p>
				</div>

				{/* User Profile */}
				{profile && (
					<div className="p-4 border-t border-gray-200 dark:border-neutral-800">
						<div className="flex items-center gap-3">
							{profile.pfpUrl && (
								<img
									src={profile.pfpUrl}
									alt={profile.displayName || profile.username || 'User avatar'}
									className="w-10 h-10 rounded-full"
								/>
							)}
							<div className="flex-1 min-w-0">
								<p className="text-gray-900 dark:text-white font-semibold truncate">
									{profile.displayName || profile.username}
								</p>
								<p className="text-gray-500 dark:text-neutral-400 text-sm truncate">
									@{profile.username}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Modals */}
			<CreateDeskModal
				isOpen={showCreateDeskModal}
				onClose={() => setShowCreateDeskModal(false)}
				onCreate={handleCreateDesk}
			/>
		</>
	)
}

export default Sidebar
