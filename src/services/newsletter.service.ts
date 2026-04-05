import api from './api';

export interface NewsletterSubscription {
    id?: string;
    email: string;
    createdAt?: string;
}

export const newsletterService = {
    subscribe: async (email: string) => {
        const response = await api.post('/newsletter', { email });
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/newsletter');
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/newsletter/${id}`);
        return response.data;
    }
};
