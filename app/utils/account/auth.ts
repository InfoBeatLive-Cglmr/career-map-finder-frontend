import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export const getAccessToken = (): string | null => Cookies.get('accessToken') || null;

export const setTokensAndUserId = (accessToken: string | null, refreshToken: string | null, userId: string | null): void => {
    if (accessToken) {
        Cookies.set('accessToken', accessToken, { expires: 30 });
    }
    if (userId) {
        Cookies.set('userId', userId, { expires: 30 });
    }
    if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 30 });
    }
};

 export const BASE_URL: string =  'http://localhost:8080/api';

 
 export const API_BASE_URL: string =  'http://localhost:8080/api';

 export const SOCKET_BASE_URL: string =  'http://localhost:8080'; 

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

export interface RegisterRequest {
    email: string;
    fullName: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdatePasswordRequest {
    email: string;
    newPassword: string;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    error?: string;
}

export const auth = {
    register: async (data: RegisterRequest): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>('/account/auth/register/register', data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>('/account/auth/login/login', data);
        return response.data;
    },

    updatePassword: async (data: UpdatePasswordRequest): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>('/account/auth/forgotPassword/update-password', data);
        return response.data;
    },
};

interface LogoutResponse {
  message: string;
  error: string;
}

export const logout = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const response: AxiosResponse<LogoutResponse> = await axios.post(`${BASE_URL}/account/auth/logout/logout`);

    if (response.status === 200) {
      const responseData = response.data;

      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('userId', { path: '/' });
      Cookies.remove('isAuthenticated', { path: '/', });

      return { success: true, message: responseData.message };
    } else {
      console.error('Error during logout:', response.data.error);
      throw new Error(response.data.error || 'Failed to logout');
    }
  } catch (error:any) {
    console.error('Error during logout:', error.message);
    throw new Error('Failed to logout');
  }
};