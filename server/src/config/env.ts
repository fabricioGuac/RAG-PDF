import dotenv from "dotenv";

dotenv.config();

// Centralize enviromental variables
export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,

    // MongoDB
    MONGO_URI: process.env.MONGO_URI ?? "",

    // Qdrant
    QDRANT_URL: process.env.QDRANT_URL ?? "",
    QDRANT_API_KEY: process.env.QDRANT_API_KEY ?? "",

    // AWS S3
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    AWS_REGION: process.env.AWS_REGION ?? "",
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET ?? "",
    
    // OpenAi
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? ""
}