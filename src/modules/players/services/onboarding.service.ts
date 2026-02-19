import api from '../../../services/api';

export interface Avatar {
    id: string;
    name: string;
    imageUrl: string;
    gender: string;
    ageGroup: string;
    isActive: boolean;
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

export interface AvatarDto {
    name: string;
    imageUrl: string;
    gender: string;
    ageGroup: string;
    isActive?: boolean;
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
    },

    // Admin Methods
    getAllAvatarsAdmin: async (params?: any): Promise<{ data: Avatar[], meta: any }> => {
        const response = await api.get('/players/admin/avatars', { params });
        return response.data;
    },

    createAvatar: async (data: AvatarDto): Promise<Avatar> => {
        const response = await api.post('/players/admin/avatars', data);
        return response.data;
    },

    updateAvatar: async (id: string, data: Partial<AvatarDto>): Promise<Avatar> => {
        const response = await api.patch(`/players/admin/avatars/${id}`, data);
        return response.data;
    },

    deleteAvatar: async (id: string): Promise<void> => {
        await api.delete(`/players/admin/avatars/${id}`);
    }
};
