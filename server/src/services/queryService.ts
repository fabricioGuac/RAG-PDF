import { openaiClient } from "../config/openai.config"
import { qdrantClient } from "../config/qdrant.config"

export const queryService = {

    async queryPdf(userId: string, pdfId: string, question: string){
        // Embed the question 
        const embeddedQuetionResponse = await openaiClient.embeddings.create({
            model:"text-embedding-3-large",
            input:question,
        });
        const embeddedQuestion = embeddedQuetionResponse.data[0].embedding;

        // Query Qdrant for similar chunks
        const similarVectors = await qdrantClient.query("pdf_chunks",{
            query: embeddedQuestion,
            filter: {
                must: [
                    {
                    key:"userId",
                    match: { value: userId },
                },
                {
                    key:"pdfId",
                    match: { value: pdfId },
                },
                ],
            },
            with_payload: true,
            limit:5,
        });

        // Extract the text of vector points
        const contexts =  similarVectors.points.map((point: any) => point.payload?.text).filter(Boolean);

        // Create the prompts for the LLM
        // LLM role assignment
        const systemPrompt = `
        You are a helpfull assistant answering questions from a user's PDF.
        Only answer using the provided context. If the answer is not in the context admit you don't know.
        `
        // Regular user prompt
        const userPrompt = `
        Question: ${question}

        Context:
        ${contexts.join("\n\n---\n\n")}
        `;

        // Prompts the LLM
        const rawOpeniaAnswer = await openaiClient.chat.completions.create({
            model:"gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature:0.2 // Set a lower temperature best for RAG apps
        })
        const openiaAnser = rawOpeniaAnswer.choices[0]?.message?.content || "No answer found";

        return openiaAnser;
    },

}