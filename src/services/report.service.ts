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