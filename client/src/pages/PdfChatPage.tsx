import { useState } from "react";
import { post } from "../utils/api";

interface PdfChatPageProps {
    storagePath: string,
    pdfId:string,
}

interface ChatMessage {
    id:string,
    content:string,
    role: "user" | "assistant" | "error";
}

export default function PdfChatPage({ pdfId }:PdfChatPageProps){
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);

    
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!question.trim()) return;

        // Add user question to the chat
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            content:question,
            role:"user",
        };
        setChat((prev) => [...prev, userMessage]);
        setQuestion("");
        setLoading(true);

        try {
            // Ask the RAG application
            const res: string = await post(`/api/query/${pdfId}`, { question });
            // Add the AI response to the chat
            const botMessage: ChatMessage = {
                id: `bot-${Date.now()}`,
                content: res,
                role: "assistant",
            };
            setChat((prev) => [...prev, botMessage]);
        } catch (e: any) {
            console.error(e);
            const errorMessage: ChatMessage = {
                id:`error-${Date.now()}`,
                content: e.message || "Failed to get response",
                role: "error",
            };
            setChat((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">SCAFFOLD PDF chat</h1>
            <div className="border rounded -p-4 h-96 overflow-y-auto mb-4">
                {chat.map((msg) => (
                    <div
                    key={msg.id}
                    className={`mb-2 p-2 rounded ${msg.role === "user" ? "bg-blue-100 self-end" : msg.role === "error"? "bg-red-100" : "bg-gray-100" }`}
                    >
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
                <input 
                    type="text" 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={loading ? "Waiting for response" : "Write your question..."}
                    className="flex-1 border rounded p-2"
                    disabled={loading}
                />
                <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
                >
                    {loading ? "Asking..." : "Send"}
                </button>
            </form>
        </div>
    )
}