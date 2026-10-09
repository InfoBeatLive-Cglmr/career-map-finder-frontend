// utils/candidateResponse.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface CandidateResponseItem {
  id: string;
  questionId: string;
  responseText?: string | null;
  submittedCode?: string | null;
  selectedChoices: string[];
  timeSpentSeconds: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// REQUEST DTOs
// ==========================================

export interface SubmitCandidateResponseInput {
  questionId: string;
  responseText?: string | null;
  submittedCode?: string | null;
  selectedChoices?: string[];
  timeSpentSeconds?: number;
}

export interface UpdateCandidateResponseInput {
  responseText?: string | null;
  submittedCode?: string | null;
  selectedChoices?: string[];
  timeSpentSeconds?: number;
}

// ==========================================
// RESPONSE SCHEMAS
// ==========================================

export interface SingleCandidateResponseApiResponse {
  status: string;
  data: CandidateResponseItem;
  message?: string;
}

export interface MultipleCandidateResponseApiResponse {
  status: string;
  data: CandidateResponseItem[];
  message?: string;
}

export interface DeleteCandidateResponseApiResponse {
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

export const candidateResponseApi = {
  /**
   * Submit a candidate response for an interview question
   */
  async submitResponse(
    data: SubmitCandidateResponseInput
  ): Promise<SingleCandidateResponseApiResponse> {
    return fetchWithAuth<SingleCandidateResponseApiResponse>("/job-preparation/candidate-responses/interview-responses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all responses submitted for a specific question ID
   */
  async getResponsesByQuestionId(
    questionId: string
  ): Promise<MultipleCandidateResponseApiResponse> {
    return fetchWithAuth<MultipleCandidateResponseApiResponse>(
      `/job-preparation/candidate-responses/interview-responses/${questionId}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Get a single response by ID
   */
  async getResponseById(
    id: string
  ): Promise<SingleCandidateResponseApiResponse> {
    return fetchWithAuth<SingleCandidateResponseApiResponse>(
      `/job-preparation/candidate-responses/interview-responses/${id}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Update an existing candidate response by ID
   */
  async updateResponse(
    id: string,
    data: UpdateCandidateResponseInput
  ): Promise<SingleCandidateResponseApiResponse> {
    return fetchWithAuth<SingleCandidateResponseApiResponse>(
      `/job-preparation/candidate-responses/interview-responses/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete a candidate response by ID
   */
  async deleteResponse(
    id: string
  ): Promise<DeleteCandidateResponseApiResponse> {
    return fetchWithAuth<DeleteCandidateResponseApiResponse>(
      `/job-preparation/candidate-responses/interview-responses/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};