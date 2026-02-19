import api from '../../../services/api';

export interface Avatar {
    id: string;
    name: string;
    imageUrl: string;
    gender: string;
    ageGroup: string;
}

export interface Region {
    id: string;
    name: string;
    description: string;
}

export interface InitializeProfileDto {
    nickname: string;
    avatarId: string;
    fictionalRegionId?: string;
}

export const onboardingService = {
    getAvatars: async (): Promise<Avatar[]> => {
        const response = await api.get('/players/avatars');
        return response.data;
    },

    getRegions: async (): Promise<Region[]> => {
        const response = await api.get('/players/regions');
        return response.data;
    },

    initializeProfile: async (data: InitializeProfileDto) => {
        const response = await api.post('/players/initialize', data);
        return response.data;
    },

    getMyProfile: async () => {
        const response = await api.get('/players/profile/me');
        return response.data;
    }
};
