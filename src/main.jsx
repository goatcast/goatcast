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
  // Enable session persistence - stores auth token in localStorage
  // This allows users to stay logged in after page reload
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthKitProvider config={config}>
      <App />
    </AuthKitProvider>
  </React.StrictMode>,
)

