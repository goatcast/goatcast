import { useState, useEffect } from 'react'
import { useProfile } from '@farcaster/auth-kit'
import { SignInButton } from '@farcaster/auth-kit'
import '@farcaster/auth-kit/styles.css'
import Sidebar from './components/Sidebar'
import DeskView from './components/DeskView'
import { useUserStorage } from './hooks/useUserStorage'
import { useFarcasterSession } from './hooks/useFarcasterSession'

function App() {
	const { isLoading, profile } = useProfile()
	const { isRestoringSession } = useFarcasterSession() // Handles session persistence
	useUserStorage() // This saves user data to Firebase on login
	const [selectedDesk, setSelectedDesk] = useState(null)
	const [savedSession, setSavedSession] = useState(null)

	// Load saved session data from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem('farcaster-session-data')
		if (saved) {
			try {
				setSavedSession(JSON.parse(saved))
			} catch (error) {
				console.error('Error loading saved session:', error)
			}
		}
	}, [])

	// Show loading screen if auth is still being determined
	if (isLoading || isRestoringSession) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
				<div className="bg-gray-800 rounded-lg shadow-2xl p-8 sm:p-12 border border-gray-700 max-w-md w-full">
					<div className="text-center mb-8">
						<h1 className="text-5xl font-bold text-white mb-4">🐐 Goatcast</h1>
					</div>
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					</div>
					<p className="text-gray-400 text-center mt-6 text-sm">Loading your session...</p>
				</div>
			</div>
		)
	}

	// Show sign in page if not authenticated
	if (!profile) {
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
							{/* Show welcome back message if we have a saved session */}
							{savedSession && (
								<div className="bg-blue-900 border border-blue-700 text-blue-100 px-4 py-3 rounded-lg mb-4 text-center">
									<p className="text-sm font-semibold">Welcome back! 👋</p>
									<p className="text-xs text-blue-200 mt-1">@{savedSession.username}</p>
								</div>
							)}
							
							<p className="text-gray-400 mb-4 text-center">
								{savedSession ? 'Sign in to continue' : 'Sign in with your Farcaster account to get started'}
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
