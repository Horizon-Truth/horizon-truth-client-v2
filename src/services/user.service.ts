import api from './api';

export interface UpdateProfileData {
    fullName?: string;
    username?: string;
    phone?: string;
    preferredLanguage?: string;
}

export const userService = {
    async getProfile() {
        const response = await api.get('/users/me');
        return response.data;
    },

    async updateProfile(data: UpdateProfileData) {
        const response = await api.put('/users/me/profile', data);
        return response.data;
    },

    async getPreferences() {
        const response = await api.get('/users/me/preferences');
        return response.data;
    },

    async updatePreferences(data: any) {
        const response = await api.put('/users/me/preferences', data);
        return response.data;
    }
};
