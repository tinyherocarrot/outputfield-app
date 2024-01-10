'use server'

import { nomineeColl } from "@/lib/firebase/composables/useDb";
import { Nominee } from "@/ts/interfaces/nominee.interfaces";

export async function addNomineeRow(data: Nominee) {
    try {
        console.log('adding nominee row', data)

        const documentRef = await nomineeColl.add(data)
        console.log(`Added nominee with id: ${documentRef.id}`);
    } catch (error) {
        console.log('Add nominee failed. Error: ', error)
    }
}