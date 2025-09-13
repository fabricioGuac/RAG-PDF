import { firestore, storage } from "../config/firebase.config";
import { embeddingService } from "./embeddingService";
import { v4 as uuidv4 } from "uuid";

// Export an object to perform the operations on PDFs
export const pdfService = {

    // Process, upload and save the pdf data
    async uploadPdf(userId: string, pdf: Express.Multer.File) {
        const pdfId = uuidv4(); // Generate the id
        const storagePath = `pdfs/${userId}/${pdfId}.pdf`; // Path to the file in the bucket

        // Upload the pdf to the Firebase Storage
        const fileRef = storage.file(storagePath); // Create the file object representing the location
        await fileRef.save(pdf.buffer, { contentType: pdf.mimetype }); // Saves the file content

        // Save the pdf metadata to firestore
        const metadata = {
            userId,
            pdfId,
            name: pdf.originalname,
            storagePath,
        };
        await firestore.collection("pdfs").doc(pdfId).set(metadata);

        // Process PDF for rag application (chunk, embed and save vectors to Qdrant)
        await embeddingService.processPdf(userId, pdfId, pdf.buffer);

        return metadata;
    },
};
