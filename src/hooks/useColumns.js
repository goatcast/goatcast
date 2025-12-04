import { useEffect, useState } from 'react'
import { db, auth } from '../config/firebase'
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
	const [columns, setColumns] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Fetch columns for specific desk
	useEffect(() => {
		if (!deskId || !auth.currentUser) {
			setColumns([])
			setLoading(false)
			return
		}

		const columnsRef = collection(db, 'columns')
		const q = query(
			columnsRef,
			where('deskId', '==', deskId),
			where('userId', '==', auth.currentUser.uid),
			orderBy('position', 'asc')
		)

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const columnsData = []
				snapshot.forEach((doc) => {
					columnsData.push({
						id: doc.id,
						...doc.data(),
					})
				})
				setColumns(columnsData)
				setLoading(false)
			},
			(err) => {
				setError(err.message)
				setLoading(false)
			}
		)

		return () => unsubscribe()
	}, [deskId])

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

