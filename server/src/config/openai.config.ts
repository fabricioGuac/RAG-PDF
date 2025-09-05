import { OpenAI } from "@langchain/openai";
import { env } from "./env";

// Initialize the OpenAi client
export const openaiClient = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});