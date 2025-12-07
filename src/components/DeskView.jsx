import { useState } from 'react'
import { useColumns } from '../hooks/useColumns'
import Feed from './Feed'
import AddColumnPanel from './AddColumnPanel'

export function DeskView({ desk }) {
	const { columns, loading, error, deleteColumn } = useColumns(desk?.id)
	const [showAddColumnPanel, setShowAddColumnPanel] = useState(false)

	if (!desk) {
		return (
			<div className="flex-1 flex items-center justify-center bg-white dark:bg-black">
				<div className="text-center">
					<p className="text-gray-600 dark:text-neutral-400 text-lg">
						Select a desk from the sidebar to get started
					</p>
				</div>
			</div>
		)
	}

	if (loading) {
		return (
			<div className="flex-1 flex items-center justify-center bg-white dark:bg-black">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		)
	}

	return (
		<div className="flex-1 bg-white dark:bg-black flex flex-col h-full overflow-hidden">
			{/* Error Message */}
			{error && (
				<div className="px-6 py-4 shrink-0">
					<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-900 dark:text-red-200 px-4 py-3 rounded-lg">
						{error}
					</div>
				</div>
			)}

			{/* Columns Horizontal Scroll */}
			<div className="flex-1 overflow-x-auto overflow-y-hidden">
				<div className="flex gap-2 h-full">
					{columns.map((column) => (
						<div
							key={column.id}
							className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-lg overflow-hidden flex flex-col h-full min-w-[350px] max-w-[350px]"
						>
							{/* Column Header */}
							<div className="bg-gray-50 dark:bg-neutral-800 px-4 py-3 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between shrink-0">
								<h2 className="font-bold text-gray-900 dark:text-white">{column.name}</h2>
								<button
									onClick={() => {
										if (window.confirm(`Delete "${column.name}" column?`)) {
											deleteColumn(column.id)
										}
									}}
									className="text-gray-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm"
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
					{!showAddColumnPanel && (
						<div className="flex items-center shrink-0">
							<button
								onClick={() => setShowAddColumnPanel(true)}
								className="flex flex-col items-center justify-center gap-2 w-[200px] h-full px-4 py-8 hover:opacity-70 transition-opacity duration-200"
							>
								<span className="text-4xl text-gray-400 dark:text-neutral-400">+</span>
								<span className="text-gray-900 dark:text-white font-semibold text-sm">
									Add Column
								</span>
							</button>
						</div>
					)}

					{/* Add Column Panel - Right Side Toggle */}
					{desk && showAddColumnPanel && (
						<AddColumnPanel
							onClose={() => setShowAddColumnPanel(false)}
							deskId={desk.id}
							deskName={desk.name}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default DeskView
