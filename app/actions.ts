'use server'

import { doc, updateDoc, addDoc, getDoc, deleteDoc, DocumentReference } from "firebase/firestore"
import { artistsColl, nomineeColl } from "@/lib/firebase/composables/useDb"
import { NomineeStatus } from "@/ts/enums/nomineeStatus.enums"
import { revalidatePath } from "next/cache"
import { Nominee } from "@/ts/interfaces/nominee.interfaces"

export const updateNomineeStatus = async (id: string, value: NomineeStatus) => {
    try {
        const nomineeRef = doc(nomineeColl, id)
        if (nomineeRef) {
            await updateDoc(nomineeRef, { status: value })
            revalidatePath("/admin")
        }
        if (value === 'Approved') {
            await approveNominee(id)
        } else {
            await rejectNominee(id)
        }
    } catch (error) {
        console.error('Update nominee status failed. Error: ', error)
    }
}

// On "Approved", copy nominee to artists collection
async function approveNominee(id: string) {
    try {
        const nomineeRef = doc(nomineeColl, id)
        const nomineeSnap = await getDoc(nomineeRef)
        const {
            name,
            email,
            website_url,
            genre,
            location,
        } = nomineeSnap.data() as Nominee
        const artistRef = await addDoc(artistsColl, {
            name, email, website_url, genre, location,
            date_added: new Date(),
            preview_img: '',
            id: '',
        })

        // Add a reference to the new artist from the nominee doc
        await updateDoc(nomineeRef, { artistRef: artistRef })

        revalidatePath("/")
        console.log(`Added artist with id: ${artistRef.id}`);
    } catch (error) {
        console.log('Approve nominee failed. Error: ', error)
    }
}

// On "Rejected", check for nominee in artists collection.
// If exists, remove. 
async function rejectNominee(id: string) {
    try {
        const nomineeRef = doc(nomineeColl, id)
        const nomineeSnap = await getDoc(nomineeRef)
        const {
            artistRef
        } = nomineeSnap.data() as Nominee
        const artistSnap = await getDoc(artistRef as DocumentReference)
        if (artistSnap.exists()) {
            console.log('rejecting reference id: ', artistSnap.id)
            
            // Delete artist doc and remove reference on nominee doc
            await deleteDoc(artistRef as DocumentReference)
            await updateDoc(nomineeRef, { artistRef: '' })

            revalidatePath("/")
            console.log(`Removed artist with id: ${artistRef?.id}`);
        }
    } catch (error) {
        console.log('Reject nominee failed. Error: ', error)
    }
}

export async function addNomineeRow(data: Nominee) {
    try {
        const documentRef = await addDoc(nomineeColl, data)
        console.log(`Added nominee with id: ${documentRef.id}`);
    } catch (error) {
        console.log('Add nominee failed. Error: ', error)
    }
}