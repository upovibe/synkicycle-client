// src/stores/matchStore.ts

import { create } from 'zustand';
import { apiClient } from '@/api/axios';
import { MATCH_ENDPOINTS } from '@/api/endpoints/matchEndpoints';
import type { 
  GetMatchesResponse, 
  GenerateMessageRequest, 
  GenerateMessageResponse,
  GetUserProfileResponse,
  MatchResult 
} from '@/api/types/matchTypes';
import toast from 'react-hot-toast';

interface MatchState {
  matches: MatchResult[];
  loading: boolean;
  error: string | null;
}

interface MatchActions {
  fetchMatches: () => Promise<void>;
  generateConnectionMessage: (userId: string, connectionType?: 'professional' | 'social' | 'both') => Promise<string>;
  getUserProfile: (userId: string) => Promise<any>;
  clearError: () => void;
}

type MatchStore = MatchState & MatchActions;

export const useMatchStore = create<MatchStore>((set) => ({
  // State
  matches: [],
  loading: false,
  error: null,

  // Actions
  fetchMatches: async () => {
    set({ loading: true, error: null });
    
    try {
      const response: GetMatchesResponse = await apiClient.get(MATCH_ENDPOINTS.GET_MATCHES);
      
      if (response.success) {
        set({ matches: response.data.matches });
      } else {
        throw new Error(response.message || 'Failed to fetch matches');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch matches';
      set({ error: errorMessage });
      toast.error(`Error: ${errorMessage}`);
    } finally {
      set({ loading: false });
    }
  },

  generateConnectionMessage: async (userId: string, connectionType: 'professional' | 'social' | 'both' = 'both') => {
    try {
      const requestData: GenerateMessageRequest = { connectionType };
      const response: GenerateMessageResponse = await apiClient.post(
        MATCH_ENDPOINTS.GENERATE_MESSAGE(userId),
        requestData
      );
      
      if (response.success) {
        return response.data.message;
      } else {
        throw new Error(response.message || 'Failed to generate message');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate message';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getUserProfile: async (userId: string) => {
    try {
      const response: GetUserProfileResponse = await apiClient.get(
        MATCH_ENDPOINTS.GET_USER_PROFILE(userId)
      );
      
      if (response.success) {
        return response.data.user;
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user profile';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
}));
