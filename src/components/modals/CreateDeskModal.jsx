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
			console.log('Creating desk with name:', deskName)
			await onCreate(deskName.trim())
			console.log('Desk created successfully')
			setDeskName('')
			setTimeout(() => {
				onClose()
			}, 500)
		} catch (err) {
			console.error('Failed to create desk:', err)
			setError(err.message || 'Failed to create desk. Check your Firebase config and make sure you are signed in.')
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
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-goatcast-highlight border border-goatcast-border rounded-lg shadow-2xl max-w-md w-full p-6">
				<h2 className="text-2xl font-bold text-goatcast-title mb-4">Create New Desk</h2>
				<p className="text-goatcast-muted mb-6">
					Create a new desk to organize your Farcaster columns
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-goatcast-subTitle mb-2">
							Desk Name
						</label>
						<input
							type="text"
							value={deskName}
							onChange={(e) => setDeskName(e.target.value)}
							placeholder="e.g., Trending, Notifications, Following"
							className="w-full px-4 py-2 bg-goatcast-hover border border-goatcast-border rounded-lg text-goatcast-title placeholder-goatcast-muted focus:outline-none focus:border-goatcast-darkOrange transition-colors"
							disabled={loading}
							autoFocus
						/>
					</div>

					{error && (
						<div className="bg-goatcast-darkOrange bg-opacity-20 border border-goatcast-darkOrange text-goatcast-darkOrange px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					)}

					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={handleClose}
							className="flex-1 px-4 py-2 bg-goatcast-hover text-goatcast-title font-medium rounded-lg hover:bg-goatcast-border transition-colors duration-200"
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 px-4 py-2 bg-goatcast-darkOrange text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-70"
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

