/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx}'],
	darkMode: 'class', // Enable class-based dark mode
	theme: {
		extend: {
			colors: {
				// Color sets from Goatcast iOS app with CSS variables
				// Uses CSS variables that change based on theme
				goatcast: {
					background: 'var(--goatcast-background)',
					base: 'var(--goatcast-base)',
					baseReverse: 'var(--goatcast-base-reverse)',
					border: 'var(--goatcast-border)',
					highlight: 'var(--goatcast-highlight)',
					hover: 'var(--goatcast-hover)',
					muted: 'var(--goatcast-muted)',
					subTitle: 'var(--goatcast-sub-title)',
					title: 'var(--goatcast-title)',
					// Accent colors (same in both modes)
					darkOrange: 'var(--goatcast-dark-orange)',
					darkPurple: 'var(--goatcast-dark-purple)',
					lightOrange: 'var(--goatcast-light-orange)',
				},
			},
		},
	},
}
