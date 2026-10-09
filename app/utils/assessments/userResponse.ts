// utils/userResponse.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface UserResponseItem {
  id: string;
  questionId: string;
  answerText?: string | null;
  selectedOptions: string[];
  timeSpentSeconds: number;
  createdAt: string;
  updatedAt: string;
  question?: Record<string, any>;
}

// ==========================================
// REQUEST DTOs
// ==========================================

export interface SubmitOrUpdateResponseInput {
  questionId: string;
  answerText?: string;
  selectedOptions?: string[];
  timeSpentSeconds?: number;
}

export interface UpdateUserResponseInput {
  questionId?: string;
  answerText?: string;
  selectedOptions?: string[];
  timeSpentSeconds?: number;
}

// ==========================================
// RESPONSE SCHEMAS
// ==========================================

export interface SingleResponseApiResponse {
  success: boolean;
  data: UserResponseItem;
  message?: string;
}

export interface MultipleResponseApiResponse {
  success: boolean;
  data: UserResponseItem[];
  message?: string;
}

export interface DeleteResponseApiResponse {
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

export const userResponseApi = {
  /**
   * Submit or update an answer response for a specific question (Upsert)
   */
  async submitOrUpdateResponse(
    data: SubmitOrUpdateResponseInput
  ): Promise<SingleResponseApiResponse> {
    return fetchWithAuth<SingleResponseApiResponse>("/assessment/user-response/assessment-responses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all user responses submitted for a specific question ID
   */
  async getResponsesByQuestion(
    questionId: string
  ): Promise<MultipleResponseApiResponse> {
    return fetchWithAuth<MultipleResponseApiResponse>(
      `/assessment/user-response/assessment-responses/question/${questionId}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Get a single user response by ID (includes question object)
   */
  async getResponseById(id: string): Promise<SingleResponseApiResponse> {
    return fetchWithAuth<SingleResponseApiResponse>(
      `/assessment/user-response/assessment-responses/${id}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Update an existing user response record manually
   */
  async updateResponse(
    id: string,
    data: UpdateUserResponseInput
  ): Promise<SingleResponseApiResponse> {
    return fetchWithAuth<SingleResponseApiResponse>(
      `/assessment/user-response/assessment-responses/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete a user response record by ID
   */
  async deleteResponse(id: string): Promise<DeleteResponseApiResponse> {
    return fetchWithAuth<DeleteResponseApiResponse>(
      `/assessment/user-response/assessment-responses/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};