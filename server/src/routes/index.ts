import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { pdfRoutes } from './pdfRoutes';
import { queryRoutes } from './queryRoutes';


const router = Router();

router.get("/status", (_req, res) => {
    res.json({ message: "Server is running 🚀" });
});

router.use('/pdf',verifyAuth, pdfRoutes);
router.use('/query',verifyAuth, queryRoutes);

export default router;