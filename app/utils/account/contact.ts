import { API_BASE_URL } from "./auth";

export interface Contact {
  id: string;
  name: string;
  email: string;
  reason: string;
  statement: string;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface CreateContactPayload {
  name: string;
  email: string;
  reason: string;
  statement: string;
}

export interface UpdateContactPayload {
  name?: string;
  email?: string;
  reason?: string;
  statement?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  [key: string]: any;
}

export interface GetAllContactsResponse extends ApiResponse<Contact[]> {
  contacts: Contact[];
}

export interface GetContactByIdResponse extends ApiResponse<Contact> {
  contact: Contact;
}

export interface CreateContactResponse extends ApiResponse<Contact> {
  newContact: Contact;
}

export interface UpdateContactResponse extends ApiResponse<Contact> {
  updatedContact: Contact;
}

export interface DeleteContactResponse extends ApiResponse<Contact> {
  contact: Contact;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Reusable Core Fetch Wrapper
 */
async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content gracefully
    if (response.status === 204) {
      return { success: true } as unknown as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || data.message || "An unexpected API error occurred",
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      (error as Error).message || "Network error or server unreachable",
      500
    );
  }
}


/**
 * Create a new contact submission
 * @route POST /contacts/create
 */
export async function createContact(
  payload: CreateContactPayload
): Promise<CreateContactResponse> {
  return apiClient<CreateContactResponse>("/account/contact/contacts/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


/**
 * Fetch all contact messages
 * @route GET /contacts/get-all
 */
export async function getAllContacts(): Promise<GetAllContactsResponse> {
  return apiClient<GetAllContactsResponse>("/account/contact/contacts/get-all", {
    method: "GET",
    cache: "no-store", // Useful for Next.js SSR/App Router dynamic fetching
  });
}

/**
 * Fetch a single contact message by ID
 * @route GET /contacts/get/:id
 */
export async function getContactById(
  id: string
): Promise<GetContactByIdResponse> {
  if (!id) throw new Error("Contact ID is required");

  return apiClient<GetContactByIdResponse>(`/account/contact/contacts/get/${id}`, {
    method: "GET",
    cache: "no-store",
  });
}

/**
 * Update an existing contact message
 * @route PUT /contacts/update/:id
 */
export async function updateContact(
  id: string,
  payload: UpdateContactPayload
): Promise<UpdateContactResponse> {
  if (!id) throw new Error("Contact ID is required");

  return apiClient<UpdateContactResponse>(`/account/contact/contacts/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a contact message by ID
 * @route DELETE /contacts/delete/:id
 */
export async function deleteContact(
  id: string
): Promise<DeleteContactResponse> {
  if (!id) throw new Error("Contact ID is required");

  return apiClient<DeleteContactResponse>(`/account/contact/contacts/delete/${id}`, {
    method: "DELETE",
  });
}
