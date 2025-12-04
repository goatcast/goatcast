/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx}'],
	darkMode: 'class', // Enable class-based dark mode
	theme: {
		extend: {
			colors: {
				// Color sets from Goatcast iOS app
				// Dark mode (default/no modifier)
				// Light mode (with 'light:' prefix)
				goatcast: {
					// Background
					background: {
						DEFAULT: '#121212', // Dark mode
						light: '#FAFAFA', // Light mode
					},
					// Base text/content
					base: {
						DEFAULT: '#000000', // Dark mode
						light: '#FFFFFF', // Light mode
					},
					// Base reverse
					baseReverse: {
						DEFAULT: '#000000', // Dark mode
						light: '#FFFFFF', // Light mode
					},
					// Borders
					border: {
						DEFAULT: '#1E1E1E', // Dark mode
						light: '#F3F3F3', // Light mode
					},
					// Highlight/Emphasized elements
					highlight: {
						DEFAULT: '#242424', // Dark mode
						light: '#EEF0F4', // Light mode
					},
					// Hover states
					hover: {
						DEFAULT: '#090909', // Dark mode
						light: '#FBFBFB', // Light mode
					},
					// Muted text
					muted: {
						DEFAULT: '#727272', // Dark mode
						light: '#848484', // Light mode
					},
					// Subtitle text
					subTitle: {
						DEFAULT: '#ACACAC', // Dark mode
						light: '#4B4744', // Light mode (darker in light mode)
					},
					// Title text
					title: {
						DEFAULT: '#FFFFFF', // Dark mode
						light: '#0F1414', // Light mode
					},
					// Accent colors (same in both modes)
					darkOrange: '#FF4F00',
					darkPurple: '#4D08A4',
					lightOrange: '#F97316',
				},
			},
		},
	},
}
