// src/hooks/useMatches.ts

import { useState, useEffect } from 'react';
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

export const useMatches = () => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: GetMatchesResponse = await apiClient.get(MATCH_ENDPOINTS.GET_MATCHES);
      
      if (response.success) {
        setMatches(response.data.matches);
        toast.success(`Found ${response.data.matchesFound} matches!`);
      } else {
        throw new Error(response.message || 'Failed to fetch matches');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch matches';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateConnectionMessage = async (userId: string, connectionType: 'professional' | 'social' | 'both' = 'both') => {
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
  };

  const getUserProfile = async (userId: string) => {
    try {
      const response: GetUserProfileResponse = await apiClient.get(
        MATCH_ENDPOINTS.GET_USER_PROFILE(userId)
      );
      
      if (response.success) {
        return response.data.user;
      } else {
        throw new Error(response.message || 'Failed to fetch user profile');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user profile';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Load matches on mount
  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    fetchMatches,
    generateConnectionMessage,
    getUserProfile,
  };
};
