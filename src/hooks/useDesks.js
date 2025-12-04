import { useEffect, useState } from 'react'
import { useProfile } from '@farcaster/auth-kit'
import { db } from '../config/firebase'
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
	const { profile } = useProfile()
	const [desks, setDesks] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Fetch desks for current user
	useEffect(() => {
		if (!profile?.fid) {
			setDesks([])
			setLoading(false)
			return
		}

		const desksRef = collection(db, 'desks')
		const q = query(desksRef, where('userId', '==', profile.fid.toString()))

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
				setDesks(desksData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
				setLoading(false)
			},
			(err) => {
				console.error('Error fetching desks:', err)
				setError(err.message)
				setLoading(false)
			}
		)

		return () => unsubscribe()
	}, [profile?.fid])

	// Create new desk
	const createDesk = async (deskName) => {
		if (!profile?.fid) {
			throw new Error('User not authenticated')
		}

		try {
			const docRef = await addDoc(collection(db, 'desks'), {
				name: deskName,
				userId: profile.fid.toString(),
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			})
			return docRef.id
		} catch (err) {
			console.error('Error creating desk:', err)
			setError(err.message)
			throw err
		}
	}

	// Create new column in desk
	const createColumn = async (deskId, columnName) => {
		if (!profile?.fid) {
			throw new Error('User not authenticated')
		}

		try {
			const docRef = await addDoc(collection(db, 'columns'), {
				deskId,
				name: columnName,
				userId: profile.fid.toString(),
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				position: 0,
			})
			return docRef.id
		} catch (err) {
			console.error('Error creating column:', err)
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

