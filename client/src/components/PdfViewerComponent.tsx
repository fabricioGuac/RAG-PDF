import { useEffect, useState } from "react";
import { getPdfUrl } from "../utils/storageHelper";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css"
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfViewerComponentProps {
    storagePath: string;
}

export default function PdfViewerComponent({ storagePath }: PdfViewerComponentProps) {
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState<number>(1.0);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const url = await getPdfUrl(storagePath);
                setPdfUrl(url);
            } catch (err) {
                console.error("Failed to load PDF: ", err);
            }
        };
        fetchUrl();
    }, [storagePath]);

    // Zoom controls
    const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
    const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
    const resetZoom = () => setScale(1.0);

    return (
        <div className="flex-1  max-h-screen overflow-auto  border-b md:border-r flex min-w-0 flex-col">
            {/* Zoom controls */}
            <div className="flex items-center justify-center gap-2 p-2 border-b bg-gray-50">
                <button onClick={zoomOut} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                <span>Zoom: {(scale * 100).toFixed(0)}%</span>
                <button onClick={zoomIn} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                <button onClick={resetZoom} className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
            </div>

            {/* PDF display area */}
            <div className="flex-1 overflow-auto bg-gray-100">
                <div className="flex justify-center w-full h-full overflow-auto">
                    {!pdfUrl ? (
                        <p className="text-gray-500 m-auto">Loading PDF...</p>
                    ) : (
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            loading={<p className="text-gray-500">Loading PDF...</p>}
                        >
                            {Array.from(new Array(numPages), (_, i) => (
                                <Page
                                    key={`page_${i + 1}`}
                                    pageNumber={i + 1}
                                    scale={scale}
                                    className="mb-4 shadow"
                                />
                            ))}
                        </Document>
                    )}
                </div>
            </div>
        </div>
    );
}