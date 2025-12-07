import { useEffect, useState } from 'react'
import { useProfile } from '@farcaster/auth-kit'
import { db } from '../config/firebase'
import {
	collection,
	query,
	where,
	onSnapshot,
	updateDoc,
	deleteDoc,
	doc,
	serverTimestamp,
	orderBy,
} from 'firebase/firestore'

export function useColumns(deskId) {
	const { profile } = useProfile()
	const [columns, setColumns] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [cachedUserId, setCachedUserId] = useState(null)

	// Get user FID from profile or cached session
	const getUserId = () => {
		// First try to use the actual profile
		if (profile?.fid) {
			return profile.fid.toString()
		}
		
		// If profile is not available, try to get from cached session
		try {
			const savedSession = localStorage.getItem('farcaster-session-data')
			if (savedSession) {
				const sessionData = JSON.parse(savedSession)
				if (sessionData.fid) {
					return sessionData.fid.toString()
				}
			}
		} catch (error) {
			console.error('Error reading cached session for columns:', error)
		}
		
		return null
	}

	// Update cachedUserId when profile or localStorage changes
	useEffect(() => {
		const userId = getUserId()
		if (userId && userId !== cachedUserId) {
			setCachedUserId(userId)
		} else if (!userId && cachedUserId) {
			// Clear cachedUserId if no userId is available
			setCachedUserId(null)
		}
	}, [profile?.fid])

	// Check for cached profile on mount
	useEffect(() => {
		if (!profile?.fid) {
			try {
				const savedSession = localStorage.getItem('farcaster-session-data')
				if (savedSession) {
					const sessionData = JSON.parse(savedSession)
					if (sessionData.fid && !cachedUserId) {
						const userId = sessionData.fid.toString()
						setCachedUserId(userId)
					}
				}
			} catch (error) {
				console.error('Error reading cached session on mount:', error)
			}
		}
	}, []) // Only run on mount

	// Fetch columns for specific desk
	useEffect(() => {
		const userId = getUserId()
		
		if (!deskId) {
			setColumns([])
			setLoading(false)
			return
		}
		
		if (!userId) {
			setColumns([])
			setLoading(false)
			return
		}

		const columnsRef = collection(db, 'columns')
		// Query by deskId first, then filter by userId in JavaScript
		// This avoids needing a composite index
		const q = query(
			columnsRef,
			where('deskId', '==', deskId)
		)

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const columnsData = []
				snapshot.forEach((doc) => {
					const data = doc.data()
					// Only include columns for current user
					if (data.userId === userId) {
						columnsData.push({
							id: doc.id,
							...data,
						})
					}
				})
				// Sort by position
				columnsData.sort((a, b) => (a.position || 0) - (b.position || 0))
				setColumns(columnsData)
				setLoading(false)
			},
			(err) => {
				console.error('Error fetching columns:', err)
				setError(err.message)
				setLoading(false)
			}
		)

		return () => unsubscribe()
	}, [deskId, profile?.fid, cachedUserId]) // Re-run when profile or cachedUserId changes

	// Update column
	const updateColumn = async (columnId, data) => {
		try {
			await updateDoc(doc(db, 'columns', columnId), {
				...data,
				updatedAt: serverTimestamp(),
			})
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	// Delete column
	const deleteColumn = async (columnId) => {
		try {
			await deleteDoc(doc(db, 'columns', columnId))
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	return {
		columns,
		loading,
		error,
		updateColumn,
		deleteColumn,
	}
}

