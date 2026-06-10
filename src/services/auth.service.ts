import api from './api';

export const authService = {
    async login(credentials: { email: string; password: string }) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async register(data: any) {
        const response = await api.post('/auth/register', data);