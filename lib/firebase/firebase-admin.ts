import "server-only";
import admin from "firebase-admin";
import { formatPrivateKey } from "../utils";
interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
}
 
export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  // const privateKey = formatPrivateKey(params.privateKey);
  const privateKey = params.privateKey
    ? params.privateKey.split(String.raw`\\n`).join('\n')
    : undefined
  if (admin.apps.length > 0) {
    return admin.app();
  }
 
  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });
 
  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}
 
export async function initAdmin() {
  const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.G_SERVICE_ACCOUNT_CLIENT_EMAIL as string,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    privateKey: process.env.G_SERVICE_ACCOUNT_PRIVATE_KEY as string,
  };
 
  return createFirebaseAdminApp(params);
}