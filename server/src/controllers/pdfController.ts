import {  Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { pdfService } from "../services/pdfService";

export const uploadPdfController = async (req: AuthRequest, res: Response) => {
    try {
        // Retrieve userId and file from teh request
        const userId = req.user?.uid;
        const pdf = req.file;
        
        // Ensure user id and pdf are present
        if(!userId || !pdf){
            return res.status(400).json({ error: "Missing user or PDF" });
        }
        
        // Validates it only accepts PDFs
        if(pdf.mimetype !== "application/pdf"){
            return res.status(400).json({ error: "Only PDF files are allowed" });
        }

        // Call the pdfService to process, upload and save the pdf data
        const pdfMetadata = await pdfService.uploadPdf(userId, pdf);

        res.status(201).json({ message: "PDF processed and uploaded successfully", pdfMetadata });
    } catch (err) {
        console.error("Error uploading pdf ", err);
        res.status(500).json({ error: "FAILED TO UPLOAD PDF" });
    }
}