import pdfParse from "pdf-parse";
import pLimit from "p-limit";
import { v4 as uuidv4 } from "uuid";
import { encodeTokens, decodeTokens } from "../utils/tokenizer";
import { chunkTextToken, ChunkOptions } from "../utils/chunker";
import { openaiClient } from "../config/openai.config";
import { qdrantClient } from "../config/qdrant.config";

// Export an object to perform the embedding operations
export const embeddingService = {
    /**
    * Process a PDF buffer, parse pages, chunk with token overlap across pages,
    * embed chunks, and upsert to Qdrant in batches.
    */
    async processPdf(userId: string, pdfId: string, pdfBuffer: Buffer) {
        // Parse PDF
        const parsedPdf = await pdfParse(pdfBuffer);
        let pages = parsedPdf.text.split(/\f/); // Separate it by pages (using form feeds)
        // Fallback if (splitting by form feeds does not work
        if (pages.length <= 1) {
            // Split by double new line groups (approximate paragraph breaks or page breaks)
            // Filters empty strings
            const possiblePages = parsedPdf.text.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
            // Updates the pages to the possible pages
            if (possiblePages.length > 1) pages = possiblePages;;
        }

        // Set up for the context preserving chunking
        const chunkOptions: ChunkOptions = { maxTokens: 500, overlap: 50 };
        let previousTokens: number[] = []; // carry-over tokens for overlap across pages
        type RawChunk = { id: string, text: string, payload: any };

        const rawChunks: RawChunk[] = [];


        // Iterate over the pages
        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            const page = pages[pageIndex].trim();
            if (!page) continue;
            // Tokenize pages
            const pageTokens = encodeTokens(page);
            // Combines previous overlap tokens plus current page tokesn so chunks cross page boundary
            const combinedTokens = previousTokens.length ? [...previousTokens, ...pageTokens] : pageTokens;
            // Create token chunks from combined tokens
            const tokenChunks = chunkTextToken(combinedTokens, chunkOptions);
            // Keep thhe last overlap tokens for the next page
            previousTokens = combinedTokens.slice(-chunkOptions.overlap);

            // Decode each token chunk to text for the embbeding api
            for (let i = 0; i < tokenChunks.length; i++) {
                const chunkText = decodeTokens(tokenChunks[i]);
                // Add each page chunk to the raw chunks
                rawChunks.push({
                    id: uuidv4(),
                    text: chunkText,
                    payload: { userId, pdfId, pageIndex, chunkIndex: i, text: chunkText },
                });
            }
        }
        
        // Set a concurrency limit of 3
        const limit = pLimit(3);
        // Batch size of the emebeddings
        const BATCH_SIZE = 64
        let buffer: any[] = []; // Keep the current batch
        let totalInserted = 0; // Keep count of the inserted vectors

        // Iterate over chunks
        for ( const chunk of rawChunks) {
            const vector = await limit(async () => {
                const emb = await openaiClient.embeddings.create({
                    model:"text-embedding-3-large",
                    input: chunk.text,
                });
                return {
                    id:chunk.id,
                    vector: emb.data[0].embedding as number[],
                    payload: chunk.payload,
                };
            });

            // Add the current vector to the buffer
            buffer.push(vector);

            // Once we have a full batch it upserts to Qdrant
            if (buffer.length >= BATCH_SIZE) {
                await qdrantClient.upsert("pdf_chunks", {wait:true, points: buffer});
                totalInserted += buffer.length;
                buffer = [] // Clears buffer
            }
        }

        // Upsert any leftover vectors in the buffer
        if(buffer.length > 0) {
            await qdrantClient.upsert("pdf_chunks", {wait:true, points: buffer});
            totalInserted += buffer.length;
        }

        
        return { chunks: totalInserted, pages: pages.length };
    },
};