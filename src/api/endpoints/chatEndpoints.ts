import axios from '../axios';
import {
  SendConnectionRequestPayload,
  SendConnectionRequestResponse,
  RespondToConnectionPayload,
  RespondToConnectionResponse,
  GetConnectionsParams,
  GetConnectionsResponse,
  GetConnectionResponse,
  SendMessagePayload,
  SendMessageResponse,
  GetMessagesParams,
  GetMessagesResponse,
  MarkMessagesAsReadPayload,
  MarkMessagesAsReadResponse,
} from '../types/chatTypes';

// Connection Endpoints
export const sendConnectionRequest = async (
  payload: SendConnectionRequestPayload
): Promise<SendConnectionRequestResponse> => {
  const response = await axios.post('/api/connections/send', payload);
  return response.data;
};

export const respondToConnectionRequest = async (
  connectionId: string,
  payload: RespondToConnectionPayload
): Promise<RespondToConnectionResponse> => {
  const response = await axios.put(`/api/connections/${connectionId}/respond`, payload);
  return response.data;
};

export const getUserConnections = async (
  params?: GetConnectionsParams
): Promise<GetConnectionsResponse> => {
  const response = await axios.get('/api/connections', { params });
  return response.data;
};

export const getConnection = async (connectionId: string): Promise<GetConnectionResponse> => {
  const response = await axios.get(`/api/connections/${connectionId}`);
  return response.data;
};

// Message Endpoints
export const sendMessage = async (payload: SendMessagePayload): Promise<SendMessageResponse> => {
  const response = await axios.post('/api/messages/send', payload);
  return response.data;
};

export const getMessages = async (
  connectionId: string,
  params?: GetMessagesParams
): Promise<GetMessagesResponse> => {
  const response = await axios.get(`/api/messages/${connectionId}`, { params });
  return response.data;
};

export const markMessagesAsRead = async (
  connectionId: string,
  payload?: MarkMessagesAsReadPayload
): Promise<MarkMessagesAsReadResponse> => {
  const response = await axios.put(`/api/messages/${connectionId}/read`, payload);
  return response.data;
};

