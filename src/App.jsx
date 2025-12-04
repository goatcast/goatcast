import { useState } from 'react'
import { useProfile } from '@farcaster/auth-kit'
import { SignInButton } from '@farcaster/auth-kit'
import '@farcaster/auth-kit/styles.css'
import Feed from './components/Feed'

function App() {
	const [count, setCount] = useState(0)
	const { isLoading, profile } = useProfile()

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
			<div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
						🐐 Goatcast
					</h1>
					<p className="text-xl text-gray-300">
						Built with Vite, React, Tailwind CSS & Farcaster
					</p>
				</div>

				{/* Sign In Section */}
				<div className="bg-gray-800 rounded-lg shadow-2xl p-8 sm:p-12 border border-gray-700 mb-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-white">Welcome</h2>
						<div className="flex items-center gap-4">
							{isLoading ? (
								<span className="text-gray-400">Loading...</span>
							) : profile ? (
								<div className="flex items-center gap-3">
									{profile.pfpUrl && (
										<img
											src={profile.pfpUrl}
											alt={
												profile.displayName || profile.username || 'User avatar'
											}
											className="w-10 h-10 rounded-full"
										/>
									)}
									<span className="text-white font-semibold">
										{profile.displayName || profile.username}
									</span>
								</div>
							) : (
								<span className="text-gray-400">Not signed in</span>
							)}
						</div>
					</div>

					<div className="flex justify-center">
						<SignInButton />
					</div>

					{profile && (
						<div className="mt-6 pt-6 border-t border-gray-700">
							<p className="text-gray-300 mb-3">Signed in as:</p>
							<div className="bg-gray-900 rounded p-4">
								<p className="text-blue-400">
									<strong>Username:</strong> {profile.username}
								</p>
								<p className="text-blue-400">
									<strong>Display Name:</strong> {profile.displayName}
								</p>
								<p className="text-blue-400">
									<strong>FID:</strong> {profile.fid}
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Feed Section - Show when user is logged in */}
				{profile && (
					<div className="bg-gray-800 rounded-lg shadow-2xl p-8 sm:p-12 border border-gray-700 mb-6">
						<Feed />
					</div>
				)}

				{/* Counter Section */}
				<div className="bg-gray-800 rounded-lg shadow-2xl p-8 sm:p-12 border border-gray-700">
					<div className="space-y-6">
						<div>
							<p className="text-gray-300 mb-4">
								Counter:{' '}
								<span className="text-3xl font-bold text-blue-400">
									{count}
								</span>
							</p>
							<button
								onClick={() => setCount((count) => count + 1)}
								className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg"
							>
								Increment Count
							</button>
						</div>

						<div className="border-t border-gray-700 pt-6">
							<p className="text-gray-300">
								Edit{' '}
								<code className="bg-gray-900 text-blue-300 px-2 py-1 rounded">
									src/App.jsx
								</code>{' '}
								and save to test HMR
							</p>
						</div>
					</div>
				</div>

				{/* Footer Info */}
				<div className="mt-12 text-center text-gray-400 text-sm">
					<p>⚡ Vite with Hot Module Replacement enabled</p>
					<p className="mt-2">🎨 Styled with Tailwind CSS</p>
					<p className="mt-2">🔐 Farcaster authentication integrated</p>
				</div>
			</div>
		</div>
	)
}

export default App
