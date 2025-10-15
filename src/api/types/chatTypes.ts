// Connection Types
export interface Connection {
  _id: string;
  uuid: string;
  participants: User[];
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  initiator: User;
  initialMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name?: string;
  username?: string;
  email: string;
  avatar?: string;
  verified?: boolean;
}

// Message Types
export interface Message {
  _id: string;
  uuid: string;
  connectionId: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read' | 'sending' | 'failed';
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Request Types
export interface SendConnectionRequestPayload {
  receiverId: string;
  message?: string;
}

export interface RespondToConnectionPayload {
  status: 'accepted' | 'declined';
}

export interface SendMessagePayload {
  connectionId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'system';
}

export interface MarkMessagesAsReadPayload {
  messageIds?: string[];
}

export interface GetConnectionsParams {
  status?: 'pending' | 'accepted' | 'declined' | 'all';
  page?: number;
  limit?: number;
}

export interface GetMessagesParams {
  page?: number;
  limit?: number;
  before?: string;
}

// API Response Types
export interface SendConnectionRequestResponse {
  success: boolean;
  message: string;
  data: {
    connection: Connection;
  };
}

export interface RespondToConnectionResponse {
  success: boolean;
  message: string;
  data: {
    connection: Connection;
  };
}

export interface GetConnectionsResponse {
  success: boolean;
  message: string;
  data: {
    connections: Connection[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  };
}

export interface GetConnectionResponse {
  success: boolean;
  message: string;
  data: {
    connection: Connection;
  };
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: {
    message: Message;
  };
}

export interface GetMessagesResponse {
  success: boolean;
  message: string;
  data: {
    messages: Message[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  };
}

export interface MarkMessagesAsReadResponse {
  success: boolean;
  message: string;
  data: {
    modifiedCount: number;
  };
}

// Socket Event Types
export interface SocketMessageEvent {
  message: Message;
  connectionId: string;
}

export interface SocketConnectionEvent {
  connection: Connection;
  type: 'new' | 'accepted' | 'declined';
}

export interface SocketTypingEvent {
  connectionId: string;
  userId: string;
  isTyping: boolean;
}

export interface SocketReadEvent {
  connectionId: string;
  messageIds: string[];
  readBy: string;
}

// Unread Count Types
export interface UnreadCountItem {
  connectionId: string;
  unreadCount: number;
}

export interface GetUnreadCountsResponse {
  success: boolean;
  message: string;
  data: {
    unreadCounts: UnreadCountItem[];
    totalUnread: number;
  };
}

export interface SocketUnreadCountsEvent {
  unreadCounts: UnreadCountItem[];
  totalUnread: number;
}

export interface SocketUnreadCountUpdateEvent {
  connectionId: string;
  unreadCount: number;
  action: 'increment' | 'decrement';
}

