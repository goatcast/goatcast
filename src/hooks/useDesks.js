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
		console.log('[useDesks] Effect running, profile?.fid:', profile?.fid)
		
		// Check Firebase configuration
		if (!db) {
			console.error('[useDesks] Firebase db is not initialized!')
			setError('Firebase is not configured. Please check your environment variables.')
			setLoading(false)
			return
		}
		
		// Check if using demo/default config
		const projectId = db.app.options.projectId
		if (projectId === 'demo-project' || !projectId) {
			console.warn('[useDesks] Using demo Firebase config. Set VITE_FIREBASE_PROJECT_ID environment variable.')
			setError('Firebase not configured. Please set up your Firebase project.')
			setLoading(false)
			return
		}
		
		const userId = getUserId()
		console.log('[useDesks] UserId from getUserId():', userId)
		
		if (!userId) {
			console.log('[useDesks] No userId found, setting loading to false')
			setDesks([])
			setLoading(false)
			return
		}

		// Set a timeout to detect if query hangs
		const timeoutId = setTimeout(() => {
			console.warn('[useDesks] Query timeout after 10 seconds - query may be hanging')
			console.warn('[useDesks] Check Firebase configuration and network connection')
			setError('Query timeout: Check Firebase configuration and network connection')
			setLoading(false)
		}, 10000) // 10 second timeout

		console.log('[useDesks] Setting up Firestore query for userId:', userId)
		
		try {
			const desksRef = collection(db, 'desks')
			const q = query(desksRef, where('userId', '==', userId))
			
			console.log('[useDesks] Query created, setting up onSnapshot listener')

			const unsubscribe = onSnapshot(
				q,
				(snapshot) => {
					clearTimeout(timeoutId)
					console.log('[useDesks] onSnapshot success callback fired, snapshot size:', snapshot.size)
					console.log('[useDesks] Snapshot metadata:', {
						hasPendingWrites: snapshot.metadata.hasPendingWrites,
						fromCache: snapshot.metadata.fromCache,
					})
					
					const desksData = []
					snapshot.forEach((doc) => {
						desksData.push({
							id: doc.id,
							...doc.data(),
						})
					})
					console.log('[useDesks] Processed desks:', desksData.length)
					setDesks(desksData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
					setLoading(false)
					setError(null)
				},
				(err) => {
					clearTimeout(timeoutId)
					console.error('[useDesks] Error fetching desks:', err)
					console.error('[useDesks] Error details:', {
						code: err.code,
						message: err.message,
						stack: err.stack,
					})
					setError(err.message || 'Failed to fetch desks')
					setLoading(false)
				}
			)

			return () => {
				clearTimeout(timeoutId)
				console.log('[useDesks] Cleaning up: unsubscribing and clearing timeout')
				unsubscribe()
			}
		} catch (err) {
			clearTimeout(timeoutId)
			console.error('[useDesks] Error setting up query:', err)
			setError(err.message || 'Failed to setup query')
			setLoading(false)
		}
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

