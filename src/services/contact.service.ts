import api from './api';

export type ContactStatus = 'new' | 'read' | 'replied';

export interface ContactReply {
    id: string;
    contactId: string;
    subject: string;
    message: string;
    sentByEmail: string;
    sentByUserId: string | null;
    createdAt: string;
}

export interface ContactSubmission {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;