// src/api/endpoints/chatEndpoints.ts

export const API_BASE = "/api";
export const API_CONNECTION_BASE = `${API_BASE}/connections`;
export const API_MESSAGE_BASE = `${API_BASE}/messages`;

// Connection Endpoints
export const CONNECTION_ENDPOINTS = {
  SEND_REQUEST: `${API_CONNECTION_BASE}/send`,
  RESPOND_REQUEST: (connectionId: string) => `${API_CONNECTION_BASE}/${connectionId}/respond`,
  GET_CONNECTIONS: `${API_CONNECTION_BASE}`,
  GET_CONNECTION: (connectionId: string) => `${API_CONNECTION_BASE}/${connectionId}`,
};

// Message Endpoints
export const MESSAGE_ENDPOINTS = {
  SEND_MESSAGE: `${API_MESSAGE_BASE}/send`,
  GET_MESSAGES: (connectionId: string) => `${API_MESSAGE_BASE}/${connectionId}`,
  MARK_AS_READ: (connectionId: string) => `${API_MESSAGE_BASE}/${connectionId}/read`,
  GET_UNREAD_COUNTS: `${API_MESSAGE_BASE}/unread/count`,
};

