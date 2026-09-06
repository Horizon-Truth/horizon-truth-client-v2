import api from './api';

export const authService = {
    async login(credentials: { email: string; password: string }) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async register(data: any) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async logout() {
        await api.post('/auth/logout');
    },

    async initGuestSession(sessionId: string, userId: string) {
        const response = await api.post('/guest/session', { sessionId, userId });
        return response.data;
    },

    async forgotPassword(email: string) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(token: string, newPassword: string) {
        const response = await api.post('/auth/reset-password', { token, new_password: newPassword });
        return response.data;
    }
};
