import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AiVerificationCard } from './AiVerificationCard';
import { aiVerificationService, type AiVerification } from '@/services/ai-verification.service';

vi.mock('@/services/ai-verification.service', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/services/ai-verification.service')>();
    return {
        ...actual,
        aiVerificationService: {
            getVerification: vi.fn(),
            requestVerification: vi.fn(),
            getHistory: vi.fn(),
        },
    };
});

const getVerification = vi.mocked(aiVerificationService.getVerification);
const requestVerification = vi.mocked(aiVerificationService.requestVerification);

function makeVerification(overrides: Partial<AiVerification> = {}): AiVerification {
    return {
        id: 'attempt-1',
        reportId: 'report-1',
        claim: 'Vaccines cause autism',
        status: 'COMPLETED',
        verdict: 'FALSE',
        confidence: 'High',
        reasoning: 'Extensive scientific research has found no credible link.',
        evidenceSummary: 'Vaccines do not cause autism.',
        sources: [
            {
                title: 'Fact Checked: Vaccines: Safe and Effective, No Link to Autism',
                url: 'https://www.aap.org/en/news-room/fact-checked/vaccines',
                content: 'Immunizations work by prompting your immune system to build defences.',
                score: 0.74004334,
            },
        ],
        provider: 'ai.horizontruth.org',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...overrides,
    };
}

beforeEach(() => {
    vi.clearAllMocks();
    getVerification.mockResolvedValue(null);
    requestVerification.mockResolvedValue(null);
});

afterEach(() => {
    vi.useRealTimers();
});

describe('AiVerificationCard — completed result', () => {
    it('shows verdict, confidence, reasoning, evidence and sources', async () => {
        render(<AiVerificationCard reportId="report-1" initialVerification={makeVerification()} />);

        expect(screen.getByRole('heading', { name: /AI Verification/i })).toBeInTheDocument();
        expect(screen.getByText('False')).toBeInTheDocument();
        expect(screen.getByText(/Confidence:/).parentElement).toHaveTextContent('Confidence: High');
        expect(screen.getByText(/no credible link/i)).toBeInTheDocument();
        expect(screen.getByText('Vaccines do not cause autism.')).toBeInTheDocument();
        // Once as the visible source title, once in the link's accessible name.
        expect(screen.getAllByText(/Fact Checked: Vaccines/).length).toBeGreaterThan(0);
    });

    it('renders the claim that was analysed, not just the report title', () => {
        render(<AiVerificationCard reportId="report-1" initialVerification={makeVerification()} />);

        expect(screen.getByText('Claim analyzed')).toBeInTheDocument();
        expect(screen.getByText('Vaccines cause autism')).toBeInTheDocument();
    });

    it('shows the source domain and relevance, and links out safely', () => {
        render(<AiVerificationCard reportId="report-1" initialVerification={makeVerification()} />);

        expect(screen.getByText('aap.org')).toBeInTheDocument();
        expect(screen.getByText('Relevance: 74%')).toBeInTheDocument();

        const link = screen.getByRole('link', { name: /View source/i });
        expect(link).toHaveAttribute('href', 'https://www.aap.org/en/news-room/fact-checked/vaccines');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');
    });

    it('frames the result as AI-assisted rather than final truth', () => {
        render(<AiVerificationCard reportId="report-1" initialVerification={makeVerification()} />);

        expect(screen.getByText(/AI-assisted verification/i)).toBeInTheDocument();
        expect(screen.getByText(/Review the cited evidence/i)).toBeInTheDocument();
    });

    it('does not request a new analysis when it is merely mounted', () => {
        render(<AiVerificationCard reportId="report-1" initialVerification={makeVerification()} />);

        // The refresh path: reading a report must never call the AI again.
        expect(requestVerification).not.toHaveBeenCalled();
        expect(getVerification).not.toHaveBeenCalled();
    });

    it('re-runs verification only on an explicit request', async () => {
        const user = userEvent.setup();
        requestVerification.mockResolvedValue(makeVerification({ id: 'attempt-2', status: 'PENDING' }));

        render(<AiVerificationCard reportId="report-1" initialVerification={makeVerification()} />);
        await user.click(screen.getByRole('button', { name: /Run AI verification again/i }));

        expect(requestVerification).toHaveBeenCalledWith('report-1', true);
        await waitFor(() => expect(screen.getByText(/Analyzing this claim/i)).toBeInTheDocument());
    });

    it('renders every source returned by the AI', () => {
        const verification = makeVerification({
            sources: [
                { title: 'Source one', url: 'https://one.example/a', score: 0.9 },
                { title: 'Source two', url: 'https://two.example/b', score: 0.5 },
                { title: 'Source three', url: 'https://three.example/c' },
            ],
        });

        render(<AiVerificationCard reportId="report-1" initialVerification={verification} />);

        expect(screen.getAllByRole('link', { name: /View source/i })).toHaveLength(3);
        // A source without a score simply omits the relevance chip.
        expect(screen.queryAllByText(/Relevance:/)).toHaveLength(2);
    });

    it('drops sources with unsafe URLs instead of rendering them', () => {
        const verification = makeVerification({
            sources: [
                { title: 'Safe', url: 'https://safe.example/a' },
                { title: 'Unsafe', url: 'javascript:alert(1)' },
            ],
        });

        render(<AiVerificationCard reportId="report-1" initialVerification={verification} />);

        expect(screen.getAllByRole('link', { name: /View source/i })).toHaveLength(1);
        expect(screen.queryByText('Unsafe')).not.toBeInTheDocument();
    });

    it('collapses long reasoning behind an expandable control', async () => {
        const user = userEvent.setup();
        const verification = makeVerification({ reasoning: 'Detailed analysis. '.repeat(60) });

        render(<AiVerificationCard reportId="report-1" initialVerification={verification} />);

        const toggle = screen.getByRole('button', { name: /Read full reasoning/i });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');

        await user.click(toggle);
        expect(screen.getByRole('button', { name: /Show less/i })).toHaveAttribute('aria-expanded', 'true');
    });

    it('handles a malformed result with missing fields', () => {
        const verification = {
            id: 'attempt-1',
            reportId: 'report-1',
            claim: 'Some claim',
            status: 'COMPLETED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as AiVerification;

        render(<AiVerificationCard reportId="report-1" initialVerification={verification} />);

        expect(screen.getByText('Unverified')).toBeInTheDocument();
        expect(screen.queryByText(/Confidence:/)).not.toBeInTheDocument();
        expect(screen.getByText(/did not return any citable sources/i)).toBeInTheDocument();
    });
});

describe('AiVerificationCard — reports never analysed', () => {
    it('offers verification instead of failing when no record exists', async () => {
        const user = userEvent.setup();
        requestVerification.mockResolvedValue(makeVerification({ status: 'PENDING' }));

        render(<AiVerificationCard reportId="legacy-report" initialVerification={null} />);

        expect(screen.getByText(/Not yet analyzed/i)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /Verify with AI/i }));
        expect(requestVerification).toHaveBeenCalledWith('legacy-report', false);
    });

    it('fetches stored state when the report payload carried none', async () => {
        getVerification.mockResolvedValue(makeVerification());

        render(<AiVerificationCard reportId="report-1" />);

        await waitFor(() => expect(screen.getByText('False')).toBeInTheDocument());
        expect(getVerification).toHaveBeenCalledWith('report-1');
        expect(requestVerification).not.toHaveBeenCalled();
    });

    it('asks guests to sign in rather than calling the API', async () => {
        const user = userEvent.setup();
        const onRequireAuth = vi.fn();

        render(
            <AiVerificationCard
                reportId="report-1"
                initialVerification={null}
                canRequest={false}
                onRequireAuth={onRequireAuth}
            />,
        );

        await user.click(screen.getByRole('button', { name: /Verify with AI/i }));

        expect(onRequireAuth).toHaveBeenCalled();
        expect(requestVerification).not.toHaveBeenCalled();
    });
});

