import { useState, useEffect } from 'react'
import { formatRelativeTime } from '../utils/timeUtils'

export function TimeAgo({ timestamp }) {
	const [timeString, setTimeString] = useState(() => formatRelativeTime(timestamp))

	useEffect(() => {
		if (!timestamp) return

		// Update immediately
		setTimeString(formatRelativeTime(timestamp))

		// Calculate time difference to determine update interval
		const now = new Date()
		const date = new Date(timestamp)
		const diffInSeconds = Math.floor((now - date) / 1000)

		let interval = null

		// For very recent posts (< 1 hour), update every minute
		if (diffInSeconds < 3600) {
			interval = setInterval(() => {
				setTimeString(formatRelativeTime(timestamp))
			}, 60000) // Update every minute
		}
		// For posts less than 24 hours old, update every 5 minutes
		else if (diffInSeconds < 86400) {
			interval = setInterval(() => {
				setTimeString(formatRelativeTime(timestamp))
			}, 300000) // Update every 5 minutes
		}
		// For older posts, update every hour
		else {
			interval = setInterval(() => {
				setTimeString(formatRelativeTime(timestamp))
			}, 3600000) // Update every hour
		}

		return () => {
			if (interval) {
				clearInterval(interval)
			}
		}
	}, [timestamp])

	return <span>{timeString}</span>
}


