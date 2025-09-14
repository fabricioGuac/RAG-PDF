import {  Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { queryService } from "../services/queryService";

export const queryPdfController = async (req: AuthRequest, res: Response) => {
    try {
        // Retrieve user id, pdf id and question from the request
        const userId = req.user?.uid;
        const pdfId = req.params?.id;
        const question =  req.body.question;
        
        // Ensure user id, pdf id and question are present
        if(!userId || !pdfId || !question){
            return res.status(400).json({ error: "Missing question, user or PDF" });
        }
        

        // Call the queryService to embed the question, search similar cuncks and prompt the LLM for the answer
        const answer = await queryService.queryPdf(userId, pdfId, question);

        res.status(201).json(answer);
    } catch (err) {
        console.error("Error querying from pdf", err);
        res.status(500).json({ error: "FAILED TO QUERY PDF" });
    }
}