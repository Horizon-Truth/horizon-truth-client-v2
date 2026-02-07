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
        decision_confidence_level?: number;
        decision_changed?: boolean;
        decision_change_count?: number;
    };
    social_context?: {
        social_context_exposed?: 'none' | 'peer' | 'authority' | 'famous';
        social_metrics_visible?: boolean;
        like_count_shown?: number;
        share_count_shown?: number;
        comment_count_shown?: number;
        highlighted_comment_type?: string;
        authority_badge_visible?: boolean;
    };
    dissemination?: {