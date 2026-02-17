import api from './api';

export interface User {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    status: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface Organization {
    id: string;
    name: string;
    description: string;
    country: string;
    status: string;
    createdAt: string;
}

export interface PlayerProfile {
    id: string;
    nickname: string;
    trustScoreInitial: number;
    onboardingCompleted: boolean;
    user?: User;
}

class AdminService {
    async getUsers() {
        const response = await api.get('/admin/users');
        return response.data;
    }

    async updateUserStatus(id: string, status: string) {
        const response = await api.put(`/admin/users/${id}/status`, { status });
        return response.data;
    }

    async deleteUser(id: string) {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    }

    async getOrganizations() {
        const response = await api.get('/admin/organizations');
        return response.data;
    }

    async updateOrganizationStatus(id: string, status: string) {
        const response = await api.put(`/admin/organizations/${id}/status`, { status });
        return response.data;
    }

    async getPlayerProfiles() {
        const response = await api.get('/admin/players');
        return response.data;
    }
}

export const adminService = new AdminService();
