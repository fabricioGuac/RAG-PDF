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
                <div className="flex-1 flex flex-col lg:flex-row max-h-screen">
                    <div className="flex-1 min-h-0 border-b lg:border-b-0 lg:border-r"> {/* ensures PdfViewer shrinks properly */}
                        <PdfViewerComponent storagePath={selectedPdf.storagePath} />
                    </div>
                    <div className="flex-1 min-h-0 border-t lg:border-t-0 lg:border-l"> {/* ensures Chat shrinks properly */}
                        <ChatComponent pdfId={selectedPdf.pdfId} />
                    </div>
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