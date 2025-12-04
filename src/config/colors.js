/**
 * Color palette from Goatcast iOS app
 * Converted from iOS color sets to web-friendly formats
 * 
 * Colors support both light and dark modes
 * 
 * Usage in components:
 * - Import { colors, getColor } from './config/colors'
 * - Use getColor('colorName', 'dark' | 'light') to get colors
 * - Or use Tailwind classes: bg-goatcast-*, text-goatcast-*
 */

export const colors = {
	// Background - Dark background on dark mode, light background on light mode
	background: {
		dark: '#121212',
		light: '#FAFAFA',
	},

	// Base text color - Black on dark mode, White on light mode
	base: {
		dark: '#000000',
		light: '#FFFFFF',
	},

	// Base reverse - opposite of base
	baseReverse: {
		dark: '#000000',
		light: '#FFFFFF',
	},

	// Border color
	border: {
		dark: '#1E1E1E',
		light: '#F3F3F3',
	},

	// Primary accent - Dark Orange
	darkOrange: '#FF4F00',

	// Secondary accent - Dark Purple
	darkPurple: '#4D08A4',

	// Highlight state color
	highlight: {
		dark: '#242424',
		light: '#EEF0F4',
	},

	// Hover state color
	hover: {
		dark: '#090909',
		light: '#FBFBFB',
	},

	// Tertiary accent - Light Orange
	lightOrange: '#F97316',

	// Muted text color (for secondary text)
	muted: {
		dark: '#727272',
		light: '#848484',
	},

	// Subtitle text color
	subTitle: {
		dark: '#ACACAC',
		light: '#4B4744', // Appears darker on light mode
	},

	// Title text color - White on dark, dark on light
	title: {
		dark: '#FFFFFF',
		light: '#0F1414',
	},
}

/**
 * Get color for current theme
 * @param {string} colorName - The color name from the palette
 * @param {string} theme - 'light' or 'dark' (default: 'dark')
 * @returns {string} The hex color value
 */
export const getColor = (colorName, theme = 'dark') => {
	const color = colors[colorName]
	if (!color) {
		console.warn(`Color "${colorName}" not found in palette`)
		return '#000000'
	}

	// If color is a string (like accents), return it directly
	if (typeof color === 'string') {
		return color
	}

	// If color is an object with theme variants, return the appropriate one
	return color[theme] || color.dark
}

/**
 * Get CSS variables for colors
 * Useful for CSS-in-JS or dynamic styling
 */
export const getCSSVariables = (theme = 'dark') => {
	return {
		'--goatcast-background': getColor('background', theme),
		'--goatcast-base': getColor('base', theme),
		'--goatcast-base-reverse': getColor('baseReverse', theme),
		'--goatcast-border': getColor('border', theme),
		'--goatcast-dark-orange': getColor('darkOrange', theme),
		'--goatcast-dark-purple': getColor('darkPurple', theme),
		'--goatcast-highlight': getColor('highlight', theme),
		'--goatcast-hover': getColor('hover', theme),
		'--goatcast-light-orange': getColor('lightOrange', theme),
		'--goatcast-muted': getColor('muted', theme),
		'--goatcast-sub-title': getColor('subTitle', theme),
		'--goatcast-title': getColor('title', theme),
	}
}

export default colors

