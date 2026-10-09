// utils/subscription.ts
import { API_BASE_URL, getAccessToken } from "./auth";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface User {
  id: string;
  email: string;
  name?: string | null;
  [key: string]: any;
}

export interface Subscription {
  id: string;
  userId: string;
  email: string;
  planType: string;
  billingCycle: string;
  amount: string;
  isActive?: boolean;
  isSuspended?: boolean;
  isBlocked?: boolean;
  trialEndsAt?: string | null;
  nextBillingDate?: string | null;
  lastPaymentDate?: string | null;
  cancellationDate?: string | null;
  periodStart?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface CreateSubscriptionInput {
  userId: string;
  email: string;
  planType: string;
  billingCycle: string;
  amount: string;
  isActive?: boolean;
  isSuspended?: boolean;
  isBlocked?: boolean;
  trialEndsAt?: string | Date;
  nextBillingDate?: string | Date;
  lastPaymentDate?: string | Date;
  cancellationDate?: string | Date;
  periodStart?: string | Date;
}

export interface UpdateSubscriptionInput {
  email?: string;
  planType?: string;
  billingCycle?: string;
  amount?: string;
  isActive?: boolean;
  isSuspended?: boolean;
  isBlocked?: boolean;
  trialEndsAt?: string | Date;
  nextBillingDate?: string | Date;
  lastPaymentDate?: string | Date;
  cancellationDate?: string | Date;
  periodStart?: string | Date;
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

  return data as T;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const subscriptionApi = {
  /**
   * Create a new subscription
   */
  async create(data: CreateSubscriptionInput): Promise<Subscription> {
    return fetchWithAuth<Subscription>("/account/subscription/subscriptions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get a single subscription by its ID
   */
  async getById(id: string): Promise<Subscription> {
    return fetchWithAuth<Subscription>(`/account/subscription/subscriptions/${id}`, {
      method: "GET",
    });
  },

  /**
   * Get all subscriptions for a specific user ID
   */
  async getByUserId(userId: string): Promise<Subscription[]> {
    return fetchWithAuth<Subscription[]>(`/account/subscription/subscriptions/user/${userId}`, {
      method: "GET",
    });
  },

  /**
   * Update an existing subscription by ID
   */
  async update(id: string, data: UpdateSubscriptionInput): Promise<Subscription> {
    return fetchWithAuth<Subscription>(`/account/subscription/subscriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a subscription by ID
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return fetchWithAuth<{ success: boolean }>(`/account/subscription/subscriptions/${id}`, {
      method: "DELETE",
    });
  },
};