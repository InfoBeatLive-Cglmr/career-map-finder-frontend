// utils/updateResponse.ts
import { API_BASE_URL } from "./auth";


export interface UserItem {
  id: string;
  email?: string;
  fullName?: string;
  profileImage?: string;
  bio?: string;
  phoneNumber?: string;
  location?: string;
  academicLevel?: string;
  streamSpecialization?: string;
  fieldOfInterest?: string;
  institutionName?: string;
  graduationYear?: number | string;
  targetPercentage?: number | string;
  planType?: string;
  billingCycle?: string;
  nextBillingDate:string;
  lastPaymentDate:string;
  isAdmin?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  isSuspended?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  [key: string]: any;
}


export interface UpdateResponse {
  id: string;
  userId: string;
  careerUpdate?: string | null;
  assessmentUpdate?: string | null;
  interviewUpdate?: string | null;
  dashboardsUpdate?: string | null;
  settingsUpdate?: string | null;
  notificationUpdate?: string | null;
  createdAt: string;
  updatedAt: string;
  user:UserItem;
}

// For PATCH (you only send which field to update)
export type UpdateField =
  | "careerUpdate"
  | "assessmentUpdate"
  | "interviewUpdate"
  | "dashboardsUpdate"
  | "settingsUpdate"
  | "notificationUpdate";

//Create
//await updateResponseApi.create();

//Update (career section changed)
//await updateResponseApi.updateField(id, "careerUpdate");

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return { success: true } as unknown as T;
  }

  const data = await response.json();

  if (!response.ok || data.status === "error") {
    const errorMessage =
      data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const updateResponseApi = {
  // Create (auto sets all timestamps)
  async create(): Promise<{ status: string; data: UpdateResponse }> {
    const res = await fetch(`${API_BASE_URL}/update-responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<{ status: string; data: UpdateResponse }>(res);
  },

  // Get all (optionally user-scoped from backend)
  async getAll(): Promise<{ status: string; data: UpdateResponse[] }> {
    const res = await fetch(`${API_BASE_URL}/account/update-responses/update-responses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<{ status: string; data: UpdateResponse[] }>(res);
  },

  async getByUserId(userId: string): Promise<{ status: string; data: UpdateResponse[] }> {
  const res = await fetch(`${API_BASE_URL}/account/update-responses/update-responses/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ status: string; data: UpdateResponse[] }>(res);
},

  // Get one by ID
  async getById(id: string): Promise<{ status: string; data: UpdateResponse }> {
    const res = await fetch(`${API_BASE_URL}/account/update-responses/update-responses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<{ status: string; data: UpdateResponse }>(res);
  },

  // PATCH → update specific section timestamp
  async updateField(
    id: string,
    field: UpdateField
  ): Promise<{ status: string; data: UpdateResponse }> {
    const res = await fetch(`${API_BASE_URL}/account/update-responses/update-responses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field }),
    });

    return handleResponse<{ status: string; data: UpdateResponse }>(res);
  },

  // Delete
  async delete(id: string): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/account/update-responses/update-responses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<{ status: string; message: string }>(res);
  },
};