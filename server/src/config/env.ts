import dotenv from "dotenv";

dotenv.config();

// Centralize enviromental variables
export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,

    // Qdrant
    QDRANT_URL: process.env.QDRANT_URL ?? "",
    QDRANT_API_KEY: process.env.QDRANT_API_KEY ?? "",

    // Firebase
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? "",
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ?? "",
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ?? "",
    
    // OpenAi
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? ""
}