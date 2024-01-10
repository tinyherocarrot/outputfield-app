import { db } from './../firebase';
import "server-only"
// import { Firestore, DocumentData } from '@google-cloud/firestore'
import { initAdmin } from "../firebase-admin"
import { DocumentData, CollectionReference, collection } from '@firebase/firestore';

// Init the firebase app
// initAdmin()

// Export firestore incase we need to access it directly
// export const firestore = new Firestore({
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   credentials: {
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     private_key: process.env.FIREBASE_PRIVATE_KEY,
//   }
// })

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>
}

// Import all your model types
import { Artist } from '@/ts/interfaces/artist.interfaces'
import { Nominee } from "@/ts/interfaces/nominee.interfaces"
import { Admin } from '@/ts/interfaces/admin.interfaces';

// export all your collections
export const artistsColl = createCollection<Artist>('artists')
export const nomineeColl = createCollection<Nominee>('nominees')
export const adminsColl = createCollection<Admin>('admins')
