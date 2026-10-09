// utils/invoice.ts
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

export interface Invoice {
  id: string;
  userId: string;
  name: string;
  invoiceId: string;
  amount: string;
  status: string;
  planType: string;
  billingCycle: string;
  nextBillingDate: string;
  isCompleted: boolean;
  cardType?: string | null;
  cardNumber?: string | null;
  cardExpiry?: string | null;
  isPrimary: boolean;
  invoiceLink?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface CreateInvoiceInput {
  userId: string;
  name: string;
  invoiceId: string;
  amount: string;
  status: string;
  planType: string;
  billingCycle: string;
  nextBillingDate: string | Date;
  isCompleted?: boolean;
  cardType?: string;
  cardNumber?: string;
  cardExpiry?: string;
  isPrimary?: boolean;
  invoiceLink?: string;
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

export const invoiceApi = {
  /**
   * Create a new invoice
   */
  async create(data: CreateInvoiceInput): Promise<Invoice> {
    return fetchWithAuth<Invoice>("/account/invoice/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get a single invoice by its ID
   */
  async getById(id: string): Promise<Invoice> {
    return fetchWithAuth<Invoice>(`/account/invoice/invoices/${id}`, {
      method: "GET",
    });
  },

  /**
   * Get all invoices for a specific user ID
   */
  async getByUserId(userId: string): Promise<Invoice[]> {
    return fetchWithAuth<Invoice[]>(`/account/invoice/invoices/user/${userId}`, {
      method: "GET",
    });
  },

  /**
   * Delete an invoice by ID
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return fetchWithAuth<{ success: boolean }>(`/account/invoice/invoices/${id}`, {
      method: "DELETE",
    });
  },
};