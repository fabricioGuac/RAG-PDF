import { Router } from "express";
import multer from "multer";
import { uploadPdfController } from "../controllers/pdfController";

const router = Router();
// Use memory storage so files aren't saved to disk
const upload = multer({ storage: multer.memoryStorage() });

// Post route to process and save a PDF
router.post("/upload",upload.single("file") ,uploadPdfController);

export { router as pdfRoutes };