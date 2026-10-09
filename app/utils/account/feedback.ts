// utils/feedback.ts
import { API_BASE_URL } from "./auth";

// ==========================================
// TYPES
// ==========================================

export interface Feedback {
  id: string;
  fullName: string;
  email?: string | null;
  reason: string;
  statement: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackInput {
  fullName: string;
  email?: string;
  reason: string;
  statement: string;
  rating: number;
}

export interface UpdateFeedbackInput {
  fullName?: string;
  email?: string;
  reason?: string;
  statement?: string;
  rating?: number;
}

// ==========================================
// HELPER FOR FETCH & ERROR HANDLING
// ==========================================

async function handleResponse<T>(response: Response): Promise<T> {
  // 204 No Content handling (for delete)
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

export const feedbackApi = {
  
  // Create new feedback
  async create(data: CreateFeedbackInput): Promise<{ success: boolean; newFeedback: Feedback }> {
    const res = await fetch(`${API_BASE_URL}/account/feedback/feedbacks/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; newFeedback: Feedback }>(res);
  },

  // Get all feedback records
  async getAll(): Promise<{ success: boolean; feedbacks: Feedback[] }> {
    const res = await fetch(`${API_BASE_URL}/account/feedback/feedbacks/get-all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse<{ success: boolean; feedbacks: Feedback[] }>(res);
  },

  // Get single feedback by ID
  async getById(id: string): Promise<{ success: boolean; feedback: Feedback }> {
    const res = await fetch(`${API_BASE_URL}/account/feedback/feedbacks/get/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse<{ success: boolean; feedback: Feedback }>(res);
  },

  // Update feedback by ID
  async update(id: string, data: UpdateFeedbackInput): Promise<{ success: boolean; updatedFeedback: Feedback }> {
    const res = await fetch(`${API_BASE_URL}/account/feedback/feedbacks/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; updatedFeedback: Feedback }>(res);
  },

  // Delete feedback by ID
  async delete(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/account/feedback/feedbacks/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse<{ success: boolean }>(res);
  },
};
