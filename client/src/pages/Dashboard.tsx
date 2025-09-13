import { useState, useRef } from "react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { post } from "../utils/api";


export default function Dashboard() {

    const [responseMessage, setResponseMessage] = useState("");
    const [pdfDashboard, setPdfDashboard] = useState<any[]>([]);
    const [pdf, setPdf] = useState<File | null>(null);

    // Reference for the PDF input
    const pdfInputRef = useRef<HTMLInputElement | null>(null);

        // MOVE THIS TO A HEADER LATER
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (e: any) {
            setResponseMessage(e instanceof Error ? e.message : "Unknown error");
        }
    }


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedPdf = e.target.files?.[0];
        if (selectedPdf) setPdf(selectedPdf);
    };

    const handlePdfUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pdf) return;

        // Client side type checking
        if (pdf.type !== "application/pdf") {
            setResponseMessage("Only PDF files are allowed");
            return;
        }

        const formData = new FormData();
        formData.append("file", pdf);

        try {
            const newPdf = await post<{ message: string, pdfMetadata: { userId: string, pdfId: string, name: string, storagePath: string } }>("/api/pdf/upload", formData);
            setPdfDashboard((prev) => [...prev, newPdf.pdfMetadata]); // Add the new pdf metadata to the array
            setResponseMessage(`${newPdf?.message}: ${newPdf.pdfMetadata?.name}`);
            // Reset input after successful upload
            setPdf(null);
        } catch (e) {
            setResponseMessage(e instanceof Error ? e.message : "Unknown error");
        }
    }

    return (
        <>
            <h1>Dashboard</h1>

            <h3 className="text-xl">{responseMessage}</h3>

            <div>
                <ul>
                    {pdfDashboard.map((pdf) => (
                        <li key={pdf?.pdfId}>
                            <p>{pdf?.name}</p>
                            <a href={pdf?.storagePath} target="_blank" rel="noopener noreferrer">Open</a>
                        </li>
                    )
                    )}
                </ul>
            </div>



            <form
                onSubmit={handlePdfUpload}
            >
                <div className="mb-3 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 bg-gray-50">
                        <span>Attach File</span>
                        <input
                            type="file"
                            ref={pdfInputRef}
                            onChange={handleFileChange}
                            accept="application/pdf"
                            className="hidden"
                        />
                    </label>

                    {(pdf) && (
                        <>
                            {pdf && <p className="text-sm text-gray-600">{pdf.name}</p>}
                            <button
                                type="button"
                                onClick={() => {
                                    setPdf(null);
                                    if (pdfInputRef.current) pdfInputRef.current.value = "";
                                }}
                                className="text-red-500 text-xs hover:underline"
                            >
                                ✕ Remove
                            </button>
                        </>
                    )}
                </div>

                <button
                    className="px-4 py-2 rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                    type="submit"
                    disabled={!pdf}
                >
                    Upload PDF
                </button>
            </form>

            <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-600 text-white cursor-pointer hover:bg-red-700"
            >LOGOUT</button>
        </>
    )
}