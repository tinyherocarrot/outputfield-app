/* eslint-disable camelcase */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {
  HttpsError,
  beforeUserCreated,
} from "firebase-functions/v2/identity";
import * as admin from "firebase-admin";

admin.initializeApp();

export const beforecreated = beforeUserCreated(async (event) => {
  const user = event.data;

  // Get all documents from the 'admins' collection
  const snapshot = await admin.firestore().collection("admins").get();
  // Check if user exists in any admin document
  let isAdmin = false;
  snapshot.forEach((doc) => {
    if (doc.data().email === user.email) {
      isAdmin = true;
    }
  });

  if (!isAdmin) {
    // If user is not found in any admin document, block sign-in
    // await admin.auth().deleteUser(user.uid);
    console.log(`User ${user.uid} is not authorized and has been deleted.`);
    throw new HttpsError(
      "permission-denied", "You are not authorized to sign in."
    );
  } else {
    console.log(`User ${user.uid} is authorized.`);
    // If user is found in an admin document, allow sign-in
    return;
  }
});
