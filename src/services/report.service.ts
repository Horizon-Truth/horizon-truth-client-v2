import api from './api';

export interface CreateReportDto {
    title: string;
    description: string;
    contentType: string;
    sourceUrl?: string;
    language: string;
    priority?: string;
    tagIds?: string[];
}

export interface ReportTag {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
}

export interface Language {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
}

export const reportService = {
    async submitReport(data: CreateReportDto) {
        const response = await api.post('/reports', data);
        return response.data;
    },

    async getReportTags(all = false) {
        const params = all ? {} : { isActive: true };
        const response = await api.get('/report-tags', { params });
        return response.data;
    },

    async createReportTag(data: { name: string; slug: string; isActive?: boolean }) {
        const response = await api.post('/report-tags', data);
        return response.data;
    },

    async updateReportTag(id: string, data: { name?: string; slug?: string; isActive?: boolean }) {
        const response = await api.patch(`/report-tags/${id}`, data);
        return response.data;
    },

    async deleteReportTag(id: string) {
        const response = await api.delete(`/report-tags/${id}`);
        return response.data;
    },

    async getReports(params?: any) {
        const response = await api.get('/reports', { params });
        return response.data;
    },

    async getLanguages(all = false) {
        const params = all ? {} : { isActive: true };
        const response = await api.get('/languages', { params });
        return response.data;
    },

    async createLanguage(data: { name: string; code: string; isActive?: boolean }) {
        const response = await api.post('/languages', data);
        return response.data;
    },

    async updateLanguage(id: string, data: { name?: string; code?: string; isActive?: boolean }) {
        const response = await api.patch(`/languages/${id}`, data);
        return response.data;
    },

    async deleteLanguage(id: string) {
        const response = await api.delete(`/languages/${id}`);
        return response.data;
    }
};
