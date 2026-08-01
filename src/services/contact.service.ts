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
    message: string;
    status?: ContactStatus;
    repliedAt?: string | null;
    replies?: ContactReply[];
    createdAt?: string;
}

export interface ReplyPayload {
    subject?: string;
    message: string;
}

export const contactService = {
    submit: async (data: ContactSubmission) => {
        const response = await api.post('/contacts', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/contacts');
        return response.data;
    },

    getOne: async (id: string): Promise<ContactSubmission> => {
        const response = await api.get(`/contacts/${id}`);
        return response.data;
    },

    markAsRead: async (id: string): Promise<ContactSubmission> => {
        const response = await api.patch(`/contacts/${id}/read`);
        return response.data;
    },

    reply: async (id: string, data: ReplyPayload): Promise<ContactReply> => {
        const response = await api.post(`/contacts/${id}/reply`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/contacts/${id}`);
        return response.data;
    }
};
