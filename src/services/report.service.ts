import api from './api';

export interface CreateReportDto {
    title: string;
    description: string;
    contentType: string;
    sourceUrl?: string;
    language: string;
    reason?: string;
    category?: string;
    reportedContentReference?: string;
    evidenceLinks?: string[];
    relatedReportIds?: string[];
    priority?: string;
    tagIds?: string[];
}

export interface ReportTag {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    icon?: string;
    color?: string;
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