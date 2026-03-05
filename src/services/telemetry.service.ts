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
        share_clicked?: boolean;
        share_channel_type?: 'public' | 'private' | 'group';
        share_count?: number;
        forward_count?: number;
        share_with_context?: boolean;
        estimated_audience_size?: number;
        re_share_enabled?: boolean;
    };
    content_consumption?: {
        scroll_depth_percent?: number;
        text_dwell_time_ms?: number;
        paragraphs_viewed?: number;
        back_scroll_count?: number;
    };
    verification?: {
        source_button_clicked_count?: number;
        learn_more_opened?: boolean;
        fact_panel_views?: number;
        external_link_clicked?: boolean;
        profile_checked?: boolean;
        verification_start_timestamp?: string;
        verification_end_timestamp?: string;
        verification_time_ms?: number;
        verification_sequence_length?: number;
    };
    response_timing?: {
        content_shown_timestamp?: string;
        first_action_timestamp?: string;
        final_decision_timestamp?: string;
        time_to_first_action_ms?: number;
        time_to_final_decision_ms?: number;
    };
}

class TelemetryService {
    // In-memory accumulation per session_id
    private buffer: Record<string, Partial<TelemetryPayload>> = {};

    private getSessionId(progressId: string, sceneId: string) {
        return `${progressId}_${sceneId}`;
    }

    // Helper to get or init buffer payload
    private getPayload(sessionId: string): Partial<TelemetryPayload> {
        if (!this.buffer[sessionId]) {
            this.buffer[sessionId] = { session_id: sessionId };
        }
        return this.buffer[sessionId];
    }

    trackContext(progressId: string, sceneId: string, context: TelemetryPayload['session_context']) {
        const sessionId = this.getSessionId(progressId, sceneId);
        const payload = this.getPayload(sessionId);
        payload.session_context = { ...payload.session_context, ...context } as any;