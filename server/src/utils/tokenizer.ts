import { encoding_for_model } from "@dqbd/tiktoken";

// Initialize tokenizer for the same model OpenAI uses for embeddings
const encoder = encoding_for_model("text-embedding-3-large");

// Encode a string to token IDs
// encoder.encode returns  Uint32Array, a typed array which is more memory efficient  but nos as flexible as a normal number[]
// So in order to access push, slice, etc... We convert it into a number[]
export const encodeTokens = (text:string): number[] => Array.from(encoder.encode(text));

//  Decode token back to string
export const decodeTokens = (tokens: number[]): string => {

    // Converts the number[] back to UintArray since that is what encoder.decode expects
    const uintArray = new Uint32Array(tokens) 
    // Decodes into the raw bytes representing the UTF-8 text
    const bytes = encoder.decode(uintArray)
    // Parses the bytes into string
    return new TextDecoder().decode(bytes);
}