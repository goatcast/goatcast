import { useState } from 'react'
import { useProfile } from '@farcaster/auth-kit'
import { SignInButton } from '@farcaster/auth-kit'
import '@farcaster/auth-kit/styles.css'
import Sidebar from './components/Sidebar'
import DeskView from './components/DeskView'

function App() {
	const { isLoading, profile } = useProfile()
	const [selectedDesk, setSelectedDesk] = useState(null)

	// Show sign in page if not authenticated
	if (!profile || isLoading) {
		return (
			<div className="min-h-screen bg-goatcast-background flex items-center justify-center p-4">
				<div className="bg-goatcast-highlight rounded-lg shadow-2xl p-8 sm:p-12 border border-goatcast-border max-w-md w-full">
					<div className="text-center mb-8">
						<h1 className="text-5xl font-bold text-goatcast-title mb-4">🐐 Goatcast</h1>
						<p className="text-xl text-goatcast-muted mb-6">
							Organize your Farcaster feeds with custom desks
						</p>
					</div>

					{isLoading ? (
						<div className="flex justify-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-goatcast-darkOrange"></div>
						</div>
					) : (
						<div>
							<p className="text-goatcast-subTitle mb-4 text-center">
								Sign in with your Farcaster account to get started
							</p>
							<div className="flex justify-center">
								<SignInButton />
							</div>
						</div>
					)}
				</div>
			</div>
		)
	}

	// Main app layout with sidebar and desk view
	return (
		<div className="flex h-screen bg-goatcast-background">
			{/* Sidebar */}
			<Sidebar selectedDesk={selectedDesk} onDeskSelect={setSelectedDesk} />

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Top Bar with User Info */}
				<div className="bg-goatcast-highlight border-b border-goatcast-border px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						{profile.pfpUrl && (
							<img
								src={profile.pfpUrl}
								alt={profile.displayName || profile.username || 'User avatar'}
								className="w-10 h-10 rounded-full"
							/>
						)}
						<div>
							<p className="text-goatcast-title font-semibold">
								{profile.displayName || profile.username}
							</p>
							<p className="text-goatcast-muted text-sm">@{profile.username}</p>
						</div>
					</div>
					<SignInButton />
				</div>

				{/* Desk Content Area */}
				<DeskView desk={selectedDesk} />
			</div>
		</div>
	)
}

export default App
