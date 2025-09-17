import { useState, useRef, useEffect } from "react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { post } from "../utils/api";
import type { PdfMetadata } from "../utils/firestoreHelper";
import { getAllUserPdfs } from "../utils/firestoreHelper";

interface SidebarComponentProps {
    setSelectedPdf: (pdfMetadata: any) => void;
    onClose: () => void;
}


export default function SidebarComponent({ setSelectedPdf, onClose }: SidebarComponentProps) {
    const [pdfs, setPdfs] = useState<PdfMetadata[]>([]);
    const [pdf, setPdf] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    // Reference for the PDF input
    const pdfInputRef = useRef<HTMLInputElement | null>(null);


    // Fetch the user's PDFs
    useEffect(() => {
        const pdfFetcherSetter = async () => {
            try {
                setLoading(true);
                const pdfsResponse = await getAllUserPdfs()
                setPdfs(pdfsResponse);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        pdfFetcherSetter();
    }, []);


    // Leverages firebase signOut to close the current session
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (e: any) {
            console.log(e instanceof Error ? e.message : "Unknown error");
        }
    }

    // Manages the selected Pdf
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedPdf = e.target.files?.[0];
        if (selectedPdf) setPdf(selectedPdf);
    };

    // Function to send the PDF to the server
    const handlePdfUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pdf) return;

        // Client side type checking
        if (pdf.type !== "application/pdf") {
            console.error("Only PDF files are allowed");
            return;
        }
        // Creates a new instance of form data and appends the PDF to it
        const formData = new FormData();
        formData.append("file", pdf);

        try {
            const newPdf = await post<{ message: string, pdfMetadata: { userId: string, pdfId: string, name: string, storagePath: string } }>("/api/pdf/upload", formData);
            setPdfs((prev) => [...prev, newPdf.pdfMetadata]); // Add the new pdf metadata to the array
            // Reset input after successful upload
            setPdf(null);
            if (pdfInputRef.current) pdfInputRef.current.value = "";
        } catch (e) {
            console.error(e instanceof Error ? e.message : "Unknown error");
        }
    };


    return (
        <div className="w-64 bg-gray-100 border-r flex flex-col min-w-0">
            {/* header */}
            <div className="flex items-center justify-between px-4 py-2 border-b">
                <h2 className="font-semibold text-lg">My PDFs</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    ✕
                </button>
            </div>

            {/* Upload new PDF section */}
            {/* Upload new PDF section */}
            <form onSubmit={handlePdfUpload} className="p-4 border-b flex flex-col items-center gap-3">
                <label className="flex items-center justify-center gap-2 cursor-pointer text-sm text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 bg-gray-50 w-full text-center">
                    <span>{pdf ? "Change File" : "Upload a PDF here"}</span>
                    <input
                        type="file"
                        ref={pdfInputRef}
                        onChange={handleFileChange}
                        accept="application/pdf"
                        className="hidden"
                    />
                </label>

                {pdf && (
                    <div className="w-full flex items-center justify-between text-sm">
                        <span className="truncate">{pdf.name}</span>
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-800"
                        >
                            Upload
                        </button>
                    </div>
                )}
            </form>




            {/* PDF list */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-4 text-gray-400 text-sm">Loading PDFs…</div>
                ) : pdfs.length > 0 ? (
                    <ul>
                        {pdfs.map((pdf) => (
                            <li
                                key={pdf.pdfId}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => setSelectedPdf(pdf)}
                            >
                                {pdf.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-gray-400 text-sm">No PDFs uploaded yet</div>
                )}
            </div>

            {/* Logout section */}
            <div
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-md cursor-pointer bg-red-600 text-white text-center hover:bg-red-800"
            >
                Logout
            </div>
        </div>
    );
}