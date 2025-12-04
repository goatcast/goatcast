/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx}'],
	theme: {
		extend: {
			colors: {
				// Color sets from Goatcast iOS app
				goatcast: {
					// Background colors - Dark on default, Light on light mode
					background: '#121212', // Dark: #121212, Light: #FAFAFA
					// Base colors - Black on default, White on light mode
					base: '#000000', // Dark: #000000, Light: #FFFFFF
					// Base reverse - Black on default, White on light mode
					baseReverse: '#000000', // Dark: #000000, Light: #FFFFFF
					// Border color - #1E1E1E dark/light
					border: '#1E1E1E', // Dark: #1E1E1E, Light: #F3F3F3
					// Dark Orange accent
					darkOrange: '#FF4F00',
					// Dark Purple accent
					darkPurple: '#4D08A4',
					// Highlight - Light gray on default, light beige on light
					highlight: '#242424', // Dark: #242424, Light: #EEF0F4
					// Hover state - Very dark on default, off-white on light
					hover: '#090909', // Dark: #090909, Light: #FBFBFB
					// Light Orange accent
					lightOrange: '#F97316',
					// Muted text - Gray shades
					muted: '#727272', // Dark: #727272, Light: #848484
					// Sub-title text color
					subTitle: '#ACACAC', // Dark: #ACACAC, Light: #4B4744 (dark appearance in light mode)
					// Title text - White on default, dark on light
					title: '#FFFFFF', // Dark: #FFFFFF, Light: #0F1414
				},
			},
		},
	},
}
