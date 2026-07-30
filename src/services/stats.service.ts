import api from './api';

export interface PublicStats {
    activeUsers: number;
    reportsDebunked: number;
    verifiers: number;
    accuracyRate: number;
}

export const statsService = {
    getPublicStats: async (): Promise<PublicStats> => {
        const response = await api.get('/public/stats');
        return response.data;
    },
};
