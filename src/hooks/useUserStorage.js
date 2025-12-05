import { useEffect } from 'react'
import { useProfile } from '@farcaster/auth-kit'
import { db } from '../config/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export function useUserStorage() {
	const { profile } = useProfile()

	useEffect(() => {
		// Only save if user is authenticated
		if (!profile?.fid) {
			return
		}

		const saveUserData = async () => {
			try {
				// Use fid as the document ID for the user
				const userRef = doc(db, 'users', profile.fid.toString())

				const userData = {
					fid: profile.fid,
					username: profile.username || '',
					displayName: profile.displayName || '',
					pfpUrl: profile.pfpUrl || '',
					bio: profile.bio || '',
					followerCount: profile.followerCount || 0,
					followingCount: profile.followingCount || 0,
					// Timestamps
					firstLoginAt: serverTimestamp(),
					lastLoginAt: serverTimestamp(),
				}

				// Use merge: true to avoid overwriting other fields
				// This will update lastLoginAt on each login
				await setDoc(userRef, userData, { merge: true })
			} catch (error) {
				console.error('Error saving user data to Firebase:', error)
			}
		}

		saveUserData()
	}, [profile?.fid, profile?.username, profile?.displayName, profile?.pfpUrl])

	return { profile }
}

