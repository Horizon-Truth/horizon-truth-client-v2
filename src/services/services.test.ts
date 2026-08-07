/**
 * Endpoint contract tests for the thin axios service wrappers.
 *
 * These exist to catch the failure mode this layer actually has: a mistyped
 * path, a verb swapped for another, or a payload that stops matching what the
 * API expects. The transport itself is mocked — this is about the call shape.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

import api from './api';
import { contactService } from './contact.service';
import { newsletterService } from './newsletter.service';
import { statsService } from './stats.service';
import { userService } from './user.service';
import { feedbackService } from './feedback.service';
import { reportService } from './report.service';
import { auditLogService } from './audit-log.service';

const mockApi = api as unknown as {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
};

/** Every wrapper unwraps `response.data`; return a recognisable payload. */
const respond = (data: unknown = { ok: true }) => ({ data });

beforeEach(() => {
    vi.clearAllMocks();
    for (const verb of ['get', 'post', 'put', 'patch', 'delete'] as const) {
        mockApi[verb].mockResolvedValue(respond());
    }
});

describe('contactService', () => {
    it('posts a submission to /contacts', async () => {
        const payload = {
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
            subject: 'Hello',
            message: 'Hi there',
        };

        await contactService.submit(payload);

        expect(mockApi.post).toHaveBeenCalledWith('/contacts', payload);
    });

    it('returns the unwrapped response body', async () => {
        mockApi.post.mockResolvedValue(respond({ id: 'contact-1' }));

        await expect(
            contactService.submit({
                firstName: 'Ada',
                lastName: 'Lovelace',
                email: 'ada@example.com',
                subject: 'Hello',
                message: 'Hi',
            }),
        ).resolves.toEqual({ id: 'contact-1' });
    });

    it('lists submissions', async () => {
        await contactService.getAll();
        expect(mockApi.get).toHaveBeenCalledWith('/contacts');
    });

    it('fetches one submission by id', async () => {
        await contactService.getOne('c-9');
        expect(mockApi.get).toHaveBeenCalledWith('/contacts/c-9');
    });

    it('marks a submission read via PATCH', async () => {
        await contactService.markAsRead('c-9');
        expect(mockApi.patch).toHaveBeenCalledWith('/contacts/c-9/read');
    });

    it('posts a reply under the submission', async () => {
        await contactService.reply('c-9', { message: 'Thanks' });
        expect(mockApi.post).toHaveBeenCalledWith('/contacts/c-9/reply', {
            message: 'Thanks',
        });
    });

    it('deletes a submission', async () => {
        await contactService.delete('c-9');
        expect(mockApi.delete).toHaveBeenCalledWith('/contacts/c-9');
    });

    it('propagates transport failures rather than swallowing them', async () => {
        mockApi.get.mockRejectedValue(new Error('network down'));

        await expect(contactService.getAll()).rejects.toThrow('network down');
    });
});

describe('newsletterService', () => {
    it('wraps the email in an object when subscribing', async () => {
        await newsletterService.subscribe('reader@example.com');

        expect(mockApi.post).toHaveBeenCalledWith('/newsletter', {
            email: 'reader@example.com',
        });
    });

    it('lists subscriptions', async () => {
        await newsletterService.getAll();
        expect(mockApi.get).toHaveBeenCalledWith('/newsletter');
    });

    it('deletes a subscription by id', async () => {
        await newsletterService.delete('n-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/newsletter/n-1');
    });
});

describe('statsService', () => {
    it('reads the public stats endpoint', async () => {
        mockApi.get.mockResolvedValue(
            respond({ activeUsers: 10, reportsDebunked: 4, verifiers: 2, accuracyRate: 91 }),
        );

        const stats = await statsService.getPublicStats();

        expect(mockApi.get).toHaveBeenCalledWith('/public/stats');
        expect(stats.accuracyRate).toBe(91);
    });
});

describe('userService', () => {
    it('reads the current profile', async () => {
        await userService.getProfile();
        expect(mockApi.get).toHaveBeenCalledWith('/users/me');
    });

    it('updates the profile with PUT', async () => {
        await userService.updateProfile({ fullName: 'Ada L' });
        expect(mockApi.put).toHaveBeenCalledWith('/users/me/profile', {
            fullName: 'Ada L',
        });
    });

    it('reads player stats', async () => {
        await userService.getMyStats();
        expect(mockApi.get).toHaveBeenCalledWith('/players/stats/me');
    });

    it('reads the learning profile', async () => {
        await userService.getMyLearningProfile();
        expect(mockApi.get).toHaveBeenCalledWith('/players/learning-profile/me');
    });

    it('syncs the learning profile back with PUT', async () => {
        const profile = {
            skillBook: { sourcing: { xp: 12, correct: 1, total: 1 } },
            calibration: { certain: { correct: 1, total: 1 } },
        };

        await userService.saveMyLearningProfile(profile);

        expect(mockApi.put).toHaveBeenCalledWith(
            '/players/learning-profile/me',
            profile,
        );
    });

    it('reads and writes preferences', async () => {
        await userService.getPreferences();
        expect(mockApi.get).toHaveBeenCalledWith('/users/me/preferences');

        await userService.updatePreferences({ theme: 'dark' });
        expect(mockApi.put).toHaveBeenCalledWith('/users/me/preferences', {
            theme: 'dark',
        });
    });

    it('anonymizes the account with a POST and no body', async () => {
        await userService.anonymizeAccount();
        expect(mockApi.post).toHaveBeenCalledWith('/users/me/anonymize');
    });
});

