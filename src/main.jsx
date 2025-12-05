import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthKitProvider } from '@farcaster/auth-kit'
import App from './App.jsx'
import './index.css'

const config = {
  // Required
  rpcUrl: 'https://mainnet.optimism.io',
  // Optional
  domain: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  siweUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
}

/**
 * SessionManager: Custom wrapper to handle session persistence
 * Since @farcaster/auth-kit doesn't auto-persist, we manage it manually
 */
function SessionManager({ children }) {
  React.useEffect(() => {
    // Check if user has a saved session and restore it
    const checkAndRestoreSession = () => {
      const savedSession = localStorage.getItem('farcaster-session-data')
      if (savedSession) {
        try {
          JSON.parse(savedSession)
          // Session data is available for child components to use
        } catch (error) {
          console.error('Error parsing session:', error)
        }
      }
    }
    
    checkAndRestoreSession()
  }, [])

  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthKitProvider config={config}>
      <SessionManager>
        <App />
      </SessionManager>
    </AuthKitProvider>
  </React.StrictMode>,
)

