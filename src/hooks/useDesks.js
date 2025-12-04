import { useEffect, useState } from 'react'
import { db, auth } from '../config/firebase'
import {
	collection,
	query,
	where,
	onSnapshot,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	serverTimestamp,
} from 'firebase/firestore'

export function useDesks() {
	const [desks, setDesks] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Fetch desks for current user
	useEffect(() => {
		if (!auth.currentUser) {
			setDesks([])
			setLoading(false)
			return
		}

		const desksRef = collection(db, 'desks')
		const q = query(desksRef, where('userId', '==', auth.currentUser.uid))

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const desksData = []
				snapshot.forEach((doc) => {
					desksData.push({
						id: doc.id,
						...doc.data(),
					})
				})
				setDesks(desksData.sort((a, b) => b.createdAt - a.createdAt))
				setLoading(false)
			},
			(err) => {
				setError(err.message)
				setLoading(false)
			}
		)

		return () => unsubscribe()
	}, [])

	// Create new desk
	const createDesk = async (deskName) => {
		if (!auth.currentUser) {
			throw new Error('User not authenticated')
		}

		try {
			const docRef = await addDoc(collection(db, 'desks'), {
				name: deskName,
				userId: auth.currentUser.uid,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			})
			return docRef.id
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	// Create new column in desk
	const createColumn = async (deskId, columnName) => {
		if (!auth.currentUser) {
			throw new Error('User not authenticated')
		}

		try {
			const docRef = await addDoc(collection(db, 'columns'), {
				deskId,
				name: columnName,
				userId: auth.currentUser.uid,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				position: 0,
			})
			return docRef.id
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	// Update desk name
	const updateDesk = async (deskId, deskName) => {
		try {
			await updateDoc(doc(db, 'desks', deskId), {
				name: deskName,
				updatedAt: serverTimestamp(),
			})
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	// Delete desk
	const deleteDesk = async (deskId) => {
		try {
			await deleteDoc(doc(db, 'desks', deskId))
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	// Get columns for a desk
	const getColumnsForDesk = (deskId) => {
		return desks.find((desk) => desk.id === deskId)?.columns || []
	}

	return {
		desks,
		loading,
		error,
		createDesk,
		createColumn,
		updateDesk,
		deleteDesk,
		getColumnsForDesk,
	}
}

