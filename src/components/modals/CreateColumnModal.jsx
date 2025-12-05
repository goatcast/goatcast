import { useState } from 'react'
import { useDesks } from '../../hooks/useDesks'

export function CreateColumnModal({ isOpen, onClose, deskId, deskName }) {
	const [columnName, setColumnName] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const { createColumn } = useDesks()

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!columnName.trim()) {
			setError('Please enter a column name')
			return
		}

		setLoading(true)
		setError('')
		try {
			await createColumn(deskId, columnName.trim())
			setColumnName('')
			onClose()
		} catch (err) {
			setError(err.message || 'Failed to create column')
		} finally {
			setLoading(false)
		}
	}

	const handleClose = () => {
		setColumnName('')
		setError('')
		onClose()
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl max-w-md w-full p-6">
				<h2 className="text-2xl font-bold text-white mb-2">
					Create New Column
				</h2>
				<p className="text-neutral-400 mb-6">
					Adding to: <span className="font-semibold text-blue-400">{deskName}</span>
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Column Name
						</label>
						<input
							type="text"
							value={columnName}
							onChange={(e) => setColumnName(e.target.value)}
							placeholder="e.g., Trending, My Circle, Notifications"
							className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
							disabled={loading}
							autoFocus
						/>
					</div>

					<p className="text-xs text-neutral-500">
						Columns hold different feeds of casts within this desk.
					</p>

					{error && (
						<div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					)}

					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={handleClose}
							className="flex-1 px-4 py-2 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors duration-200"
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-500"
							disabled={loading}
						>
							{loading ? 'Creating...' : 'Create Column'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreateColumnModal

