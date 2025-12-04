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
			<div className="bg-goatcast-highlight border border-goatcast-border rounded-lg shadow-2xl max-w-md w-full p-6">
				<h2 className="text-2xl font-bold text-goatcast-title mb-2">
					Create New Column
				</h2>
				<p className="text-goatcast-muted mb-6">
					Adding to: <span className="font-semibold text-goatcast-lightOrange">{deskName}</span>
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-goatcast-subTitle mb-2">
							Column Name
						</label>
						<input
							type="text"
							value={columnName}
							onChange={(e) => setColumnName(e.target.value)}
							placeholder="e.g., Trending, My Circle, Notifications"
							className="w-full px-4 py-2 bg-goatcast-hover border border-goatcast-border rounded-lg text-goatcast-title placeholder-goatcast-muted focus:outline-none focus:border-goatcast-darkOrange transition-colors"
							disabled={loading}
							autoFocus
						/>
					</div>

					<p className="text-xs text-goatcast-muted">
						Columns hold different feeds of casts within this desk.
					</p>

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
							{loading ? 'Creating...' : 'Create Column'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreateColumnModal

