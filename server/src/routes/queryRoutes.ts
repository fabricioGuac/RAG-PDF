import { Router } from "express";
import { queryPdfController } from "../controllers/queryController";

const router = Router();

// Post route to query from the pdf
router.post("/:id", queryPdfController);

export { router as queryRoutes };