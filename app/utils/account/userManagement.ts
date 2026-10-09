// utils/userManagement.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

// ==========================================
// TYPES & INTERFACES
// ==========================================

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

// ==========================================
// REQUEST DTOs & QUERY PARAMS
// ==========================================

export interface GetAllUsersQueryParams {
  searchQuery?: string;
  cursor?: string;
  limit?: number;
}

export interface UpdateUserInput {
  email?: string;
  fullName?: string;
  profileImage?: string;
  bio?: string;
  password?: string;
  phoneNumber?: string;
  location?: string;
  academicLevel?: string;
  streamSpecialization?: string;
  fieldOfInterest?: string;
  institutionName?: string;
  graduationYear?: number | string;
  targetPercentage?: number | string;

  isAdmin?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  isSuspended?: boolean;
}

// ==========================================
// RESPONSE SCHEMAS
// ==========================================

export interface GetAllUsersApiResponse {
  success: boolean;
  allUsers: UserItem[];
  nextCursor: string | null;
  error?: string;
}

export interface SingleUserApiResponse {
  success: boolean;
  currentUser: UserItem;
  error?: string;
}

export interface BasicUserMutationApiResponse {
  success: boolean;
  message: string;
  error?: string;
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
      data.error ||
      data.message ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const userManagementApi = {
  /**
   * Fetch all users with optional search query and cursor pagination
   */
  async getAllUsers(
    params: GetAllUsersQueryParams = {}
  ): Promise<GetAllUsersApiResponse> {
    const queryParams = new URLSearchParams();

    if (params.searchQuery) {
      queryParams.append("searchQuery", params.searchQuery);
    }
    if (params.cursor) {
      queryParams.append("cursor", params.cursor);
    }
    if (params.limit !== undefined) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/getAllUsers${queryString ? `?${queryString}` : ""}`;

    return fetchWithAuth<GetAllUsersApiResponse>(endpoint, {
      method: "GET",
    });
  },

  /**
   * Fetch a single user's information by user ID
   */
  async getUserInfo(
    userId: string
  ): Promise<SingleUserApiResponse> {
    return fetchWithAuth<SingleUserApiResponse>(
      `/userInfo/${userId}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Update a user account by user ID
   */
  async updateUser(
    userId: string,
    data: UpdateUserInput
  ): Promise<BasicUserMutationApiResponse> {
    return fetchWithAuth<BasicUserMutationApiResponse>(
      `/update-user/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Soft-delete a user account by user ID
   */
  async deleteAccount(
    userId: string
  ): Promise<BasicUserMutationApiResponse> {
    return fetchWithAuth<BasicUserMutationApiResponse>(
      `/deleteAccount/${userId}`,
      {
        method: "DELETE",
      }
    );
  },
};