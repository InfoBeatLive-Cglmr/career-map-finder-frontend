// utils/counseling.ts
import { API_BASE_URL, getAccessToken } from "./auth";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Counseling {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  country: string;
  state: string;
  academicStatus: string;
  targetUniversity?: string | null;
  fieldofStudy?: string | null;
  graduationYear?: string | null;
  primaryFocus: string;
  biggestPainPoint: string;
  questions: string;
  sessionMode: string;
  timeWindow: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCounselingInput {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  country: string;
  state: string;
  academicStatus: string;
  targetUniversity?: string;
  fieldofStudy?: string;
  graduationYear?: string;
  primaryFocus: string;
  biggestPainPoint: string;
  questions: string;
  sessionMode: string;
  timeWindow: string;
}

export interface UpdateCounselingInput {
  fullName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  academicStatus?: string;
  targetUniversity?: string;
  fieldofStudy?: string;
  graduationYear?: string;
  primaryFocus?: string;
  biggestPainPoint?: string;
  questions?: string;
  sessionMode?: string;
  timeWindow?: string;
}

// ==========================================
// HELPER FOR AUTHENTICATED FETCH
// ==========================================

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

  // Handle HTTP 204 No Content (Delete response)
  if (response.status === 204) {
    return { success: true } as unknown as T;
  }

  const data = await response.json();

  if (!response.ok || data.success === false) {
    const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const counselingApi = {
  /**
   * Get all counseling sessions
   */
  async getAll(): Promise<{ success: boolean; counselings: Counseling[] }> {
    return fetchWithAuth<{ success: boolean; counselings: Counseling[] }>("/account/counseling/counseling/get-all", {
      method: "GET",
    });
  },

  /**
   * Get a single counseling session by ID
   */
  async getById(id: string): Promise<{ success: boolean; counseling: Counseling }> {
    return fetchWithAuth<{ success: boolean; counseling: Counseling }>(`/account/counseling/counseling/get/${id}`, {
      method: "GET",
    });
  },

  /**
   * Create a new counseling session request
   */
  async create(data: CreateCounselingInput): Promise<{ success: boolean; newCounseling: Counseling }> {
    return fetchWithAuth<{ success: boolean; newCounseling: Counseling }>("/account/counseling/counseling/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing counseling record by ID
   */
  async update(id: string, data: UpdateCounselingInput): Promise<{ success: boolean; updatedCounseling: Counseling }> {
    return fetchWithAuth<{ success: boolean; updatedCounseling: Counseling }>(`/account/counseling/counseling/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a counseling session by ID
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return fetchWithAuth<{ success: boolean }>(`/account/counseling/counseling/delete/${id}`, {
      method: "DELETE",
    });
  },
};