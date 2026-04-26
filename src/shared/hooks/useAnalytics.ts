import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface AnalyticsStats {
    overview: {
        users: number;
        organizations: number;
        players: number;
        scenarios: number;
        feedback: number;
        blogs: number;