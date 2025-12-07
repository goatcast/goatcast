import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		// Check localStorage first, then default to 'dark'
		const savedTheme = localStorage.getItem('theme')
		const initialTheme = savedTheme || 'dark'

		// Apply theme immediately to prevent flash
		const root = document.documentElement
		if (initialTheme === 'light') {
			root.classList.remove('dark')
		} else {
			root.classList.add('dark')
		}

		return initialTheme
	})

	useEffect(() => {
		// Apply theme to document root
		const root = document.documentElement
		if (theme === 'light') {
			root.classList.remove('dark')
		} else {
			root.classList.add('dark')
		}
		// Save to localStorage
		localStorage.setItem('theme', theme)
	}, [theme])

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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

