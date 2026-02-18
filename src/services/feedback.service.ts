import api from './api';

export interface Feedback {
    id: string;
    scenarioId?: string;
    userId: string;
    assignedTo?: string;
    commentSource: string;
    commentText: string;
    requiredAction?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    type: 'SCENARIO' | 'OPERATION';
    deadline?: string;
    createdAt: string;
    updatedAt: string;
    scenario?: {
        id: string;
        title: string;
    };
    user?: {
        id: string;
        fullName: string;
        username: string;
    };
    assignee?: {
        id: string;
        fullName: string;
        username: string;
    };
}

export interface FeedbackStats {
    totalOpen: number;
    byPriority: {
        LOW?: number;
        MEDIUM?: number;
        HIGH?: number;
    };
    overdueItems: number;
}

class FeedbackService {
    async createFeedback(data: Partial<Feedback>) {
        const response = await api.post('/feedback', data);
        return response.data;
    }

    async getFeedbacks(params?: any) {
        const response = await api.get('/feedback', { params });
        return response.data;
    }

    async getFeedbackById(id: string) {
        const response = await api.get(`/feedback/${id}`);
        return response.data;
    }

    async updateFeedback(id: string, data: Partial<Feedback>) {
        const response = await api.patch(`/feedback/${id}`, data);
        return response.data;
    }

    async deleteFeedback(id: string) {
        const response = await api.delete(`/feedback/${id}`);
        return response.data;
    }

    async getStats() {
        const response = await api.get('/feedback/stats');
        return response.data;
    }
}

export const feedbackService = new FeedbackService();
