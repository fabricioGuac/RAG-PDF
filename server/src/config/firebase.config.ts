import admin from "firebase-admin";
import { env } from "./env";

// Ensure private key line breaks are correctly parsed
const firebasePrivateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

// Check if a default app is already initialized
if (!admin.apps.length){
    admin.initializeApp({
        // Use credential.cert to initialize Firebase with credentials from environment variables
        credential: admin.credential.cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: firebasePrivateKey,
        }),
        storageBucket:`${env.FIREBASE_PROJECT_ID}.firebasestorage.app`
    });
}

// Export the firebase services to implemented
export const auth = admin.auth(); 
export const firestore = admin.firestore();
export const storage = admin.storage().bucket();