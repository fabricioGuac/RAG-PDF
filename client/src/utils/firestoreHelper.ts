import { collection, getDocs, query, where } from "firebase/firestore";
import { db,auth } from "../firebase/config";

export interface PdfMetadata {
    pdfId:string;
    name:string;
    storagePath:string;
}

// Function that fetches all PDFs of the curent logged in user
export async function getAllUserPdfs(): Promise<PdfMetadata[]>{
    const userId = auth.currentUser?.uid;
    if(!userId) throw new Error("Cannot fetch PDFs of unathenticated users");

    // Query to fetch all PDFs where the user is the current user
    const q = query(collection(db, "pdfs"), where("userId", "==", userId));

    // Fetch from fiestore
    const snapshot = await getDocs(q);

    // Cast Firestore data to our PdfMetadata shape (minus pdfId, which we add manually)
    // This makes TypeScript happy since doc.data() is typed as DocumentData (loose/any)
    return snapshot.docs.map((doc) => ({  pdfId: doc.id, ...(doc.data() as Omit<PdfMetadata, "pdfId">), }))
}