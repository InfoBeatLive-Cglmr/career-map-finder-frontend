// utils/notification.ts
import { API_BASE_URL, getAccessToken } from "./auth";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Notification {
  id: string;
  userId?: string | null;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationInput {
  userId?: string;
  title: string;
  description: string;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAllReadResponse {
  count: number;
  message: string;
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
    const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const notificationApi = {
  /**
   * Create a new notification
   */
  async create(data: CreateNotificationInput): Promise<Notification> {
    return fetchWithAuth<Notification>("/account/notification/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get latest 10 notifications for a specific user
   */
  async getByUser(userId: string): Promise<Notification[]> {
    return fetchWithAuth<Notification[]>(`/account/notification/notifications/user/${userId}`, {
      method: "GET",
    });
  },

  /**
   * Get unread notification count for a specific user
   */
  async getUnreadCount(userId: string): Promise<UnreadCountResponse> {
    return fetchWithAuth<UnreadCountResponse>(`/account/notification/notifications/unread/count/${userId}`, {
      method: "GET",
    });
  },

  /**
   * Mark a single notification as read by ID
   */
  async markAsRead(id: string): Promise<Notification> {
    return fetchWithAuth<Notification>(`/account/notification/notifications/read/${id}`, {
      method: "PUT",
    });
  },

  /**
   * Mark all unread notifications as read for a specific user
   */
  async markAllAsRead(userId: string): Promise<MarkAllReadResponse> {
    return fetchWithAuth<MarkAllReadResponse>(`/account/notification/notifications/read-all/${userId}`, {
      method: "PUT",
    });
  },

  /**
   * Delete a notification by ID
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return fetchWithAuth<{ success: boolean }>(`/account/notification/notifications/${id}`, {
      method: "DELETE",
    });
  },
};