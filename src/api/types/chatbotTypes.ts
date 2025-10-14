// Chatbot Types
export interface SuggestedUser {
  userId: string;
  name: string;
  username?: string;
  profession?: string;
  bio?: string;
  avatar?: string;
  matchScore?: number;
  reason?: string;
  connectionType?: 'professional' | 'social' | 'both';
  matchReason?: string;
}

export interface ChatMessageMetadata {
  suggestedUsers?: SuggestedUser[];
  actionType?: 'view_profile' | 'send_message' | 'add_interest' | 'improve_bio';
  actionData?: {
    userId?: string;
    message?: string;
    interest?: string;
    skill?: string;
  };
  profileScore?: number;
  profileSuggestions?: string[];
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderType: 'user' | 'ai';
  message: string;
  messageType: 'text' | 'suggestion' | 'action' | 'profile_analysis';
  metadata?: ChatMessageMetadata;
  timestamp: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  conversationId: string;
  userId: string;
  title?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  messageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response Types
export interface SendMessageRequest {
  message: string;
  conversationId?: string;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    response: {
      message: string;
      messageType: 'text' | 'suggestion' | 'action' | 'profile_analysis';
      metadata?: ChatMessageMetadata;
    };
    conversationId: string;
  };
  message?: string;
}

export interface GetConversationHistoryResponse {
  success: boolean;
  data: {
    messages: ChatMessage[];
    conversationId: string;
  };
  message?: string;
}

export interface GetUserConversationsResponse {
  success: boolean;
  data: {
    conversations: Conversation[];
  };
  message?: string;
}

export interface CreateConversationRequest {
  title?: string;
}

export interface CreateConversationResponse {
  success: boolean;
  data: {
    conversationId: string;
    title: string;
  };
  message?: string;
}

export interface GetSuggestionsResponse {
  success: boolean;
  data: {
    connectionSuggestions: {
      message: string;
      messageType: string;
      metadata?: ChatMessageMetadata;
    };
    profileSuggestions: {
      message: string;
      messageType: string;
      metadata?: ChatMessageMetadata;
    };
  };
  message?: string;
}

export interface MarkMessageAsReadResponse {
  success: boolean;
  message: string;
}

// Chatbot Store Types
export interface ChatbotState {
  // Current conversation
  currentConversationId: string | null;
  currentMessages: ChatMessage[];
  
  // All conversations
  conversations: Conversation[];
  
  // UI State
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  
  // Actions
  sendMessage: (message: string, conversationId?: string) => Promise<boolean>;
  getConversationHistory: (conversationId: string) => Promise<boolean>;
  getUserConversations: () => Promise<boolean>;
  createConversation: (title?: string) => Promise<string | null>;
  getSuggestions: () => Promise<boolean>;
  markMessageAsRead: (messageId: string) => Promise<boolean>;
  setCurrentConversation: (conversationId: string | null) => void;
  clearError: () => void;
}
