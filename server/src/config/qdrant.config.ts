import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "./env";

export const qdrantClient = new QdrantClient(
    env.NODE_ENV === "production" ?
        { host: env.QDRANT_URL, apiKey: env.QDRANT_API_KEY } :
        { host: "localhost", port: 6333 } // Local development 
);

// Initialize the collection if missing
export async function ensurePdfChunksCollection() {
    const collectionName = "pdf_chunks";

    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some(c => c.name === collectionName);

    if (!exists) {
        await qdrantClient.createCollection(collectionName, {
            vectors: {
                size: 3072, // embedding dimension (text-embedding-3-large)
                distance: "Cosine", // Measures the angle between two vectors, ideal for text
            },
        });
        console.log(`Collection '${collectionName}' created.`);
    } else {
        console.log(`Collection '${collectionName}' already exists.`);
    }
}