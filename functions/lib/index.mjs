"use strict";
/* eslint-disable camelcase */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforecreated = void 0;
const identity = __importStar(require("firebase-functions/v2/identity"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
exports.beforecreated = identity.beforeUserCreated(async (event) => {
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
        throw new identity.HttpsError("permission-denied", "You are not authorized to sign in.");
    }
    else {
        console.log(`User ${user.uid} is authorized.`);
        // If user is found in an admin document, allow sign-in
        return;
    }
});
//# sourceMappingURL=index.mjs.map