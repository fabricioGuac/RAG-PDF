import { useState } from "react";
import ChatComponent from "../components/ChatComponent";
import PdfViewerComponent from "../components/PdfViewerComponent";
import SidebarComponent from "../components/SidebarComponent";
import type { PdfMetadata } from "../utils/firestoreHelper";


export default function Dashboard() {
    const [selectedPdf, setSelectedPdf] = useState<PdfMetadata | null>(null);


    return (
        <div className="flex min-h-screen overflow-hidden">
            {/* Sidebar */}
            <SidebarComponent
                setSelectedPdf={setSelectedPdf}
            />
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
    )
}