'use client'
import React, { useState, useEffect, SyntheticEvent } from "react";
import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged
} from "../lib/firebase/auth";
import { User } from "firebase/auth"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function useUserSession(initialUser: User) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser);
	const router = useRouter()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged((authUser: User) => {
			setUser(authUser)
		})

		return () => unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		onAuthStateChanged((authUser: User) => {
			if (user === undefined) return

			// refresh when user changed to ease testing
			if (user?.email !== authUser?.email) {
				router.refresh()
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return user;
}

interface AuthWrapperProps {
    children: React.ReactNode
    initialUser: any
}

export const AuthWrapper: React.FC<AuthWrapperProps> = (
    { initialUser, children }
) => {
	const [message, setMessage] = useState('')
	const user = useUserSession(initialUser)

	const handleSignOut = (event: SyntheticEvent) => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = async (event: SyntheticEvent) => {
		event.preventDefault();
		setMessage('')
		try {
			await signInWithGoogle();
		} catch (error: any) {
			if (error.code !== 'auth/internal-error' && error.message.indexOf('Cloud Function') !== -1) {
				setMessage('Access Denied.')
			} else {
				setMessage('Something went wrong.')
			}
		}
	};

	return (
		<div>
			{user ? (
				<>
					{children}
					<Button onClick={handleSignOut} className="fixed top-2 right-2">
						Sign Out
					</Button>
				</>
			) : (
				<div className="flex flex-col items-center justify-center h-screen">
					<Button onClick={handleSignIn}>
						Sign In with Google
					</Button>
					<p className="text-red-500 mt-4">{message}</p>
				</div>
			)}
		</div>
	);
}