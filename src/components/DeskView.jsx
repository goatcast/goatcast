import { useColumns } from '../hooks/useColumns'
import Feed from './Feed'

export function DeskView({ desk }) {
	const { columns, loading, error, deleteColumn } = useColumns(desk?.id)

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
			{/* Desk Header */}
			<div className="px-6 py-4 border-b border-neutral-800 shrink-0">
				<h1 className="text-4xl font-bold text-white mb-2">📋 {desk.name}</h1>
				<p className="text-neutral-400">
					{columns.length} {columns.length === 1 ? 'column' : 'columns'}
				</p>
			</div>

			{/* Error Message */}
			{error && (
				<div className="px-6 py-4 shrink-0">
					<div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
						{error}
					</div>
				</div>
			)}

			{/* Columns Horizontal Scroll */}
			{columns.length === 0 ? (
				<div className="flex-1 flex items-center justify-center px-6">
					<div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
						<p className="text-neutral-400 mb-4">
							No columns yet. Create one from the sidebar!
						</p>
					</div>
				</div>
			) : (
				<div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-6">
					<div className="flex gap-6 h-full">
						{columns.map((column) => (
							<div
								key={column.id}
								className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full min-w-[350px] max-w-[350px]"
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
								<div className="flex-1 overflow-y-auto p-4">
									<Feed />
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default DeskView
