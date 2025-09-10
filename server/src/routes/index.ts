import { Router } from "express";
import { verifyAuth, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

router.get("/protected", verifyAuth, (req: AuthRequest, res) => {
    res.json({
        message: "YOU HAVE ACCESSSS!!!",
        uid: req.user?.uid,
    });
});

export default router;