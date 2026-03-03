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
        refetchInterval: 5000, // Refresh every 5 seconds for real-time status
    });
};
