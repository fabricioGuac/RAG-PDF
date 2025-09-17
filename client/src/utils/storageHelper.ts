import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/config";

// Resolve a storage path to a download URL
export async function getPdfUrl(storagePath: string): Promise<string>{
    const fileRef= ref(storage, storagePath);
    return await getDownloadURL(fileRef);
}