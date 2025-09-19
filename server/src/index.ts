import app from "./app";
import { ensurePdfChunksCollection } from "./config/qdrant.config";

(async () => {
    try {
        await ensurePdfChunksCollection();
        console.log("✅ Qdrant collection ready");
    } catch (error) {
        console.error("❌ Failed to initialize Qdrant collection", error);
    }
})();

// Instead of starting a server, export the app for Vercel
export default app;