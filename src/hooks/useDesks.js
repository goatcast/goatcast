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
			console.error('Error reading cached session for desks:', error)
		}
		
		return null
	}

	// Fetch desks for current user
	useEffect(() => {
		const userId = getUserId()
		
		if (!userId) {
			setDesks([])
			setLoading(false)
			return
		}

		const desksRef = collection(db, 'desks')
		const q = query(desksRef, where('userId', '==', userId))

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
	}, [profile?.fid]) // Re-run when profile changes, but getUserId will handle cached profile

	// Create new desk
	const createDesk = async (deskName) => {
		const userId = getUserId()
		if (!userId) {
			throw new Error('User not authenticated. Please sign in to create desks.')
		}

		try {
			const docRef = await addDoc(collection(db, 'desks'), {
				name: deskName,
				userId: userId,
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
	const createColumn = async (deskId, columnName, feedType = 'trending_24h') => {
		const userId = getUserId()
		if (!userId) {
			throw new Error('User not authenticated. Please sign in to create columns.')
		}

		try {
			const docRef = await addDoc(collection(db, 'columns'), {
				deskId,
				name: columnName,
				feedType: feedType,
				userId: userId,
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

