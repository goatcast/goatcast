import { useSignOut } from '@farcaster/auth-kit'
import { sessionStorage } from '../utils/sessionStorage'

export function LogoutButton({ className = '' }) {
	const { signOut } = useSignOut()

	const handleLogout = async () => {
		if (window.confirm('Are you sure you want to logout? You can login again anytime.')) {
			try {
				// Clear local session cache
				sessionStorage.clearSession()
				// Sign out from Farcaster Auth Kit
				await signOut()
			} catch (err) {
				console.error('Error during logout:', err)
			}
		}
	}

	return (
		<button
			onClick={handleLogout}
			className={`px-3 py-1 bg-gray-700 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors duration-200 ${className}`}
			title="Logout and clear session"
		>
			Logout
		</button>
	)
}

export default LogoutButton

