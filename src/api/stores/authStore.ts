// src/api/stores/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AuthState,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  User
} from '@/api/types/authTypes';
import { AUTH_ENDPOINTS } from '@/api/endpoints/authEndpoints';
import { apiClient } from '@/api/axios';

interface AuthStore extends AuthState {
  // Actions
  register: (credentials: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  getProfile: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: UpdateProfileRequest) => Promise<{ success: boolean; error?: string }>;
  
  // State setters
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAccessToken: (token: string | null) => void;
  setTokenExpiry: (expiry: number | null) => void;
  
  // Utilities
  clearAuth: () => void;
  reset: () => void;
  isTokenExpired: () => boolean;
  getStoredToken: () => string | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      accessToken: null,
      tokenExpiry: null,

      // Actions
      register: async (credentials: RegisterRequest) => {
        set({ loading: true, error: null });
        
        try {
          const response: RegisterResponse = await apiClient.post(
            AUTH_ENDPOINTS.REGISTER,
            credentials
          );

          if (response.success) {
            const { user, token } = response.data;
            const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

            set({
              user,
              isAuthenticated: true,
              accessToken: token,
              tokenExpiry: expiry,
              loading: false,
              error: null,
            });

            return { success: true };
          } else {
            set({ loading: false, error: 'Registration failed' });
            return { success: false, error: 'Registration failed' };
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      login: async (credentials: LoginRequest) => {
        set({ loading: true, error: null });
        
        try {
          const response: LoginResponse = await apiClient.post(
            AUTH_ENDPOINTS.LOGIN,
            credentials
          );

          if (response.success) {
            const { user, token } = response.data;
            const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

            set({
              user,
              isAuthenticated: true,
              accessToken: token,
              tokenExpiry: expiry,
              loading: false,
              error: null,
            });

            return { success: true };
          } else {
            set({ loading: false, error: 'Login failed' });
            return { success: false, error: 'Login failed' };
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        
        try {
          // Call logout endpoint if needed
          // await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
          
          // Clear local state
          set({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            tokenExpiry: null,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (error: any) {
          // Even if API call fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            tokenExpiry: null,
            loading: false,
            error: null,
          });
          return { success: true };
        }
      },

      getProfile: async () => {
        set({ loading: true, error: null });
        
        try {
          const response: ProfileResponse = await apiClient.get(AUTH_ENDPOINTS.ME);

          if (response.success) {
            set({
              user: response.data.user,
              loading: false,
              error: null,
            });

            return { success: true };
          } else {
            set({ loading: false, error: 'Failed to fetch profile' });
            return { success: false, error: 'Failed to fetch profile' };
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      updateProfile: async (data: UpdateProfileRequest) => {
        set({ loading: true, error: null });
        
        try {
          const response: UpdateProfileResponse = await apiClient.patch(
            AUTH_ENDPOINTS.PROFILE,
            data
          );

          if (response.success) {
            set({
              user: response.data.user,
              loading: false,
              error: null,
            });

            return { success: true };
          } else {
            set({ loading: false, error: 'Failed to update profile' });
            return { success: false, error: 'Failed to update profile' };
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to update profile';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // State setters
      setUser: (user: User | null) => set({ user }),
      setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      setAccessToken: (accessToken: string | null) => set({ accessToken }),
      setTokenExpiry: (tokenExpiry: number | null) => set({ tokenExpiry }),

      // Utilities
      clearAuth: () => set({
        user: null,
        isAuthenticated: false,
        accessToken: null,
        tokenExpiry: null,
        error: null,
      }),

      reset: () => set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        accessToken: null,
        tokenExpiry: null,
      }),

      isTokenExpired: () => {
        const { tokenExpiry } = get();
        return tokenExpiry ? Date.now() > tokenExpiry : true;
      },

      getStoredToken: () => {
        const { accessToken } = get();
        return accessToken;
      },
    }),
    {
      name: 'synkicycle-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        tokenExpiry: state.tokenExpiry,
      }),
    }
  )
);