import { useState } from 'react'

export function CreateDeskModal({ isOpen, onClose, onCreate }) {
	const [deskName, setDeskName] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!deskName.trim()) {
			setError('Please enter a desk name')
			return
		}

		setLoading(true)
		setError('')
		try {
			await onCreate(deskName.trim())
			setDeskName('')
			setTimeout(() => {
				onClose()
			}, 500)
		} catch (err) {
			console.error('Failed to create desk:', err)
			setError(
				err.message ||
					'Failed to create desk. Check your Firebase config and make sure you are signed in.'
			)
			setLoading(false)
		}
	}

	const handleClose = () => {
		setDeskName('')
		setError('')
		onClose()
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/50 dark:bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-2xl max-w-md w-full p-6">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Create New Desk
				</h2>
				<p className="text-gray-600 dark:text-neutral-400 mb-6">
					Create a new desk to organize your Farcaster columns
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
							Desk Name
						</label>
						<input
							type="text"
							value={deskName}
							onChange={(e) => setDeskName(e.target.value)}
							placeholder="e.g., Trending, Notifications, Following"
							className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
							disabled={loading}
							autoFocus
						/>
					</div>

					{error && (
						<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-900 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					)}

					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={handleClose}
							className="flex-1 px-4 py-2 bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200"
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-500"
							disabled={loading}
						>
							{loading ? 'Creating...' : 'Create Desk'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreateDeskModal
