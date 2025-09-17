import { useState } from "react";
import ChatComponent from "../components/ChatComponent";
import PdfViewerComponent from "../components/PdfViewerComponent";
import SidebarComponent from "../components/SidebarComponent";
import type { PdfMetadata } from "../utils/firestoreHelper";


export default function Dashboard() {
    const [selectedPdf, setSelectedPdf] = useState<PdfMetadata | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);



    return (
        <div className="flex min-h-screen overflow-hidden">
            {/* Sidebar */}
            {sidebarOpen && (
                <SidebarComponent
                    setSelectedPdf={setSelectedPdf}
                    onClose={() => setSidebarOpen(false)}
                />
            )}
            <div className="flex-1 flex flex-col">
                {/* Sidebar toggel btn */}
                {!sidebarOpen && (
                    <button
                        onClick={() => {
                            setSidebarOpen((prev) => !prev);

                        }
                        }
                        className="absolute top-4 left-4 bg-gray-200 px-3 py-1 rounded shadow hover:bg-gray-300"
                    >
                        ☰ Open
                    </button>
                )}
                {/* Main content (reader and chat) */}
                {selectedPdf ? (
                    <div className="flex-1 flex flex-col lg:flex-row">
                        <PdfViewerComponent storagePath={selectedPdf.storagePath} />
                        <ChatComponent pdfId={selectedPdf.pdfId} />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a PDF to start
                    </div>
                )
                }
            </div>
        </div>
    )
}