// src/api/types/authTypes.ts

// User interface matching backend User model
export interface User {
  _id: string;
  uuid: string;
  email: string;
  username?: string;
  name?: string;
  bio?: string;
  profession?: string;
  interests?: string[];
  avatar?: string;
  socketId?: string;
  verified: boolean;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

// Register request
export interface RegisterRequest {
  email: string;
  password: string;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Register response
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Login response
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Get profile response
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

// Update profile request
export interface UpdateProfileRequest {
  username?: string;
  name?: string;
  bio?: string;
  profession?: string;
  interests?: string[];
  avatar?: string;
}

// Update profile response
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  tokenExpiry: number | null;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    message: string;
    code?: string;
  };
}
