// utils/alert.ts
import { API_BASE_URL, getAccessToken } from "./auth";

// ==========================================
// ENUMS & TYPES
// ==========================================

export type AlertCategory = "STUDENT" | "EXAM_CANDIDATE" | "JOB_SEEKER";

export type AlertFrequency = "DAILY" | "WEEKLY" | "MILESTONE_DRIVEN";

export type PreferredChannel = "EMAIL" | "WHATSAPP" | "IN_APP_PUSH";

export type RegistrationStatus = "REGISTERED" | "PREPARING_TO_REGISTER" | "AWAITING_RESULTS";

// ==========================================
// INTERFACES
// ==========================================

export interface AlertResponse {
  id: string;
  alertId: string;
  title?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  language: string;
  category: AlertCategory;
  targetGoalName: string;
  targetDate: string;
  preferredFrequency: AlertFrequency;
  notificationChannel: PreferredChannel;
  contactEmail: string;
  contactPhone?: string | null;
  academicStream?: string | null;
  targetMajorOrDegree?: string | null;
  currentWeeklyStudyHours?: number | null;
  weakestSubjects: string[];
  examName?: string | null;
  examRegistrationStatus?: RegistrationStatus | null;
  targetScoreGoal?: string | null;
  priorityTopics: string[];
  targetRoleTitle?: string | null;
  targetCompaniesCount?: number | null;
  weeklyApplicationGoal?: number | null;
  focusInterviewSkill: string[];
  dailyCommitmentMinutes: number;
  preferredAlertTime: string;
  autoPauseOnInactivity: boolean;
  additionalContextNotes?: string | null;
  isactive: boolean;
  isClose: boolean;
  lastSendingDate: string;
  createdAt: string;
  updatedAt: string;
  alertResponse?: AlertResponse[];
}

export interface CreateAlertInput {
  userId: string;
  language?: string;
  category: AlertCategory;
  targetGoalName: string;
  targetDate: string; // ISO DateTime string
  preferredFrequency: AlertFrequency;
  notificationChannel: PreferredChannel;
  contactEmail: string;
  contactPhone?: string;
  academicStream?: string;
  targetMajorOrDegree?: string;
  currentWeeklyStudyHours?: number;
  weakestSubjects?: string[];
  examName?: string;
  examRegistrationStatus?: RegistrationStatus;
  targetScoreGoal?: string;
  priorityTopics?: string[];
  targetRoleTitle?: string;
  targetCompaniesCount?: number;
  weeklyApplicationGoal?: number;
  focusInterviewSkill?: string[];
  dailyCommitmentMinutes: number;
  preferredAlertTime: string; // "HH:mm" 24-hour format
  autoPauseOnInactivity?: boolean;
  additionalContextNotes?: string;
}

export type UpdateAlertInput = Partial<CreateAlertInput>;

export interface SubmitCheckInInput {
  alertId: string;
  description: string;
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

  // Handle HTTP 204 No Content
  if (response.status === 204) {
    return { success: true } as unknown as T;
  }

  const data = await response.json();

  if (!response.ok || data.status === "error") {
    const errorMessage = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const alertApi = {
  /**
   * Create a new alert milestone configuration
   */
  async create(data: CreateAlertInput): Promise<{ status: string; data: Alert }> {
    return fetchWithAuth<{ status: string; data: Alert }>("/alerts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all active & past alerts for a specific user ID
   */
  async getByUserId(userId: string): Promise<{ status: string; data: Alert[] }> {
    return fetchWithAuth<{ status: string; data: Alert[] }>(`/alerts/user/${userId}`, {
      method: "GET",
    });
  },

  /**
   * Get a single alert record by Alert ID
   */
  async getById(id: string): Promise<{ status: string; data: Alert }> {
    return fetchWithAuth<{ status: string; data: Alert }>(`/alerts/${id}`, {
      method: "GET",
    });
  },

  /**
   * Update an existing alert configuration by Alert ID
   */
  async update(id: string, data: UpdateAlertInput): Promise<{ status: string; data: Alert }> {
    return fetchWithAuth<{ status: string; data: Alert }>(`/alerts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an alert configuration by Alert ID
   */
  async delete(id: string): Promise<{ status: string; message: string }> {
    return fetchWithAuth<{ status: string; message: string }>(`/alerts/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Submit a 60-second progress check-in response to update AI focus context
   */
  async submitCheckIn(data: SubmitCheckInInput): Promise<{ status: string; data: AlertResponse }> {
    return fetchWithAuth<{ status: string; data: AlertResponse }>("/alerts/response/checkin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};