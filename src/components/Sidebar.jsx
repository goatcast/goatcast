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
			console.log('Sidebar: Creating desk with name:', name)
			const deskId = await createDesk(name)
			console.log('Sidebar: Desk created with ID:', deskId)
		} catch (err) {
			console.error('Sidebar: Failed to create desk:', err)
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
			<div className="w-64 bg-goatcast-background border-r border-goatcast-border h-screen flex flex-col overflow-y-auto">
				{/* Header */}
				<div className="p-4 border-b border-goatcast-border">
					<h2 className="text-xl font-bold text-goatcast-title mb-4">🐐 Goatcast</h2>
					<button
						onClick={() => setShowCreateDeskModal(true)}
						className="w-full px-4 py-2 bg-goatcast-darkOrange text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 text-sm flex items-center justify-center gap-2"
					>
						<span>+</span>
						<span>New Desk</span>
					</button>
				</div>

				{/* Desks List */}
				<div className="flex-1 overflow-y-auto p-4">
					<div className="space-y-2">
						{loading ? (
							<div className="text-goatcast-muted text-sm text-center py-4">
								Loading desks...
							</div>
						) : desks.length === 0 ? (
							<div className="text-goatcast-muted text-sm text-center py-4">
								No desks yet. Create one to get started!
							</div>
						) : (
							desks.map((desk) => (
								<div
									key={desk.id}
									className={`rounded-lg overflow-hidden transition-colors duration-200 ${
										selectedDesk?.id === desk.id
											? 'bg-goatcast-darkOrange'
											: 'bg-goatcast-highlight hover:bg-goatcast-hover'
									}`}
								>
									<button
										onClick={() => onDeskSelect(desk)}
										className="w-full text-left px-4 py-3 text-goatcast-title font-medium flex items-center justify-between group"
									>
										<span className="truncate">{desk.name}</span>
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleDeleteDesk(desk.id)
											}}
											className="opacity-0 group-hover:opacity-100 text-goatcast-muted hover:text-goatcast-lightOrange transition-all duration-200 text-sm"
											title="Delete desk"
										>
											✕
										</button>
									</button>

									{/* Selected Desk Options */}
									{selectedDesk?.id === desk.id && (
										<div className="px-4 py-2 border-t border-goatcast-darkOrange">
											<button
												onClick={() =>
													setShowCreateColumnModal(true)
												}
												className="w-full px-3 py-2 bg-goatcast-lightOrange text-white font-medium rounded text-sm hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2"
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
				<div className="p-4 border-t border-goatcast-border">
					<p className="text-xs text-goatcast-muted text-center">
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

