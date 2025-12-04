import { useState } from 'react'
import { useProfile } from '@farcaster/auth-kit'
import { SignInButton } from '@farcaster/auth-kit'
import '@farcaster/auth-kit/styles.css'
import Sidebar from './components/Sidebar'
import DeskView from './components/DeskView'
import { useUserStorage } from './hooks/useUserStorage'

function App() {
	const { isLoading, profile } = useProfile()
	useUserStorage() // This saves user data to Firebase on login
	const [selectedDesk, setSelectedDesk] = useState(null)

	// Show sign in page if not authenticated
	if (!profile || isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
				<div className="bg-gray-800 rounded-lg shadow-2xl p-8 sm:p-12 border border-gray-700 max-w-md w-full">
					<div className="text-center mb-8">
						<h1 className="text-5xl font-bold text-white mb-4">🐐 Goatcast</h1>
						<p className="text-xl text-gray-300 mb-6">
							Organize your Farcaster feeds with custom desks
						</p>
					</div>

					{isLoading ? (
						<div className="flex justify-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
						</div>
					) : (
						<div>
							<p className="text-gray-400 mb-4 text-center">
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
		<div className="flex h-screen bg-gray-900">
			{/* Sidebar */}
			<Sidebar selectedDesk={selectedDesk} onDeskSelect={setSelectedDesk} />

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Top Bar with User Info */}
				<div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						{profile.pfpUrl && (
							<img
								src={profile.pfpUrl}
								alt={profile.displayName || profile.username || 'User avatar'}
								className="w-10 h-10 rounded-full"
							/>
						)}
						<div>
							<p className="text-white font-semibold">
								{profile.displayName || profile.username}
							</p>
							<p className="text-gray-400 text-sm">@{profile.username}</p>
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
