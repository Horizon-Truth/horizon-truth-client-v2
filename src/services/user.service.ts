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

    async getMyStats() {
        const response = await api.get('/players/stats/me');
        return response.data;
    },

    async getMyLearningProfile(): Promise<{
        skillBook: Record<string, { xp: number; correct: number; total: number }>;
        calibration: Record<string, { correct: number; total: number }>;
    }> {
        const response = await api.get('/players/learning-profile/me');
        return response.data;
    },

    /** Sync the local ledgers; the server merges element-wise max and returns the result. */
    async saveMyLearningProfile(profile: {
        skillBook: Record<string, { xp: number; correct: number; total: number }>;
        calibration: Record<string, { correct: number; total: number }>;
    }) {
        const response = await api.put('/players/learning-profile/me', profile);
        return response.data;
    },

    async getPreferences() {
        const response = await api.get('/users/me/preferences');
        return response.data;
    },

    async updatePreferences(data: any) {
        const response = await api.put('/users/me/preferences', data);
        return response.data;
    },

    async anonymizeAccount() {
        const response = await api.post('/users/me/anonymize');
        return response.data;
    }
};

