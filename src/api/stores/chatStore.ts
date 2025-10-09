import { create } from 'zustand';
import { apiClient } from '@/api/axios';
import { CONNECTION_ENDPOINTS, MESSAGE_ENDPOINTS } from '@/api/endpoints/chatEndpoints';
import type {
  Connection,
  Message,
  SendConnectionRequestPayload,
  SendMessagePayload,
  GetConnectionsParams,
  GetMessagesParams,
  SendConnectionRequestResponse,
  RespondToConnectionResponse,
  GetConnectionsResponse,
  GetConnectionResponse,
  SendMessageResponse,
  GetMessagesResponse,
} from '@/api/types/chatTypes';
import { socketService } from '@/services/socket.service';
import toast from 'react-hot-toast';

interface ChatState {
  // Connections
  connections: Connection[];
  activeConnection: Connection | null;
  connectionsLoading: boolean;
  connectionsError: string | null;

  // Messages
  messages: Record<string, Message[]>; // connectionId -> messages[]
  messagesLoading: boolean;
  messagesError: string | null;

  // Typing indicators
  typingUsers: Record<string, Set<string>>; // connectionId -> Set of userIds

  // Actions - Connections
  fetchConnections: (params?: GetConnectionsParams) => Promise<void>;
  fetchConnection: (connectionId: string) => Promise<void>;
  sendConnectionRequest: (payload: SendConnectionRequestPayload) => Promise<Connection | null>;
  respondToConnection: (connectionId: string, status: 'accepted' | 'declined') => Promise<void>;
  setActiveConnection: (connection: Connection | null) => void;

  // Actions - Messages
  fetchMessages: (connectionId: string, params?: GetMessagesParams) => Promise<void>;
  sendMessage: (payload: SendMessagePayload) => Promise<void>;
  markMessagesAsRead: (connectionId: string, messageIds?: string[]) => Promise<void>;

  // Actions - Typing
  setTyping: (connectionId: string, isTyping: boolean) => void;

  // Actions - Socket
  initializeSocket: (token: string) => void;
  disconnectSocket: () => void;

  // Utility
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  connections: [],
  activeConnection: null,
  connectionsLoading: false,
  connectionsError: null,
  messages: {},
  messagesLoading: false,
  messagesError: null,
  typingUsers: {},

