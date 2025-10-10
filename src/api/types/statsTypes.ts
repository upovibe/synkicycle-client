export interface NetworkStats {
  connections: {
    total: number;
    pending: number;
    recent: number;
  };
  messages: {
    sent: number;
    received: number;
    total: number;
    unread: number;
  };
  matchScore: number;
  lastUpdated: string;
}

export interface ActivityData {
  _id: string;
  count: number;
}

export interface UserActivity {
  messages: ActivityData[];
  connections: ActivityData[];
  period: {
    start: string;
    end: string;
    days: number;
  };
}

export interface GetNetworkStatsResponse {
  success: boolean;
  message: string;
  data: NetworkStats;
}

export interface GetUserActivityResponse {
  success: boolean;
  message: string;
  data: UserActivity;
}

