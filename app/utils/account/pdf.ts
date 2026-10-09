// utils/pdf.ts
import { API_BASE_URL, getAccessToken } from "./auth";

export interface DownloadPdfOptions {
  fileName?: string;
  openInNewTab?: boolean;
}

async function fetchPdfBlob(endpoint: string, isProtected: boolean = false): Promise<Blob> {
  const token = isProtected ? getAccessToken() : null;

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Failed to generate PDF (Status ${response.status})`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      // Response wasn't JSON
    }
    throw new Error(errorMessage);
  }

  return await response.blob();
}

/**
 * Utility to trigger browser file save or open preview in new tab
 */
function handlePdfBlob(blob: Blob, fileName: string, openInNewTab: boolean = false): void {
  const blobUrl = window.URL.createObjectURL(blob);

  if (openInNewTab) {
    window.open(blobUrl, "_blank");
  } else {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Clean up memory leak by revoking the object URL after a short delay
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const pdfApi = {
  /**
   * Fetch and download Demo Career Report PDF (Public route)
   * @param id The report ID
   * @param options Download options (fileName, openInNewTab)
   */
  async downloadDemoPdf(id: string, options: DownloadPdfOptions = {}): Promise<void> {
    if (!id) throw new Error("Report ID is required");

    const blob = await fetchPdfBlob(`/account/generate-pdf/pdf/demo/${id}`, false);
    const fileName = options.fileName || `career-report-demo-${id}.pdf`;
    
    handlePdfBlob(blob, fileName, options.openInNewTab);
  },

  /**
   * Fetch and download Main Career Report PDF (Protected route, requires auth)
   * @param id The report ID
   * @param options Download options (fileName, openInNewTab)
   */
  async downloadMainPdf(id: string, options: DownloadPdfOptions = {}): Promise<void> {
    if (!id) throw new Error("Report ID is required");

    const blob = await fetchPdfBlob(`/account/generate-pdf/pdf/main/${id}`, true);
    const fileName = options.fileName || `career-report-${id}.pdf`;

    handlePdfBlob(blob, fileName, options.openInNewTab);
  },

  /**
   * Fetch raw PDF Blob object if custom processing/upload is needed directly in code
   */
  async getPdfBlob(id: string, isDemo: boolean = false): Promise<Blob> {
    const endpoint = isDemo ? `/account/generate-pdf/pdf/demo/${id}` : `/pdf/main/${id}`;
    return fetchPdfBlob(endpoint, !isDemo);
  },
};