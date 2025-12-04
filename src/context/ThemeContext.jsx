import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		// Check localStorage for saved theme preference
		try {
			const saved = localStorage.getItem('goatcast-theme')
			if (saved === 'light' || saved === 'dark') {
				return saved
			}
		} catch (e) {
			// localStorage not available
		}

		// Check system preference
		if (typeof window !== 'undefined') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			return prefersDark ? 'dark' : 'light'
		}

		return 'dark'
	})

	// Update localStorage and document when theme changes
	useEffect(() => {
		try {
			localStorage.setItem('goatcast-theme', theme)
		} catch (e) {
			// localStorage not available
			console.warn('localStorage not available for theme persistence')
		}

		// Update HTML element class for Tailwind dark mode
		console.log('Applying theme:', theme)
		const html = document.documentElement
		
		if (theme === 'dark') {
			html.classList.add('dark')
			html.classList.remove('light')
		} else {
			html.classList.remove('dark')
			html.classList.add('light')
		}

		// Force a re-render to update CSS variables
		html.style.transition = 'background-color 300ms ease-in-out'
	}, [theme])

	const toggleTheme = () => {
		console.log('Toggling theme')
		setTheme((prev) => {
			const newTheme = prev === 'dark' ? 'light' : 'dark'
			console.log('New theme:', newTheme)
			return newTheme
		})
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

