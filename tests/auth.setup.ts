import { type FirebaseOptions } from 'firebase/app';
import { ServiceAccount } from 'firebase-admin';
import { test as base } from '@playwright/test'

import playwrightFirebasePlugin from '@/lib/playwright-firebase'
import serviceAccount from "../.serviceAccountKey.json" assert { type: "json" };

const uid = process.env.NEXT_PUBLIC_FIREBASE_USER_UID as string;
const options: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    // databaseURL: process.env
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
export const test = playwrightFirebasePlugin(serviceAccount as ServiceAccount, options, uid, base)