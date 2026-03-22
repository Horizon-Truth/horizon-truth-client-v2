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
