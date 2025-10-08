// src/api/endpoints/authEndpoints.ts

export const API_BASE = "/api";
export const API_AUTH_BASE = `${API_BASE}/auth`;

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_AUTH_BASE}/register`,
  LOGIN: `${API_AUTH_BASE}/login`,
  ME: `${API_AUTH_BASE}/me`,
  PROFILE: `${API_AUTH_BASE}/profile`,
};

// Socket.io related endpoints
export const SOCKET_ENDPOINTS = {
  CONNECTED_USERS: `${API_BASE}/socket/connected-users`,
  USER_ONLINE: `${API_BASE}/socket/user/:userId/online`,
  NOTIFY_USER: `${API_BASE}/socket/notify/:userId`,
  BROADCAST: `${API_BASE}/socket/broadcast`,
};
