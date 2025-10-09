// src/api/types/matchTypes.ts

// User interface for matches (public info only)
export interface MatchUser {
  id: string;
  uuid: string;
  username?: string;
  name?: string;
  profession?: string;
  bio?: string;
  interests?: string[];
  avatar?: string;
  verified: boolean;
  createdAt: string;
}

// Match result from AI
export interface MatchResult {
  user: MatchUser;
  matchScore: number;
  reason: string;
  connectionType: 'professional' | 'social' | 'both';
}

// Get matches response
export interface GetMatchesResponse {
  success: boolean;
  message: string;
  data: {
    matches: MatchResult[];
    totalUsers: number;
    matchesFound: number;
  };
}

// Generate connection message request
export interface GenerateMessageRequest {
  connectionType?: 'professional' | 'social' | 'both';
}

// Generate connection message response
export interface GenerateMessageResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    targetUser: {
      id: string;
      username?: string;
      name?: string;
    };
  };
}

// Get user profile response
export interface GetUserProfileResponse {
  success: boolean;
  data: {
    user: MatchUser;
  };
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
