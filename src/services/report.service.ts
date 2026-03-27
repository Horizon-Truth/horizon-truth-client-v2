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