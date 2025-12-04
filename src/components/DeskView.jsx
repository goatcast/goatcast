import { useColumns } from '../hooks/useColumns'
import Feed from './Feed'

export function DeskView({ desk }) {
	const { columns, loading, error, deleteColumn } = useColumns(desk?.id)

	if (!desk) {
		return (
			<div className="flex-1 flex items-center justify-center bg-goatcast-background">
				<div className="text-center">
					<p className="text-goatcast-muted text-lg">
						Select a desk from the sidebar to get started
					</p>
				</div>
			</div>
		)
	}

	if (loading) {
		return (
			<div className="flex-1 flex items-center justify-center bg-goatcast-background">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-goatcast-darkOrange"></div>
			</div>
		)
	}

	return (
		<div className="flex-1 bg-goatcast-background overflow-y-auto">
			<div className="max-w-full px-6 py-6">
				{/* Desk Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-goatcast-title mb-2">
						📋 {desk.name}
					</h1>
					<p className="text-goatcast-muted">
						{columns.length}{' '}
						{columns.length === 1 ? 'column' : 'columns'}
					</p>
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-goatcast-darkOrange bg-opacity-20 border border-goatcast-darkOrange text-goatcast-darkOrange px-4 py-3 rounded-lg mb-6">
						{error}
					</div>
				)}

				{/* Columns Grid */}
				{columns.length === 0 ? (
					<div className="bg-goatcast-highlight border border-goatcast-border rounded-lg p-12 text-center">
						<p className="text-goatcast-muted mb-4">
							No columns yet. Create one from the sidebar!
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
						{columns.map((column) => (
							<div
								key={column.id}
								className="bg-goatcast-highlight border border-goatcast-border rounded-lg shadow-lg overflow-hidden flex flex-col h-full max-h-[600px]"
							>
								{/* Column Header */}
								<div className="bg-goatcast-hover px-4 py-3 border-b border-goatcast-border flex items-center justify-between">
									<h2 className="font-bold text-goatcast-title">
										{column.name}
									</h2>
									<button
										onClick={() => {
											if (
												window.confirm(
													`Delete "${column.name}" column?`
												)
											) {
												deleteColumn(column.id)
											}
										}}
										className="text-goatcast-muted hover:text-goatcast-darkOrange transition-colors text-sm"
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
				)}
			</div>
		</div>
	)
}

export default DeskView

