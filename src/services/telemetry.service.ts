import api from './api';

// Align with backend DTOs
export interface TelemetryPayload {
    session_id: string;
    session_context?: {
        player_id: string;
        level_id: string;
        content_id: string;
        device_type: 'mobile' | 'tablet' | 'desktop';
        network_state: 'offline' | 'poor' | 'good';
    };
    decision_outcome?: {
        player_decision_type?: 'trust' | 'distrust' | 'share' | 'ignore' | 'verify';