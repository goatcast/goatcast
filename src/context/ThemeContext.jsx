import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		// Check localStorage for saved theme preference
		const saved = localStorage.getItem('goatcast-theme')
		if (saved) {
			return saved
		}

		// Check system preference
		if (typeof window !== 'undefined') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
		}

		return 'dark'
	})

	// Update localStorage and document when theme changes
	useEffect(() => {
		localStorage.setItem('goatcast-theme', theme)

		// Update HTML element class for Tailwind dark mode
		if (theme === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [theme])

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
	}

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider')
	}
	return context
}

