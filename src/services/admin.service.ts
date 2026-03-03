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

export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    authorName: string;
    authorRole: string;
    authorAvatar?: string;
    imageUrl?: string;
    category: string;
    readTime: string;
    publishedAt: string;
    createdAt: string;
}

export interface Resource {
    id: string;
    title: string;
    slug: string;
    type: 'guide' | 'video' | 'course';
    description: string;
    duration: string;
    badge?: string;
    icon: string;
    fullContent?: string;
    linkUrl?: string;
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
        const response = await api.get('/users');
        return response.data;
    }

    async createUser(data: any) {
        const response = await api.post('/users', data);
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

    async getOrganizationById(id: string) {
        const response = await api.get(`/admin/organizations/${id}`);
        return response.data;
    }

    async createOrganization(data: any) {
        const response = await api.post('/admin/organizations', data);
        return response.data;
    }

    async getOrganizationUsers(orgId: string) {
        const response = await api.get(`/admin/organizations/${orgId}/users`);
        return response.data;
    }

    async addOrganizationUser(orgId: string, data: { userId: string; role: string }) {
        const response = await api.post(`/admin/organizations/${orgId}/users`, data);
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

    // Blog Methods
    async getBlogs() {
        const response = await api.get('/blogs');
        return response.data;
    }

    async getBlogById(id: string) {
        const response = await api.get(`/blogs/${id}`);
        return response.data;
    }

    async createBlog(data: Partial<Blog>) {
        const response = await api.post('/blogs', data);
        return response.data;
    }

    async updateBlog(id: string, data: Partial<Blog>) {
        const response = await api.patch(`/blogs/${id}`, data);
        return response.data;
    }

    async deleteBlog(id: string) {
        const response = await api.delete(`/blogs/${id}`);
        return response.data;
    }

    // Resource Methods
    async getResources() {
        const response = await api.get('/resources');
        return response.data;
    }

    async getResourceById(id: string) {
        const response = await api.get(`/resources/${id}`);
        return response.data;
    }

    async createResource(data: Partial<Resource>) {
        const response = await api.post('/resources', data);
        return response.data;
    }

    async updateResource(id: string, data: Partial<Resource>) {
        const response = await api.patch(`/resources/${id}`, data);
        return response.data;
    }

    async deleteResource(id: string) {
        const response = await api.delete(`/resources/${id}`);
        return response.data;
    }
}

export const adminService = new AdminService();
