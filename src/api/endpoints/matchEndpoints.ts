// src/api/endpoints/matchEndpoints.ts

export const API_BASE = "/api";
export const API_MATCH_BASE = `${API_BASE}/match-users`;

export const MATCH_ENDPOINTS = {
  GET_MATCHES: `${API_MATCH_BASE}`,
  GENERATE_MESSAGE: (userId: string) => `${API_MATCH_BASE}/${userId}/message`,
  GET_USER_PROFILE: (userId: string) => `${API_MATCH_BASE}/profile/${userId}`,
};
