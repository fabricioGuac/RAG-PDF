import { useState, useRef, useEffect } from "react";
import { post } from "../utils/api";

interface ChatComponentProps {
    pdfId: string;
}

interface ChatMessage {
    id: string;
    content: string;
    role: "user" | "assistant" | "error";
}

export default function ChatComponent({ pdfId }: ChatComponentProps) {
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to bottom when chat updates
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        // Add user question to the chat
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            content: question,
            role: "user",
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
                id: `error-${Date.now()}`,
                content: e.message || "Failed to get response",
                role: "error",
            };
            setChat((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 border-l">
            {/* Chat history */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {chat.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-xs p-3 rounded-lg ${msg.role === "user"
                                ? "ml-auto bg-blue-500 text-white"
                                : msg.role === "assistant"
                                    ? "mr-auto bg-gray-200 text-gray-800"
                                    : "mr-auto bg-red-100 text-red-700"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}

                {loading && (
                    <div className="text-center text-gray-500 text-sm">Thinking...</div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Input box */}
            <form
                onSubmit={handleSend}
                className="flex border-t p-2 gap-2 bg-white"
            >
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={loading ? "Waiting for response..." : "Ask about this PDF..."}
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
