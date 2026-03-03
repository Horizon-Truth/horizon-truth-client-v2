import api from './api';

export interface ContactSubmission {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    createdAt?: string;
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

    delete: async (id: string) => {
        const response = await api.delete(`/contacts/${id}`);
        return response.data;
    }
};
