import { type FirebaseOptions } from 'firebase/app';
import { ServiceAccount } from 'firebase-admin';
import { test as base } from '@playwright/test'

import playwrightFirebasePlugin from '@nearform/playwright-firebase';

const uid = process.env.NEXT_PUBLIC_FIREBASE_USER_UID as string;
const serviceAccount = {
    "type": process.env.G_SERVICE_ACCOUNT_TYPE!,
    "project_id":process.env.G_SERVICE_ACCOUNT_PROJECT_ID!,
    "private_key_id":process.env.G_SERVICE_ACCOUNT_PRIVATE_KEY_ID!,
    "private_key": process.env.G_SERVICE_ACCOUNT_PRIVATE_KEY!,
    "client_email":process.env.G_SERVICE_ACCOUNT_CLIENT_EMAIL!,
    "client_id":process.env.G_SERVICE_ACCOUNT_CLIENT_ID!,
    "auth_uri":process.env.G_SERVICE_ACCOUNT_AUTH_URI!,
    "token_uri":process.env.G_SERVICE_ACCOUNT_TOKEN_URI!,
    "auth_provider_x509_cert_url":process.env.G_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL!,
    "client_x509_cert_url":process.env.G_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL!,
    "universe_domain":process.env.G_SERVICE_ACCOUNT_UNIVERSE_DOMAIN!,
}
const options: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.G_SERVICE_ACCOUNT_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const test = playwrightFirebasePlugin(serviceAccount as ServiceAccount, options, uid, base)