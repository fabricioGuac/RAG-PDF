import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Hardcoded firebase configuration (public info, safe to commit)
const firebaseConfig = {
    apiKey: "AIzaSyBhp5lySmBKk8vudfml3CkfZ8kaCnL6T6k",
    authDomain: "pdf-rag-app-4d828.firebaseapp.com",
    projectId: "pdf-rag-app-4d828",
    storageBucket: "pdf-rag-app-4d828.firebasestorage.app",
    messagingSenderId: "40929864758",
    appId: "1:40929864758:web:3b6dbfc051126607db3c97",
    measurementId: "G-658T9EDLQD"
};

// Avoids "already exists errors"
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export concrete instances so callers don't worry about init timing
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Make sessions persist
setPersistence(auth, browserLocalPersistence)
.then(() => console.log("Firebase auth persistance: Local"))
.catch(console.error);