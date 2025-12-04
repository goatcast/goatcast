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

	// Fetch columns for specific desk
	useEffect(() => {
		if (!deskId || !profile?.fid) {
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
					if (data.userId === profile.fid.toString()) {
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
	}, [deskId, profile?.fid])

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

