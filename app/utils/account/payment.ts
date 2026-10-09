import { API_BASE_URL, getAccessToken } from "./auth";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface CreateCheckoutInput {
  email: string;
  userId: string;
  amount: number | string;
  type: string; // e.g. "Basic", "Plus", "Pro"
  billingCycle: string; // e.g. "monthly", "yearly"
}

export interface CheckoutResponse {
  checkoutUrl: string;
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

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.message || data.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const paymentApi = {
  // ------------------------------------------
  // BASIC TIER
  // ------------------------------------------
  
  /**
   * Create Basic Monthly Checkout Session
   */
  async createBasicMonthlyCheckout(data: CreateCheckoutInput): Promise<CheckoutResponse> {
    return fetchWithAuth<CheckoutResponse>("/account/payment/create-checkout/basic/monthly", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Create Basic Yearly Checkout Session
   */
  async createBasicYearlyCheckout(data: CreateCheckoutInput): Promise<CheckoutResponse> {
    return fetchWithAuth<CheckoutResponse>("/account/payment/create-checkout/basic/yearly", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ------------------------------------------
  // PLUS TIER
  // ------------------------------------------

  /**
   * Create Plus Monthly Checkout Session
   */
  async createPlusMonthlyCheckout(data: CreateCheckoutInput): Promise<CheckoutResponse> {
    return fetchWithAuth<CheckoutResponse>("/account/payment/create-checkout/plus/monthly", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Create Plus Yearly Checkout Session
   */
  async createPlusYearlyCheckout(data: CreateCheckoutInput): Promise<CheckoutResponse> {
    return fetchWithAuth<CheckoutResponse>("/account/payment/create-checkout/plus/yearly", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ------------------------------------------
  // PRO TIER
  // ------------------------------------------

  /**
   * Create Pro Monthly Checkout Session
   */
  async createProMonthlyCheckout(data: CreateCheckoutInput): Promise<CheckoutResponse> {
    return fetchWithAuth<CheckoutResponse>("/account/payment/create-checkout/pro/monthly", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Create Pro Yearly Checkout Session
   */
  async createProYearlyCheckout(data: CreateCheckoutInput): Promise<CheckoutResponse> {
    return fetchWithAuth<CheckoutResponse>("/account/payment/create-checkout/pro/yearly", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};