  // Fetch connections
  fetchConnections: async (params) => {
    set({ connectionsLoading: true, connectionsError: null });
    try {
      const response: GetConnectionsResponse = await apiClient.get(CONNECTION_ENDPOINTS.GET_CONNECTIONS, { params });
      
      // Sort connections by lastMessageAt (most recent first)
      const sortedConnections = response.data.connections.sort((a, b) => {
        const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.updatedAt).getTime();
        const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });
      
      set({ connections: sortedConnections, connectionsLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch connections';
      set({ connectionsError: errorMessage, connectionsLoading: false });
      toast.error(errorMessage);
    }
  },

  // Fetch single connection
  fetchConnection: async (connectionId) => {
    try {
      const response: GetConnectionResponse = await apiClient.get(CONNECTION_ENDPOINTS.GET_CONNECTION(connectionId));
      set({ activeConnection: response.data.connection });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch connection';
      toast.error(errorMessage);
    }
  },

  // Send connection request
  sendConnectionRequest: async (payload) => {
    try {
      const response: SendConnectionRequestResponse = await apiClient.post(CONNECTION_ENDPOINTS.SEND_REQUEST, payload);
      set((state) => ({
        connections: [response.data.connection, ...state.connections],
      }));
      toast.success('Connection request sent successfully');
      return response.data.connection;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send connection request';
      toast.error(errorMessage);
      return null;
    }
  },

  // Respond to connection request
  respondToConnection: async (connectionId, status) => {
    try {
      const response: RespondToConnectionResponse = await apiClient.put(CONNECTION_ENDPOINTS.RESPOND_REQUEST(connectionId), { status });
      set((state) => ({
        connections: state.connections.map((conn) =>
          conn._id === connectionId ? response.data.connection : conn
        ),
      }));
      
      // Show appropriate success message
      if (status === 'accepted') {
        toast.success('Connection accepted successfully');
      } else if (status === 'declined') {
        toast.success('Connection declined successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to respond to connection';
      toast.error(errorMessage);
    }
  },

  // Set active connection
  setActiveConnection: (connection) => {
    set({ activeConnection: connection });
    if (connection) {
      socketService.emitJoinConnection(connection._id);
      get().fetchMessages(connection._id);
    }
  },

  // Fetch messages
  fetchMessages: async (connectionId, params) => {
    set({ messagesLoading: true, messagesError: null });
    try {
      const response: GetMessagesResponse = await apiClient.get(MESSAGE_ENDPOINTS.GET_MESSAGES(connectionId), { params });
      set((state) => ({
        messages: {
          ...state.messages,
          [connectionId]: response.data.messages,
        },
        messagesLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
      set({ messagesError: errorMessage, messagesLoading: false });
      toast.error(errorMessage);
    }
  },

  // Send message
  sendMessage: async (payload) => {
    try {
      const response: SendMessageResponse = await apiClient.post(MESSAGE_ENDPOINTS.SEND_MESSAGE, payload);
      const newMessage = response.data.message;

      set((state) => ({
        messages: {
          ...state.messages,
          [payload.connectionId]: [
            ...(state.messages[payload.connectionId] || []),
            newMessage,
          ],
        },
        connections: state.connections.map((conn) =>
          conn._id === payload.connectionId
            ? { ...conn, lastMessageAt: newMessage.createdAt }
            : conn
        ),
      }));

      // Sort connections by lastMessageAt
      set((state) => ({
        connections: [...state.connections].sort((a, b) => {
          const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return bTime - aTime;
        }),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMessage);
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (connectionId, messageIds) => {
    try {
      await apiClient.put(MESSAGE_ENDPOINTS.MARK_AS_READ(connectionId), messageIds ? { messageIds } : undefined);
      
      set((state) => ({
        messages: {
          ...state.messages,
          [connectionId]: state.messages[connectionId]?.map((msg) =>
            msg.status !== 'read' && (!messageIds || messageIds.includes(msg._id))
              ? { ...msg, status: 'read' as const, readAt: new Date().toISOString() }
              : msg
          ) || [],
        },
      }));
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  },

  // Set typing indicator
  setTyping: (connectionId, isTyping) => {
    if (isTyping) {
      socketService.emitTyping(connectionId);
    } else {
      socketService.emitStopTyping(connectionId);
    }
  },

  // Initialize Socket.io
  initializeSocket: (token) => {
    socketService.connect(token);

    // New message event
    socketService.onNewMessage((data) => {
      const { message, connectionId } = data;
      
      set((state) => ({
        messages: {
          ...state.messages,
          [connectionId]: [...(state.messages[connectionId] || []), message],
        },
        connections: state.connections.map((conn) =>
          conn._id === connectionId
            ? { ...conn, lastMessageAt: message.createdAt }
            : conn
        ),
      }));

      // Sort connections by lastMessageAt
      set((state) => ({
        connections: [...state.connections].sort((a, b) => {
          const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return bTime - aTime;
        }),
      }));

      // Auto mark as read if connection is active
      const activeConnectionId = get().activeConnection?._id;
      if (activeConnectionId === connectionId) {
        get().markMessagesAsRead(connectionId, [message._id]);
      }
    });

    // Message read event
    socketService.onMessageRead((data) => {
      const { connectionId, messageIds } = data;
      
      set((state) => ({
        messages: {
          ...state.messages,
          [connectionId]: state.messages[connectionId]?.map((msg) =>
            messageIds.includes(msg._id)
              ? { ...msg, status: 'read' as const, readAt: new Date().toISOString() }
              : msg
          ) || [],
        },
      }));
    });

    // New connection event
    socketService.onNewConnection((data) => {
      set((state) => ({
        connections: [data.connection, ...state.connections],
      }));
      toast.success('New connection request received');
    });

    // Connection updated event (handles accept)
    socketService.onConnectionUpdated((data) => {
      const { connection } = data;
      
      set((state) => ({
        connections: state.connections.map((conn) =>
          conn._id === connection._id ? connection : conn
        ),
      }));
      
      // Don't show toast here - respondToConnection already shows it
    });

    // Connection deleted event (handles decline/cancel)
    socketService.onConnectionDeleted((data) => {
      const { connectionId } = data;
      
      set((state) => ({
        connections: state.connections.filter((conn) => conn && conn._id && conn._id !== connectionId),
        activeConnection: state.activeConnection?._id === connectionId ? null : state.activeConnection,
      }));
      
      // Don't show toast here - respondToConnection already shows it
    });

    // Typing events
    socketService.onUserTyping((data) => {
      set((state) => {
        const typingSet = new Set(state.typingUsers[data.connectionId] || []);
        typingSet.add(data.userId);
        return {
          typingUsers: {
            ...state.typingUsers,
            [data.connectionId]: typingSet,
          },
        };
      });
    });

    socketService.onUserStoppedTyping((data) => {
      set((state) => {
        const typingSet = new Set(state.typingUsers[data.connectionId] || []);
        typingSet.delete(data.userId);
        return {
          typingUsers: {
            ...state.typingUsers,
            [data.connectionId]: typingSet,
          },
        };
      });
    });
  },

  // Disconnect Socket.io
  disconnectSocket: () => {
    socketService.disconnect();
  },

  // Clear error
  clearError: () => {
    set({ connectionsError: null, messagesError: null });
  },
}));

