import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

import api from './api';
import { aiVerificationService, isAiVerificationInProgress } from './ai-verification.service';
import type { AiVerification } from './ai-verification.service';

const mockApi = api as unknown as Record<'get' | 'post', ReturnType<typeof vi.fn>>;

beforeEach(() => {
    vi.clearAllMocks();
});

describe('aiVerificationService', () => {
    it('reads the current verification through the Horizon-Truth API', async () => {
        mockApi.get.mockResolvedValue({ data: { verification: { id: 'attempt-1' } } });

        const result = await aiVerificationService.getVerification('report-1');

        expect(mockApi.get).toHaveBeenCalledWith('/reports/report-1/ai-verification');
        expect(result).toEqual({ id: 'attempt-1' });
    });

    it('returns null for a report that was never analysed', async () => {
        mockApi.get.mockResolvedValue({ data: { verification: null } });

        await expect(aiVerificationService.getVerification('legacy')).resolves.toBeNull();
    });

    it('tolerates an unexpected response envelope', async () => {
        mockApi.get.mockResolvedValue({ data: undefined });

        await expect(aiVerificationService.getVerification('report-1')).resolves.toBeNull();
    });

    it('requests verification without forcing a re-run by default', async () => {
        mockApi.post.mockResolvedValue({ data: { verification: { id: 'attempt-1' } } });

        await aiVerificationService.requestVerification('report-1');

        expect(mockApi.post).toHaveBeenCalledWith('/reports/report-1/ai-verification', {
            force: false,
        });
    });

    it('forces a new attempt when re-verification is requested', async () => {
        mockApi.post.mockResolvedValue({ data: { verification: { id: 'attempt-2' } } });

        await aiVerificationService.requestVerification('report-1', true);

        expect(mockApi.post).toHaveBeenCalledWith('/reports/report-1/ai-verification', {
            force: true,
        });
    });

    it('never calls the external AI service directly', async () => {
        mockApi.get.mockResolvedValue({ data: { verification: null } });
        mockApi.post.mockResolvedValue({ data: { verification: null } });

        await aiVerificationService.getVerification('report-1');
        await aiVerificationService.requestVerification('report-1');

        const calledPaths = [...mockApi.get.mock.calls, ...mockApi.post.mock.calls].map(
            (call) => call[0] as string,
        );
        expect(calledPaths.every((path) => path.startsWith('/reports/'))).toBe(true);
    });

    it('lists attempt history for moderators', async () => {
        mockApi.get.mockResolvedValue({ data: { attempts: [{ id: 'a2' }, { id: 'a1' }] } });

        const history = await aiVerificationService.getHistory('report-1');

        expect(mockApi.get).toHaveBeenCalledWith('/reports/report-1/ai-verification/history');
        expect(history).toHaveLength(2);
    });
});

describe('isAiVerificationInProgress', () => {
    it('is true only while an attempt is unfinished', () => {
        expect(isAiVerificationInProgress({ status: 'PENDING' } as AiVerification)).toBe(true);
        expect(isAiVerificationInProgress({ status: 'PROCESSING' } as AiVerification)).toBe(true);
        expect(isAiVerificationInProgress({ status: 'COMPLETED' } as AiVerification)).toBe(false);
        expect(isAiVerificationInProgress({ status: 'FAILED' } as AiVerification)).toBe(false);
        expect(isAiVerificationInProgress(null)).toBe(false);
    });
});
