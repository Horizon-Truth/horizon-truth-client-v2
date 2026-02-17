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

    async getReportTags() {
        const response = await api.get('/report-tags', { params: { isActive: true } });
        return response.data;
    },

    async getReports(params?: any) {
        const response = await api.get('/reports', { params });
        return response.data;
    },

    async getLanguages() {
        const response = await api.get('/languages', { params: { isActive: true } });
        return response.data;
    }
};
