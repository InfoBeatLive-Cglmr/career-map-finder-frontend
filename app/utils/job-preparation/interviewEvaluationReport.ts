
// utils/interviewEvaluationReport.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

// ==========================================
// TYPES & ENUMS
// ==========================================

export type HireRecommendation =
  | "Strong Hire"
  | "Lean Hire"
  | "Lean No Hire"
  | "No Hire";

export type CategoryStatus = "EXCELLENT" | "GOOD" | "NEEDS_WORK";

// export interface RadarMetrics {
//   technicalProficiency: number;
//   communicationClarity: number;
//   problemSolvingLogic: number;
//   cultureAndLeadership: number;
//   domainKnowledge: number;
// }

export interface CategoryBreakdownItem {
  category: string;
  categoryName: string;
  score: number;
  status: CategoryStatus;
}

export interface FormattedInterviewEvaluationReport {
  id: string;
  sessionId: string;
  targetJobTitle: string;
  overallScore: number;
  hireRecommendation: HireRecommendation;
  executiveSummary: string;
  //radarMetrics: RadarMetrics;
  technicalProficiency: number;
  communicationClarity: number;
  problemSolvingLogic: number;
  cultureAndLeadership: number;
  domainKnowledge: number;
  strengths: string[];
  weaknesses: string[];
  keyImprovementAreas: string[];
  categoryBreakdowns: CategoryBreakdownItem[];
  generatedAt?: string;
  updatedAt?: string;
}

// ==========================================
// REQUEST DTOs
// ==========================================

export interface GenerateInterviewReportInput {
  interviewSessionId: string;
}

export interface UpdateInterviewReportInput {
  overallScore?: number;
  hireRecommendation?: HireRecommendation;
  executiveSummary?: string;
  //radarMetrics?: Partial<RadarMetrics>;
  technicalProficiency: number;
  communicationClarity: number;
  problemSolvingLogic: number;
  cultureAndLeadership: number;
  domainKnowledge: number;
  strengths?: string[];
  weaknesses?: string[];
  keyImprovementAreas?: string[];
  categoryBreakdowns?: CategoryBreakdownItem[];
}

export interface GetAllReportsQuery {
  page?: number;
  limit?: number;
}

// ==========================================
// RESPONSE SCHEMAS
// ==========================================

export interface SingleReportApiResponse {
  status: string;
  data: FormattedInterviewEvaluationReport;
  message?: string;
}

export interface PaginatedReportsApiResponse {
  status: string;
  data: FormattedInterviewEvaluationReport[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface DeleteReportApiResponse {
  status: string;
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

  if (!response.ok || data.status === "error") {
    const errorMessage =
      data.message ||
      (data.errors && JSON.stringify(data.errors)) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const interviewEvaluationReportApi = {
  /**
   * Generate an AI evaluation report for a completed interview session
   */
  async generateReport(
    data: GenerateInterviewReportInput
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(
      "/job-preparation/evaluation-reports/interview-reports/generate",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Fetch all evaluation reports with pagination
   */
  async getAllReports(
    query?: GetAllReportsQuery
  ): Promise<PaginatedReportsApiResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));

    const queryString = params.toString();
    const endpoint = `/job-preparation/evaluation-reports/interview-reports${queryString ? `?${queryString}` : ""}`;

    return fetchWithAuth<PaginatedReportsApiResponse>(endpoint, {
      method: "GET",
    });
  },

  /**
   * Get an evaluation report by report ID
   */
  async getReportById(id: string): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(`/job-preparation/evaluation-reports/interview-reports/${id}`, {
      method: "GET",
    });
  },

  /**
   * Get an evaluation report by interview session ID
   */
  async getReportBySessionId(
    sessionId: string
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(
      `/job-preparation/evaluation-reports/interview-reports/session/${sessionId}`,
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
    data: UpdateInterviewReportInput
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(`/job-preparation/evaluation-reports/interview-reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an evaluation report by ID
   */
  async deleteReport(id: string): Promise<DeleteReportApiResponse> {
    return fetchWithAuth<DeleteReportApiResponse>(`/job-preparation/evaluation-reports/interview-reports/${id}`, {
      method: "DELETE",
    });
  },
};