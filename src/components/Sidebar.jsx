import { useState } from 'react'
import { useDesks } from '../hooks/useDesks'
import CreateDeskModal from './modals/CreateDeskModal'
import CreateColumnModal from './modals/CreateColumnModal'

export function Sidebar({ selectedDesk, onDeskSelect }) {
	const { desks, loading, createDesk, deleteDesk } = useDesks()
	const [showCreateDeskModal, setShowCreateDeskModal] = useState(false)
	const [showCreateColumnModal, setShowCreateColumnModal] = useState(false)
	const [deskNameInput, setDeskNameInput] = useState('')

	const handleCreateDesk = async (name) => {
		try {
			await createDesk(name)
			setShowCreateDeskModal(false)
		} catch (err) {
			console.error('Failed to create desk:', err)
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
			<div className="w-64 bg-gray-900 border-r border-gray-700 h-screen flex flex-col overflow-y-auto">
				{/* Header */}
				<div className="p-4 border-b border-gray-700">
					<h2 className="text-xl font-bold text-white mb-4">🐐 Goatcast</h2>
					<button
						onClick={() => setShowCreateDeskModal(true)}
						className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center justify-center gap-2"
					>
						<span>+</span>
						<span>New Desk</span>
					</button>
				</div>

				{/* Desks List */}
				<div className="flex-1 overflow-y-auto p-4">
					<div className="space-y-2">
						{loading ? (
							<div className="text-gray-400 text-sm text-center py-4">
								Loading desks...
							</div>
						) : desks.length === 0 ? (
							<div className="text-gray-400 text-sm text-center py-4">
								No desks yet. Create one to get started!
							</div>
						) : (
							desks.map((desk) => (
								<div
									key={desk.id}
									className={`rounded-lg overflow-hidden transition-colors duration-200 ${
										selectedDesk?.id === desk.id
											? 'bg-blue-600'
											: 'bg-gray-800 hover:bg-gray-700'
									}`}
								>
									<button
										onClick={() => onDeskSelect(desk)}
										className="w-full text-left px-4 py-3 text-white font-medium flex items-center justify-between group"
									>
										<span className="truncate">{desk.name}</span>
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleDeleteDesk(desk.id)
											}}
											className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200 text-sm"
											title="Delete desk"
										>
											✕
										</button>
									</button>

									{/* Selected Desk Options */}
									{selectedDesk?.id === desk.id && (
										<div className="px-4 py-2 border-t border-blue-500">
											<button
												onClick={() =>
													setShowCreateColumnModal(true)
												}
												className="w-full px-3 py-2 bg-blue-700 text-white font-medium rounded text-sm hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center gap-2"
											>
												<span>+</span>
												<span>New Column</span>
											</button>
										</div>
									)}
								</div>
							))
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="p-4 border-t border-gray-700">
					<p className="text-xs text-gray-500 text-center">
						Organize your Farcaster feeds
					</p>
				</div>
			</div>

			{/* Modals */}
			<CreateDeskModal
				isOpen={showCreateDeskModal}
				onClose={() => setShowCreateDeskModal(false)}
				onCreate={handleCreateDesk}
			/>

			{selectedDesk && (
				<CreateColumnModal
					isOpen={showCreateColumnModal}
					onClose={() => setShowCreateColumnModal(false)}
					deskId={selectedDesk.id}
					deskName={selectedDesk.name}
				/>
			)}
		</>
	)
}

export default Sidebar

