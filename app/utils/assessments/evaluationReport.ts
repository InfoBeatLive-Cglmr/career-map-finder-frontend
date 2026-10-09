// utils/evaluationReport.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface CategoryBreakdownItem {
  category: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  feedback?: string;
  [key: string]: any;
}

export interface EvaluationReport {
  id: string;
  examSessionId: string;
  subject: string;
  totalMarksObtained: number;
  totalMaxMarks: number;
  percentage: number;
  grade?: string | null;
  overallFeedback: string;
  strengths: string[];
  improvementAreas: string[];
  categoryBreakdown: CategoryBreakdownItem[] | Record<string, any>;
  generatedAt: string;
  examSession?: Record<string, any>;
}

// ==========================================
// REQUEST DTOs
// ==========================================

export interface GenerateReportInput {
  examSessionId: string;
}

export interface UpdateReportInput {
  totalMarksObtained?: number;
  totalMaxMarks?: number;
  percentage?: number;
  grade?: string;
  overallFeedback?: string;
  strengths?: string[];
  improvementAreas?: string[];
  categoryBreakdown?: CategoryBreakdownItem[] | Record<string, any>[];
}

// ==========================================
// RESPONSE SCHEMAS
// ==========================================

export interface SingleReportApiResponse {
  success: boolean;
  data: EvaluationReport;
  message?: string;
}

export interface DeleteReportApiResponse {
  success: boolean;
  message: string;
}

// ==========================================
// HELPER FOR AUTHENTICATED FETCH
// ==========================================

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    const errorMessage =
      data.message ||
      data.error ||
      (data.errors && JSON.stringify(data.errors)) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const evaluationReportApi = {
  /**
   * Trigger AI calculation & evaluation to generate or update a report for an exam session
   */
  async generateReport(
    data: GenerateReportInput
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>("/assessment/evaluation-report/assessment-reports/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Fetch evaluation report by exam session ID (includes examSession details)
   */
  async getReportBySessionId(
    sessionId: string
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(
      `/assessment/evaluation-report/assessment-reports/session/${sessionId}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Update an existing evaluation report manually by ID
   */
  async updateReport(
    id: string,
    data: UpdateReportInput
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(
      `/assessment/evaluation-report/assessment-reports/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete an evaluation report by ID
   */
  async deleteReport(id: string): Promise<DeleteReportApiResponse> {
    return fetchWithAuth<DeleteReportApiResponse>(
      `/assessment/evaluation-report/assessment-reports/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};