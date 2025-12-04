import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
            🐐 Goatcast
          </h1>
          <p className="text-xl text-gray-300">
            Built with Vite, React, and Tailwind CSS
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 sm:p-12 border border-gray-700">
          <div className="space-y-6">
            <div>
              <p className="text-gray-300 mb-4">
                Counter: <span className="text-3xl font-bold text-blue-400">{count}</span>
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
                Edit <code className="bg-gray-900 text-blue-300 px-2 py-1 rounded">src/App.jsx</code> and save to test HMR
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>⚡ Vite with Hot Module Replacement enabled</p>
          <p className="mt-2">🎨 Styled with Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

export default App

