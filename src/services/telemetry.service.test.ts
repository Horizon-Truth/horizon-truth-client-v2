import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('./api', () => ({
    default: { post: vi.fn() },
}));

import api from './api';
import { telemetryService } from './telemetry.service';

const mockPost = (api as unknown as { post: ReturnType<typeof vi.fn> }).post;

/** The buffer keys on `${progressId}_${sceneId}`. */
const PROGRESS = 'progress-1';
const SCENE = 'scene-1';

const lastPayload = () => mockPost.mock.calls.at(-1)?.[1];

beforeEach(() => {
    vi.clearAllMocks();
    mockPost.mockResolvedValue({ data: {} });
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('telemetryService', () => {
    it('does not call the API until the session is flushed', async () => {
        telemetryService.trackDecision(PROGRESS, SCENE, {
            player_decision_type: 'trust',
        });

        expect(mockPost).not.toHaveBeenCalled();
    });

    it('posts the accumulated payload to /telemetry/record on flush', async () => {
        telemetryService.trackDecision(PROGRESS, SCENE, {
            player_decision_type: 'verify',
        });

        await telemetryService.flush(PROGRESS, SCENE);

        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost.mock.calls[0][0]).toBe('/telemetry/record');
        expect(lastPayload()).toMatchObject({
            session_id: `${PROGRESS}_${SCENE}`,
            decision_outcome: { player_decision_type: 'verify' },
        });
    });

    it('merges every tracked facet into a single payload', async () => {
        telemetryService.trackContext(PROGRESS, SCENE, {
            player_id: 'p1',
            level_id: 'l1',
            content_id: 'c1',
            device_type: 'mobile',
            network_state: 'good',
        });
        telemetryService.trackDecision(PROGRESS, SCENE, { decision_confidence_level: 3 });
        telemetryService.trackSocialContext(PROGRESS, SCENE, { like_count_shown: 42 });
        telemetryService.trackDissemination(PROGRESS, SCENE, { share_clicked: true });
        telemetryService.trackConsumption(PROGRESS, SCENE, { scroll_depth_percent: 80 });
        telemetryService.trackVerification(PROGRESS, SCENE, { fact_panel_views: 2 });
        telemetryService.trackTiming(PROGRESS, SCENE, { time_to_final_decision_ms: 1500 });

        await telemetryService.flush(PROGRESS, SCENE);

        expect(lastPayload()).toMatchObject({
            session_context: { player_id: 'p1', device_type: 'mobile' },
            decision_outcome: { decision_confidence_level: 3 },
            social_context: { like_count_shown: 42 },
            dissemination: { share_clicked: true },
            content_consumption: { scroll_depth_percent: 80 },
            verification: { fact_panel_views: 2 },
            response_timing: { time_to_final_decision_ms: 1500 },
        });
    });

    it('merges repeated calls to the same facet instead of replacing it', async () => {
        telemetryService.trackDecision(PROGRESS, SCENE, {
            player_decision_type: 'trust',
        });
        telemetryService.trackDecision(PROGRESS, SCENE, { decision_changed: true });

        await telemetryService.flush(PROGRESS, SCENE);

        expect(lastPayload().decision_outcome).toEqual({
            player_decision_type: 'trust',
            decision_changed: true,
        });
    });

    it('lets a later value overwrite an earlier one for the same field', async () => {
        telemetryService.trackDecision(PROGRESS, SCENE, { decision_change_count: 1 });
        telemetryService.trackDecision(PROGRESS, SCENE, { decision_change_count: 3 });

        await telemetryService.flush(PROGRESS, SCENE);

        expect(lastPayload().decision_outcome.decision_change_count).toBe(3);
    });

    it('keeps separate scenes in separate buffers', async () => {
        telemetryService.trackDecision(PROGRESS, 'scene-a', {
            player_decision_type: 'trust',
        });
        telemetryService.trackDecision(PROGRESS, 'scene-b', {
            player_decision_type: 'ignore',
        });

        await telemetryService.flush(PROGRESS, 'scene-a');
        expect(lastPayload().session_id).toBe(`${PROGRESS}_scene-a`);
        expect(lastPayload().decision_outcome.player_decision_type).toBe('trust');

        await telemetryService.flush(PROGRESS, 'scene-b');
        expect(lastPayload().session_id).toBe(`${PROGRESS}_scene-b`);
        expect(lastPayload().decision_outcome.player_decision_type).toBe('ignore');
    });

    it('is a no-op when flushing a session that was never tracked', async () => {
        await telemetryService.flush('unknown', 'unknown');

        expect(mockPost).not.toHaveBeenCalled();
    });

    it('clears the buffer so a second flush sends nothing', async () => {
        telemetryService.trackDecision(PROGRESS, SCENE, {
            player_decision_type: 'share',
        });

        await telemetryService.flush(PROGRESS, SCENE);
        await telemetryService.flush(PROGRESS, SCENE);

        expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('swallows a failed post so telemetry never breaks gameplay', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockPost.mockRejectedValue(new Error('offline'));

        telemetryService.trackDecision(PROGRESS, SCENE, {
            player_decision_type: 'trust',
        });

        await expect(
            telemetryService.flush(PROGRESS, SCENE),
        ).resolves.toBeUndefined();
        expect(consoleError).toHaveBeenCalled();
    });

    it('still clears the buffer after a failed post', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        mockPost.mockRejectedValue(new Error('offline'));

        telemetryService.trackDecision(PROGRESS, SCENE, {
            player_decision_type: 'trust',
        });
        await telemetryService.flush(PROGRESS, SCENE);

        mockPost.mockResolvedValue({ data: {} });
        await telemetryService.flush(PROGRESS, SCENE);

        // One call for the failure, none for the second flush.
        expect(mockPost).toHaveBeenCalledTimes(1);
    });
});