describe('feedbackService', () => {
    it('creates authenticated feedback', async () => {
        await feedbackService.createFeedback({ commentText: 'Broken link' });
        expect(mockApi.post).toHaveBeenCalledWith('/feedback', {
            commentText: 'Broken link',
        });
    });

    it('routes guest feedback to the guest endpoint', async () => {
        await feedbackService.createGuestFeedback({ commentText: 'Typo' });
        expect(mockApi.post).toHaveBeenCalledWith('/feedback/guest', {
            commentText: 'Typo',
        });
    });

    it('passes query filters through as axios params', async () => {
        await feedbackService.getFeedbacks({ status: 'OPEN' });
        expect(mockApi.get).toHaveBeenCalledWith('/feedback', {
            params: { status: 'OPEN' },
        });
    });

    it('sends undefined params when no filter is given', async () => {
        await feedbackService.getFeedbacks();
        expect(mockApi.get).toHaveBeenCalledWith('/feedback', {
            params: undefined,
        });
    });

    it('fetches, updates and deletes by id', async () => {
        await feedbackService.getFeedbackById('f-1');
        expect(mockApi.get).toHaveBeenCalledWith('/feedback/f-1');

        await feedbackService.updateFeedback('f-1', { status: 'RESOLVED' });
        expect(mockApi.patch).toHaveBeenCalledWith('/feedback/f-1', {
            status: 'RESOLVED',
        });

        await feedbackService.deleteFeedback('f-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/feedback/f-1');
    });

    it('reads the stats endpoint', async () => {
        await feedbackService.getStats();
        expect(mockApi.get).toHaveBeenCalledWith('/feedback/stats');
    });
});

describe('reportService', () => {
    it('submits a report', async () => {
        const dto = {
            title: 'Claim',
            description: 'Body',
            contentType: 'TEXT',
            language: 'en',
        };

        await reportService.submitReport(dto);

        expect(mockApi.post).toHaveBeenCalledWith('/reports', dto);
    });

    it('filters tags to active ones by default', async () => {
        await reportService.getReportTags();

        expect(mockApi.get).toHaveBeenCalledWith('/report-tags', {
            params: { isActive: true },
        });
    });

    it('drops the active filter when all tags are requested', async () => {
        await reportService.getReportTags(true);

        expect(mockApi.get).toHaveBeenCalledWith('/report-tags', { params: {} });
    });

    it('filters languages to active ones by default', async () => {
        await reportService.getLanguages();

        expect(mockApi.get).toHaveBeenCalledWith('/languages', {
            params: { isActive: true },
        });
    });

    it('drops the active filter when all languages are requested', async () => {
        await reportService.getLanguages(true);

        expect(mockApi.get).toHaveBeenCalledWith('/languages', { params: {} });
    });

    it('creates, updates and deletes report tags', async () => {
        await reportService.createReportTag({ name: 'Health', slug: 'health' });
        expect(mockApi.post).toHaveBeenCalledWith('/report-tags', {
            name: 'Health',
            slug: 'health',
        });

        await reportService.updateReportTag('t-1', { name: 'Med' });
        expect(mockApi.patch).toHaveBeenCalledWith('/report-tags/t-1', {
            name: 'Med',
        });

        await reportService.deleteReportTag('t-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/report-tags/t-1');
    });

    it('creates, updates and deletes languages', async () => {
        await reportService.createLanguage({ name: 'Amharic', code: 'am' });
        expect(mockApi.post).toHaveBeenCalledWith('/languages', {
            name: 'Amharic',
            code: 'am',
        });

        await reportService.updateLanguage('l-1', { isActive: false });
        expect(mockApi.patch).toHaveBeenCalledWith('/languages/l-1', {
            isActive: false,
        });

        await reportService.deleteLanguage('l-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/languages/l-1');
    });

    it('lists, reads, updates and deletes reports', async () => {
        await reportService.getReports({ page: 2 });
        expect(mockApi.get).toHaveBeenCalledWith('/reports', {
            params: { page: 2 },
        });

        await reportService.getReportById('r-1');
        expect(mockApi.get).toHaveBeenCalledWith('/reports/r-1');

        await reportService.updateReport('r-1', { title: 'New' });
        expect(mockApi.patch).toHaveBeenCalledWith('/reports/r-1', {
            title: 'New',
        });

        await reportService.deleteReport('r-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/reports/r-1');
    });

    it('nests verification and evidence under the report', async () => {
        await reportService.addVerification('r-1', {
            comment: 'Checked',
            status: 'CONFIRMED',
        });
        expect(mockApi.post).toHaveBeenCalledWith('/reports/r-1/verify', {
            comment: 'Checked',
            status: 'CONFIRMED',
        });

        await reportService.addEvidence('r-1', {
            evidenceType: 'LINK',
            content: 'https://example.com',
        });
        expect(mockApi.post).toHaveBeenCalledWith('/reports/r-1/evidence', {
            evidenceType: 'LINK',
            content: 'https://example.com',
        });
    });
});

describe('auditLogService', () => {
    it('forwards paging and filter params', async () => {
        await auditLogService.getLogs({ page: 2, limit: 50, action: 'LOGIN' });

        expect(mockApi.get).toHaveBeenCalledWith('/audit-logs', {
            params: {
                page: 2,
                limit: 50,
                userId: undefined,
                action: 'LOGIN',
                entityType: undefined,
            },
        });
    });

    it('requests the export as a blob', async () => {
        await auditLogService.exportLogs({ entityType: 'Report' });

        expect(mockApi.get).toHaveBeenCalledWith('/audit-logs/export', {
            params: {
                userId: undefined,
                action: undefined,
                entityType: 'Report',
            },
            responseType: 'blob',
        });
    });
});
