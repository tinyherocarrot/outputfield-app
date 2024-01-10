import "server-only"
import { Firestore, CollectionReference, DocumentData } from '@google-cloud/firestore'
import { initAdmin } from "../firebase-admin"

// Init the firebase app
initAdmin()

// Export firestore incase we need to access it directly
export const firestore = new Firestore({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
  }
})

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
  return firestore.collection(collectionName) as CollectionReference<T>
}

// Import all your model types
import { Artist } from '@/ts/interfaces/artist.interfaces'

// export all your collections
export const artistsColl = createCollection<Artist>('artists')
