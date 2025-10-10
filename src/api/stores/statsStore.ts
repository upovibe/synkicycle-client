import { create } from 'zustand';
import { apiClient } from '@/api/axios';
import { STATS_ENDPOINTS } from '@/api/endpoints/statsEndpoints';
import type { NetworkStats, UserActivity } from '@/api/types/statsTypes';
import toast from 'react-hot-toast';

interface StatsState {
  // Network stats
  networkStats: NetworkStats | null;
  networkStatsLoading: boolean;
  networkStatsError: string | null;

  // User activity
  userActivity: UserActivity | null;
  userActivityLoading: boolean;
  userActivityError: string | null;

  // Actions
  fetchNetworkStats: () => Promise<void>;
  fetchUserActivity: (days?: number) => Promise<void>;
  clearError: () => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  // Initial state
  networkStats: null,
  networkStatsLoading: false,
  networkStatsError: null,

  userActivity: null,
  userActivityLoading: false,
  userActivityError: null,

  // Fetch network statistics
  fetchNetworkStats: async () => {
    set({ networkStatsLoading: true, networkStatsError: null });
    try {
      const response = await apiClient.get(STATS_ENDPOINTS.NETWORK);
      
      // Check if response has the expected structure
      if (response.data.success && response.data.data) {
        set({
          networkStats: response.data.data,
          networkStatsLoading: false,
        });
      } else {
        // Try to use the response directly if it doesn't have the expected wrapper
        if (response.data && typeof response.data === 'object') {
          set({
            networkStats: response.data,
            networkStatsLoading: false,
          });
        } else {
          throw new Error('Invalid response structure');
        }
      }
    } catch (error) {
      console.error('Error fetching network stats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch network statistics';
      set({
        networkStatsError: errorMessage,
        networkStatsLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  // Fetch user activity
  fetchUserActivity: async (days = 7) => {
    set({ userActivityLoading: true, userActivityError: null });
    try {
      const response = await apiClient.get(`${STATS_ENDPOINTS.ACTIVITY}?days=${days}`);
      set({
        userActivity: response.data.data,
        userActivityLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user activity';
      set({
        userActivityError: errorMessage,
        userActivityLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  // Clear error
  clearError: () => {
    set({ networkStatsError: null, userActivityError: null });
  },
}));
