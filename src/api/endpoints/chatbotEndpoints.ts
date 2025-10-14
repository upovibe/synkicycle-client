// Chatbot API Endpoints
export const CHATBOT_ENDPOINTS = {
  // Message endpoints
  SEND_MESSAGE: '/api/chatbot/message',
  MARK_MESSAGE_READ: (messageId: string) => `/api/chatbot/message/${messageId}/read`,
  
  // Conversation endpoints
  GET_CONVERSATION_HISTORY: (conversationId: string) => `/api/chatbot/conversation/${conversationId}`,
  GET_USER_CONVERSATIONS: '/api/chatbot/conversations',
  CREATE_CONVERSATION: '/api/chatbot/conversation',
  
  // Suggestion endpoints
  GET_SUGGESTIONS: '/api/chatbot/suggestions',
} as const;
