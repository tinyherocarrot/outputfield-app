'use server'

import { doc, updateDoc, addDoc } from "firebase/firestore"
import { nomineeColl } from "@/lib/firebase/composables/useDb"
import { NomineeStatus } from "@/ts/enums/nomineeStatus.enums"
import { revalidatePath } from "next/cache"
import { Nominee } from "@/ts/interfaces/nominee.interfaces"

export const updateNomineeStatus = async (id: string, value: NomineeStatus) => {
    const nomineeRef = doc(nomineeColl, id)
    if (nomineeRef) {
        await updateDoc(nomineeRef, { status: value })
        revalidatePath("/admin")
    }
}

export async function addNomineeRow(data: Nominee) {
    try {
        console.log('adding nominee row', data)

        const documentRef = await addDoc(nomineeColl, data)
        console.log(`Added nominee with id: ${documentRef.id}`);
    } catch (error) {
        console.log('Add nominee failed. Error: ', error)
    }
}