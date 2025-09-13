// Interface for the options parameter
export interface ChunkOptions {
    maxTokens: number; // Maximun tokens per chunk
    overlap: number; // Number of tokens to overlap between chunks
}

// Siding window chunker
export const chunkTextToken = (tokens: number[], options: ChunkOptions): number[][] =>{
    const { maxTokens, overlap } = options; // Deconstruct the options
    const chunks: number[][] = []; // Resulting array of token chunks
    
    // Start index for the sliding window
    let start = 0;

    // Iterate untill all tokens are processed
    while (start < tokens.length) {
        // Calculates the end index (limited to the array length)
        const end = Math.min(start + maxTokens, tokens.length);
        // Extract a chunk of tokens
        const chunk = tokens.slice(start, end);
        // Save chunk
        chunks.push(chunk);
        // Move window forward, preserving overlap
        start += maxTokens - overlap;
    }
    return chunks;
}