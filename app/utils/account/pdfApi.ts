// utils/pdfApi.ts
import { API_BASE_URL, getAccessToken } from "./auth";

/**
 * Helper to trigger a browser file download from a Blob response
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export const pdfApi = {
  /**
   * Download Demo PDF Report (Public / Unauthenticated)
   */
  async downloadDemoPdf(id: string, filename: string = "career-report-demo.pdf"): Promise<void> {

    const response = await fetch(`${API_BASE_URL}/utils/generate-pdf/pdf/demo/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to download demo PDF: ${response.statusText}`);
    }

    const blob = await response.blob();
    downloadBlob(blob, filename);
  },

  /**
   * Download Main PDF Report (Authenticated)
   */
  async downloadMainPdf(id: string, filename: string = "career-report.pdf"): Promise<void> {
    const token = getAccessToken();

    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_BASE_URL}/utils/generate-pdf/pdf/main/${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to download main PDF: ${response.statusText}`);
    }

    const blob = await response.blob();
    downloadBlob(blob, filename);
  },
};