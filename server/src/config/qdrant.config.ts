import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "./env";

export const qdrantClient = new QdrantClient(
    env.NODE_ENV === "production" ?
    {host: env.QDRANT_URL, apiKey: env.QDRANT_API_KEY} :
    {host: "localhost", port: 6333} // Local development 
);