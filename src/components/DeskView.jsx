import { useState } from 'react'
import { useColumns } from '../hooks/useColumns'
import Feed from './Feed'
import CreateColumnModal from './modals/CreateColumnModal'

export function DeskView({ desk }) {
	const { columns, loading, error, deleteColumn } = useColumns(desk?.id)
	const [showCreateColumnModal, setShowCreateColumnModal] = useState(false)

	if (!desk) {
		return (
			<div className="flex-1 flex items-center justify-center bg-black">
				<div className="text-center">
					<p className="text-neutral-400 text-lg">
						Select a desk from the sidebar to get started
					</p>
				</div>
			</div>
		)
	}

	if (loading) {
		return (
			<div className="flex-1 flex items-center justify-center bg-black">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		)
	}

	return (
		<div className="flex-1 bg-black flex flex-col h-full overflow-hidden">
			{/* Error Message */}
			{error && (
				<div className="px-6 py-4 shrink-0">
					<div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
						{error}
					</div>
				</div>
			)}

			{/* Columns Horizontal Scroll */}
			<div className="flex-1 overflow-x-auto overflow-y-hidden">
				<div className="flex gap-6 h-full">
					{columns.map((column) => (
						<div
							key={column.id}
							className="bg-neutral-900 border border-neutral-800 shadow-lg overflow-hidden flex flex-col h-full min-w-[350px] max-w-[350px]"
						>
							{/* Column Header */}
							<div className="bg-neutral-800 px-4 py-3 border-b border-neutral-700 flex items-center justify-between shrink-0">
								<h2 className="font-bold text-white">{column.name}</h2>
								<button
									onClick={() => {
										if (window.confirm(`Delete "${column.name}" column?`)) {
											deleteColumn(column.id)
										}
									}}
									className="text-neutral-400 hover:text-red-400 transition-colors text-sm"
									title="Delete column"
								>
									✕
								</button>
							</div>

							{/* Column Content */}
							<div className="flex-1 overflow-y-auto">
								<Feed feedType={column.feedType || 'trending_24h'} />
							</div>
						</div>
					))}

					{/* Add Column Button */}
					<div className="flex items-center shrink-0">
						<button
							onClick={() => setShowCreateColumnModal(true)}
							className="flex flex-col items-center justify-center gap-2 w-[200px] h-full px-4 py-8 hover:opacity-70 transition-opacity duration-200"
						>
							<span className="text-4xl text-neutral-400">+</span>
							<span className="text-white font-semibold text-sm">
								Add Column
							</span>
						</button>
					</div>
				</div>
			</div>

			{/* Create Column Modal */}
			{desk && (
				<CreateColumnModal
					isOpen={showCreateColumnModal}
					onClose={() => setShowCreateColumnModal(false)}
					deskId={desk.id}
					deskName={desk.name}
				/>
			)}
		</div>
	)
}

export default DeskView
