import api from './api';

export type ContactStatus = 'new' | 'read' | 'replied';

export interface ContactReply {
    id: string;