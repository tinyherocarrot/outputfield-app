import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged as _onAuthStateChanged,
  } from "firebase/auth";
import { auth } from "./firebase";

export function onAuthStateChanged(cb: (x: any) => any) {
    return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        const cred = await signInWithPopup(auth, provider);
        const { user } = cred
        return user
    } catch (error: any) {
        console.error(error);
        throw Error(error)
    }
}

export async function signOut() {
    try {
            return auth.signOut();
    } catch (error) {
            console.error("Error signing out with Google", error);
    }
}
