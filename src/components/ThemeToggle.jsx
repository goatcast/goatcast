import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme()

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-lg bg-goatcast-highlight hover:bg-goatcast-border transition-colors duration-200"
			title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
			aria-label="Toggle theme"
		>
			{theme === 'dark' ? (
				<span className="text-xl">☀️</span>
			) : (
				<span className="text-xl">🌙</span>
			)}
		</button>
	)
}

export default ThemeToggle

