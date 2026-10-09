import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { getAccessToken } from './auth';
import { setTokensAndUserId } from './auth';
import { BASE_URL } from './auth';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        try {
            const accessToken = getAccessToken();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error('Error retrieving access token:', error);
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

export interface OtpRequest {
    email: string;
    otp: string;
}

export interface OtpResponse {
    success: boolean;
    message: string;
    accessToken?: string;
    userId?: string;
    error?: string;
    companyId?:string
}

export interface ApiResponse {
    success: boolean;
    message: string;
    error?: string;
}


export interface ApiResponse {
    success: boolean;
    message: string;
    error?: string;
}

const handleAuthResponse = (response: OtpResponse): void => {
  const { message, error, accessToken, userId, companyId } = response;


  if (message) {
    console.log(message);

    const now = new Date().toISOString();

    if (accessToken && userId && companyId) {
      Cookies.set('accessToken', accessToken, { path: '/', expires: 30 }); 
      Cookies.set('userId', userId, { path: '/', expires: 30 });
      Cookies.set('isAuthenticated', 'true', { path: '/', expires: 30 });

      Cookies.set('lastCareerUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastAssessmentUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastInterviewUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastDashboardsUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastSettingsUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastNotificationUpdate', now, { path: '/', expires: 30 });

    }
  } else if (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const otpAuth = {
    verifySignUpOtp: async (data: OtpRequest): Promise<OtpResponse> => {
        const response = await api.post<OtpResponse>('/account/auth/verify/verifySignUpOtp', data);
        if (response.data.success && response.data.accessToken && response.data.userId) {
            setTokensAndUserId(response.data.accessToken, null, response.data.userId);
        }
        const result = response.data;
        handleAuthResponse(result);
        return result;
    },

    resendSignUpOtp: async (data: { email: string }): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>('/account/auth/verify/resendSignUpOtp', data);
        return response.data;
    },

    verifySignInOtp: async (data: OtpRequest): Promise<OtpResponse> => {
        const response = await api.post<OtpResponse>('/account/auth/verify/verifySignInOtp', data);
        if (response.data.success && response.data.accessToken && response.data.userId) {
            setTokensAndUserId(response.data.accessToken, null, response.data.userId);
        }
        const result = response.data;
        handleAuthResponse(result);
        return result;
    },

    resendSignInOtp: async (data: { email: string }): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>('/account/auth/verify/resend/SignInOtp', data);
        return response.data;
    },

    verifyUpdatePasswordOtp: async (data: OtpRequest): Promise<OtpResponse> => {
        const response = await api.post<OtpResponse>('/account/auth/verify/verifyUpdatePasswordOtp', data);
        if (response.data.success && response.data.accessToken && response.data.userId) {
            setTokensAndUserId(response.data.accessToken, null, response.data.userId);
        }
        const result = response.data;
        handleAuthResponse(result);
        return result;
    },

    resendUpdatePasswordOtp: async (data: { email: string }): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>('/account/auth/verify/resendUpdatePasswordOtp', data);
        return response.data;
    },
};
