import api from './api';

/**
 * AI verification talks to the Horizon-Truth API, never to ai.horizontruth.org
 * directly — the backend owns that integration, so the UI stays decoupled from
 * the external contract and its response shape.
 */

export type AiVerificationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

/** Verdicts we style explicitly; the API may return others, handled as neutral. */
export type KnownAiVerdict = 'TRUE' | 'FALSE' | 'MIXED' | 'UNVERIFIED';

export interface AiVerificationSource {
    title: string;
    url: string;
    content?: string;
    /** Relevance in the 0–1 range, absent when the API did not provide one. */
    score?: number;
}

export interface AiVerification {
    id: string;
    reportId: string;
    /** The cleaned claim that was sent for analysis, not the report title. */
    claim: string;
    status: AiVerificationStatus;
    verdict?: KnownAiVerdict | string;
    confidence?: string;
    reasoning?: string;
    evidenceSummary?: string;
    sources?: AiVerificationSource[];
    provider?: string;
    model?: string;
    errorMessage?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export const aiVerificationService = {
    /** Current result for a report, or null when it has never been analysed. */
    async getVerification(reportId: string): Promise<AiVerification | null> {
        const response = await api.get(`/reports/${reportId}/ai-verification`);
        return response.data?.verification ?? null;
    },

    /**
     * Asks the backend to verify the report.
     *
     * Without `force` this is idempotent — an existing result comes back
     * unchanged and no external AI call is made, so mounting the page or
     * refreshing it cannot trigger repeat analyses.
     */
    async requestVerification(reportId: string, force = false): Promise<AiVerification | null> {
        const response = await api.post(`/reports/${reportId}/ai-verification`, { force });
        return response.data?.verification ?? null;
    },

    /** Every attempt, newest first. Moderator/admin only. */
    async getHistory(reportId: string): Promise<AiVerification[]> {
        const response = await api.get(`/reports/${reportId}/ai-verification/history`);
        return response.data?.attempts ?? [];
    },
};

/** True while an attempt is still being worked on and the UI should keep polling. */
export function isAiVerificationInProgress(verification: AiVerification | null | undefined): boolean {
    return verification?.status === 'PENDING' || verification?.status === 'PROCESSING';
}
