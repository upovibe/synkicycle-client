import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  ChatbotState,
  ChatMessage,
  Conversation,
  SendMessageRequest,
  SendMessageResponse,
  GetConversationHistoryResponse,
  GetUserConversationsResponse,
  CreateConversationRequest,
  CreateConversationResponse,
  GetSuggestionsResponse,
  MarkMessageAsReadResponse
} from '@/api/types/chatbotTypes';
import { CHATBOT_ENDPOINTS } from '@/api/endpoints/chatbotEndpoints';
import { apiClient } from '@/api/axios';

interface ChatbotStore extends ChatbotState {
  // Actions
  sendMessage: (message: string, conversationId?: string) => Promise<boolean>;
  getConversationHistory: (conversationId: string) => Promise<boolean>;
  getUserConversations: () => Promise<boolean>;
  createConversation: (title?: string) => Promise<string | null>;
  getSuggestions: () => Promise<boolean>;
  markMessageAsRead: (messageId: string) => Promise<boolean>;
  
  // State setters
  setCurrentConversation: (conversationId: string | null) => void;
  setCurrentMessages: (messages: ChatMessage[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  setLoading: (loading: boolean) => void;
  setIsTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utilities
  clearError: () => void;
  reset: () => void;
  addMessage: (message: ChatMessage) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
}

export const useChatbotStore = create<ChatbotStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentConversationId: null,
      currentMessages: [],
      conversations: [],
      isLoading: false,
      isTyping: false,
      error: null,

      // Actions
      sendMessage: async (message: string, conversationId?: string) => {
        set({ error: null });
        
        try {
          const requestData: SendMessageRequest = {
            message,
            conversationId: conversationId || get().currentConversationId || undefined,
          };

          // Add user message immediately
          const userMessage: ChatMessage = {
            _id: `temp_${Date.now()}`,
            conversationId: conversationId || get().currentConversationId || 'temp',
            senderId: 'user',
            senderType: 'user',
            message,
            messageType: 'text',
            timestamp: new Date().toISOString(),
            isRead: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Add user message and show typing indicator
          set((state) => ({
            currentMessages: [...state.currentMessages, userMessage],
            isTyping: true,
          }));

          const response: SendMessageResponse = await apiClient.post(
            CHATBOT_ENDPOINTS.SEND_MESSAGE,
            requestData
          );

          if (response.success) {
            // Add AI response
            const aiMessage: ChatMessage = {
              _id: `temp_${Date.now() + 1}`,
              conversationId: response.data.conversationId,
              senderId: 'ai-assistant',
              senderType: 'ai',
              message: response.data.response.message,
              messageType: response.data.response.messageType,
              metadata: response.data.response.metadata,
              timestamp: new Date().toISOString(),
              isRead: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Update state with AI response and stop typing
            set((state) => ({
              currentConversationId: response.data.conversationId,
              currentMessages: [...state.currentMessages, aiMessage],
              isTyping: false,
            }));

            // Update conversations list
            get().getUserConversations();

            return true;
          } else {
            set({ error: response.message || 'Failed to send message', isTyping: false });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to send message';
          set({ error: errorMessage, isTyping: false });
          return false;
        }
      },

      getConversationHistory: async (conversationId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: GetConversationHistoryResponse = await apiClient.get(
            CHATBOT_ENDPOINTS.GET_CONVERSATION_HISTORY(conversationId)
          );

          if (response.success) {
            set({
              currentConversationId: conversationId,
              currentMessages: response.data.messages,
              isLoading: false,
            });
            return true;
          } else {
            set({ error: response.message || 'Failed to get conversation history', isLoading: false });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to get conversation history';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      getUserConversations: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response: GetUserConversationsResponse = await apiClient.get(
            CHATBOT_ENDPOINTS.GET_USER_CONVERSATIONS
          );

          if (response.success) {
            set({
              conversations: response.data.conversations,
              isLoading: false,
            });
            return true;
          } else {
            set({ error: response.message || 'Failed to get conversations', isLoading: false });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to get conversations';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      createConversation: async (title?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const requestData: CreateConversationRequest = { title };

          const response: CreateConversationResponse = await apiClient.post(
            CHATBOT_ENDPOINTS.CREATE_CONVERSATION,
            requestData
          );

          if (response.success) {
            const newConversation: Conversation = {
              _id: `temp_${Date.now()}`,
              conversationId: response.data.conversationId,
              userId: 'current-user', // This would be set from auth context
              title: response.data.title,
              messageCount: 0,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            set((state) => ({
              conversations: [newConversation, ...state.conversations],
              currentConversationId: response.data.conversationId,
              currentMessages: [],
              isLoading: false,
            }));

            return response.data.conversationId;
          } else {
            set({ error: response.message || 'Failed to create conversation', isLoading: false });
            return null;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to create conversation';
          set({ error: errorMessage, isLoading: false });
          return null;
        }
      },

      getSuggestions: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response: GetSuggestionsResponse = await apiClient.get(
            CHATBOT_ENDPOINTS.GET_SUGGESTIONS
          );

          if (response.success) {
            // Handle suggestions - could create a new conversation or update current one
            set({ isLoading: false });
            return true;
          } else {
            set({ error: response.message || 'Failed to get suggestions', isLoading: false });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to get suggestions';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      markMessageAsRead: async (messageId: string) => {
        try {
          const response: MarkMessageAsReadResponse = await apiClient.put(
            CHATBOT_ENDPOINTS.MARK_MESSAGE_READ(messageId)
          );

          if (response.success) {
            // Update message in current messages
            set((state) => ({
              currentMessages: state.currentMessages.map(msg =>
                msg._id === messageId ? { ...msg, isRead: true } : msg
              ),
            }));
            return true;
          } else {
            set({ error: response.message || 'Failed to mark message as read' });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to mark message as read';
          set({ error: errorMessage });
          return false;
        }
      },

      // State setters
      setCurrentConversation: (conversationId: string | null) => {
        set({ currentConversationId: conversationId });
        if (conversationId) {
          // Check if we already have messages for this conversation
          const currentState = get();
          const hasMessages = currentState.currentMessages.length > 0 && 
            currentState.currentMessages[0]?.conversationId === conversationId;
          
          if (!hasMessages) {
            get().getConversationHistory(conversationId);
          }
        } else {
          set({ currentMessages: [] });
        }
      },

      setCurrentMessages: (messages: ChatMessage[]) => {
        set({ currentMessages: messages });
      },

      setConversations: (conversations: Conversation[]) => {
        set({ conversations });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setIsTyping: (isTyping: boolean) => {
        set({ isTyping });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Utilities
      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          currentConversationId: null,
          currentMessages: [],
          conversations: [],
          isLoading: false,
          isTyping: false,
          error: null,
        });
      },

      addMessage: (message: ChatMessage) => {
        set((state) => ({
          currentMessages: [...state.currentMessages, message],
        }));
      },

      updateConversation: (conversationId: string, updates: Partial<Conversation>) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.conversationId === conversationId ? { ...conv, ...updates } : conv
          ),
        }));
      },
    }),
    {
      name: 'chatbot-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        currentMessages: state.currentMessages,
      }),
    }
  )
);
