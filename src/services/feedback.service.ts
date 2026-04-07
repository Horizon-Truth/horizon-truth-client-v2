import api from './api';

export interface Feedback {
    id: string;
    scenarioId?: string;
    userId: string;
    assignedTo?: string;
    commentSource: string;