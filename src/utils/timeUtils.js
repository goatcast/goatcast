/**
 * Formats a timestamp to relative time like Twitter
 * Examples: "2h", "3m", "1d", "Just now", "Jan 15"
 */
export function formatRelativeTime(timestamp) {
	if (!timestamp) return ''

	const now = new Date()
	const date = new Date(timestamp)
	const diffInSeconds = Math.floor((now - date) / 1000)

	// Less than 1 minute
	if (diffInSeconds < 60) {
		return 'Just now'
	}

	// Less than 1 hour
	const diffInMinutes = Math.floor(diffInSeconds / 60)
	if (diffInMinutes < 60) {
		return `${diffInMinutes}m`
	}

	// Less than 24 hours
	const diffInHours = Math.floor(diffInMinutes / 60)
	if (diffInHours < 24) {
		return `${diffInHours}h`
	}

	// Less than 7 days
	const diffInDays = Math.floor(diffInHours / 24)
	if (diffInDays < 7) {
		return `${diffInDays}d`
	}

	// Less than 1 year - show month and day
	const diffInMonths = Math.floor(diffInDays / 30)
	if (diffInMonths < 12) {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		})
	}

	// Older than 1 year - show month, day, and year
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
	})
}

