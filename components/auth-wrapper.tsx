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
import { Admin } from "@/ts/interfaces/admin.interfaces";

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
    allowList: Admin[]
    initialUser: any
}

export const AuthWrapper: React.FC<AuthWrapperProps> = (
    { initialUser, allowList, children }
) => {
	const [message, setMessage] = useState('')
	const user = useUserSession(initialUser)

	const handleSignOut = (event: SyntheticEvent) => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = async (event: SyntheticEvent) => {
		event.preventDefault();
		const user = await signInWithGoogle();
        if (user) {
			const isAuthorized = allowList.map(({ email }) => email).includes(user?.email as string)
            if (!isAuthorized) {
					setMessage('Access Denied.')
                	await signOut()
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