import { API_BASE_URL, getAccessToken } from "./auth";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Earning {
  id: string;
  userId: string;
  planType: string;
  billingCycle: string;
  nextBillingDate: string; // ISO Date string from backend
  status: string;
  isCompleted: boolean;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEarningInput {
  planType: string;
  billingCycle: string;
  nextBillingDate: string | Date;
  status: string;
  isCompleted?: boolean;
  amount?: number;
}

export interface UpdateEarningInput {
  planType?: string;
  billingCycle?: string;
  nextBillingDate?: string | Date;
  status?: string;
  isCompleted?: boolean;
  amount?: number;
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

  if (!response.ok) {
    const errorMessage =
      data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const earningApi = {
  /**
   * Create a new earning record for a specific user
   */
  async create(userId: string, data: CreateEarningInput): Promise<Earning> {
    return fetchWithAuth<Earning>(`/account/earning/earn/${userId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Fetch all earning records
   */
  async getAll(): Promise<Earning[]> {
    return fetchWithAuth<Earning[]>("/account/earning/earn/get", {
      method: "GET",
    });
  },

  /**
   * Fetch a single earning record by ID
   */
  async getById(id: string): Promise<Earning> {
    return fetchWithAuth<Earning>(`/account/earning/earn/get/${id}`, {
      method: "GET",
    });
  },

  /**
   * Update an existing earning record by ID
   */
  async update(id: string, data: UpdateEarningInput): Promise<Earning> {
    return fetchWithAuth<Earning>(`/account/earning/earn/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an earning record by ID
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return fetchWithAuth<{ success: boolean }>(`/account/earning/earn/delete/${id}`, {
      method: "DELETE",
    });
  },
};