describe('AiVerificationCard — in-progress and failure states', () => {
    it('shows analysis steps rather than a blank card while processing', () => {
        render(
            <AiVerificationCard
                reportId="report-1"
                initialVerification={makeVerification({ status: 'PROCESSING' })}
            />,
        );

        const status = screen.getByRole('status');
        expect(status).toHaveTextContent(/Analyzing this claim/i);
        expect(status).toHaveTextContent(/Checking available evidence/i);
        expect(status).toHaveTextContent(/Evaluating sources/i);
        expect(status).toHaveTextContent(/Preparing assessment/i);
    });

    it('polls until the attempt reaches a terminal state', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        getVerification.mockResolvedValue(makeVerification());

        render(
            <AiVerificationCard
                reportId="report-1"
                initialVerification={makeVerification({ status: 'PENDING', verdict: undefined })}
            />,
        );

        await act(async () => {
            await vi.advanceTimersByTimeAsync(3500);
        });

        await waitFor(() => expect(screen.getByText('False')).toBeInTheDocument());
    });

    it('reassures the reporter that their report is unaffected by an AI failure', () => {
        render(
            <AiVerificationCard
                reportId="report-1"
                initialVerification={makeVerification({
                    status: 'FAILED',
                    errorMessage: 'The AI verification service took too long to respond.',
                })}
            />,
        );

        expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument();
        expect(screen.getByText(/submitted successfully and is unaffected/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
    });

    it('retries a failed verification with a forced attempt', async () => {
        const user = userEvent.setup();
        requestVerification.mockResolvedValue(makeVerification({ status: 'PENDING' }));

        render(
            <AiVerificationCard
                reportId="report-1"
                initialVerification={makeVerification({ status: 'FAILED' })}
            />,
        );

        await user.click(screen.getByRole('button', { name: /Try again/i }));

        expect(requestVerification).toHaveBeenCalledWith('report-1', true);
    });

    it('shows a safe message when the request itself fails', async () => {
        const user = userEvent.setup();
        requestVerification.mockRejectedValue(
            new Error('Request failed with status code 500: at Object.<anonymous> (/srv/app.js:1)'),
        );

        render(<AiVerificationCard reportId="report-1" initialVerification={null} />);
        await user.click(screen.getByRole('button', { name: /Verify with AI/i }));

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent(/could not be started/i);
        // Backend/stack detail must never reach the reader.
        expect(alert).not.toHaveTextContent(/srv\/app\.js/);
    });
});

describe('AiVerificationCard — moderator variant', () => {
    it('exposes status, timestamp and provider for moderators', () => {
        render(
            <AiVerificationCard
                reportId="report-1"
                initialVerification={makeVerification({ completedAt: new Date().toISOString() })}
                variant="moderator"
            />,
        );

        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('COMPLETED')).toBeInTheDocument();
        expect(screen.getByText('ai.horizontruth.org')).toBeInTheDocument();
    });

    it('hides provenance details on the public card', () => {
        render(<AiVerificationCard reportId="report-1" initialVerification={makeVerification()} />);

        expect(screen.queryByText('ai.horizontruth.org')).not.toBeInTheDocument();
    });
});
