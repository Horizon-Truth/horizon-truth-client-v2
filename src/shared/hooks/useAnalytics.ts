import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface AnalyticsStats {
    overview: {
        users: number;
        organizations: number;
        players: number;
        scenarios: number;
        feedback: number;
        blogs: number;
        resources: number;
        contacts: number;
        guestPlays: number;
        reports: number;
    };
    distributions: {
        organizations: Record<string, number>;
        feedback: Record<string, number>;
    };
    contentBreakdown: {
        blogs: number;
        resources: number;
    };
}

export interface SystemHealth {
    status: 'HEALTHY' | 'UNHEALTHY';
    uptime: number;
    memory: {
        heapTotal: number;
        heapUsed: number;
        rss: number;
    };
    database: string;
    timestamp: string;
    version: string;
    environment: string;
}

export interface GamePlayAnalytics {
    overview: {
        totalSessions: number;
        uniquePlayers: number;
        avgScore: number;
        avgAccuracy: number;
        completionRate: number;
    };
    trend: Array<{ date: string; count: number }>;
    popularity: Array<{ name: string; count: number }>;
    distributions: {
        outcomes: Record<string, number>;
        difficulties: Record<string, number>;
    };
}

export interface RecentSession {
    id: string;
    score: number;
    outcome: string;
    createdAt: string;
    scenarioTitle: string;
    playerName: string;
}

export const useAnalyticsStats = () => {
    return useQuery<AnalyticsStats>({
        queryKey: ['analytics-stats'],
        queryFn: async () => {
            const response = await api.get('/analytics/stats');
            return response.data;
        },
    });
};

export const useSystemHealth = () => {
    return useQuery<SystemHealth>({
        queryKey: ['system-health'],
        queryFn: async () => {
            const response = await api.get('/analytics/health');
            return response.data;
        },
        refetchInterval: 5000, 
    });
};

export const useGamePlayAnalytics = () => {
    return useQuery<GamePlayAnalytics>({
        queryKey: ['gameplay-analytics'],
        queryFn: async () => {
            const response = await api.get('/analytics/gameplay');
            return response.data;
        },
    });
};

export const useRecentSessions = (limit: number = 10) => {
    return useQuery<RecentSession[]>({
        queryKey: ['recent-sessions', limit],
        queryFn: async () => {
            const response = await api.get('/analytics/gameplay/recent', { params: { limit } });
            return response.data;
        },
    });
};
