import { useMemo } from 'react'

/**
 * Component to render cast text with highlighted and clickable usernames
 * Parses @mentions and makes them clickable
 */
export function CastText({ text, onUsernameClick, className = '' }) {
	const parsedText = useMemo(() => {
		if (!text) return []

		// Regex to match @username mentions
		// Matches @ followed by alphanumeric characters, underscores, and hyphens
		const mentionRegex = /@([a-zA-Z0-9_-]+)/g
		const parts = []
		let lastIndex = 0
		let match

		while ((match = mentionRegex.exec(text)) !== null) {
			// Add text before the mention
			if (match.index > lastIndex) {
				parts.push({
					type: 'text',
					content: text.slice(lastIndex, match.index),
				})
			}

			// Add the mention
			parts.push({
				type: 'mention',
				content: match[0], // Full match including @
				username: match[1], // Username without @
			})

			lastIndex = match.index + match[0].length
		}

		// Add remaining text after last mention
		if (lastIndex < text.length) {
			parts.push({
				type: 'text',
				content: text.slice(lastIndex),
			})
		}

		// If no mentions found, return original text
		if (parts.length === 0) {
			return [{ type: 'text', content: text }]
		}

		return parts
	}, [text])

	if (!text) return null

	return (
		<span className={className}>
			{parsedText.map((part, index) => {
				if (part.type === 'mention') {
					return (
						<button
							key={index}
							onClick={(e) => {
								e.stopPropagation()
								if (onUsernameClick) {
									onUsernameClick(part.username)
								}
							}}
							className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium transition-colors"
						>
							{part.content}
						</button>
					)
				}
				return <span key={index}>{part.content}</span>
			})}
		</span>
	)
}

export default CastText
