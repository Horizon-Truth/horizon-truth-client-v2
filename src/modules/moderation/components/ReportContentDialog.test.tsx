import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ReportContentDialog } from './ReportContentDialog';
import { moderationService } from '@/services/moderation.service';
import { useAuthStore } from '@/store/auth.store';

vi.mock('@/services/moderation.service', async (importOriginal) => {
    const actual = await importOriginal<
        typeof import('@/services/moderation.service')
    >();
    return {
        ...actual,
        moderationService: {
            ...actual.moderationService,
            reportContent: vi.fn(),
        },
    };
});

const reportContent = vi.mocked(moderationService.reportContent);

function renderDialog(props: Partial<
    React.ComponentProps<typeof ReportContentDialog>
> = {}) {
    const client = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    });

    return render(
        <QueryClientProvider client={client}>
            <ReportContentDialog
                open
                onOpenChange={vi.fn()}
                targetType="COMMENT"
                targetId="comment-1"
                {...props}
            />
        </QueryClientProvider>,
    );
}

describe('ReportContentDialog', () => {
    beforeEach(() => {
        reportContent.mockReset();
        reportContent.mockResolvedValue({ id: 'case-1' });
        useAuthStore.setState({
            isAuthenticated: true,
            user: { id: 'u1', fullName: 'Test', role: 'PLAYER' },
            token: 't',
        } as never);
    });

    afterEach(() => {
        useAuthStore.setState({ isAuthenticated: false, user: null } as never);
    });

    // --- Gating -----------------------------------------------------------

    it('asks anonymous visitors to sign in rather than showing the form', () => {
        useAuthStore.setState({ isAuthenticated: false, user: null } as never);
        renderDialog();

        expect(screen.getByText('Sign in to report')).toBeInTheDocument();
        expect(screen.queryByLabelText(/what happened/i)).not.toBeInTheDocument();
    });

    // --- Validation -------------------------------------------------------

    it('disables send until a reason and a description are given', () => {
        renderDialog();

        expect(screen.getByRole('button', { name: /send report/i })).toBeDisabled();
    });

    it('still refuses to send with a reason but no description', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('radio', { name: /hate speech/i }));

        expect(screen.getByRole('button', { name: /send report/i })).toBeDisabled();
        expect(reportContent).not.toHaveBeenCalled();
    });

    it('refuses a description shorter than the minimum', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('radio', { name: /spam/i }));
        await user.type(screen.getByLabelText(/what happened/i), 'bad post');

        expect(screen.getByRole('button', { name: /send report/i })).toBeDisabled();
    });

    it('explains why the description is too short, as an alert', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.type(screen.getByLabelText(/what happened/i), 'short');
        await user.tab();

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent(/at least 20 characters/i);
    });

    // --- Submission -------------------------------------------------------

    it('submits the reason, description and inferred severity', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('radio', { name: /hate speech/i }));
        await user.type(
            screen.getByLabelText(/what happened/i),
            'This comment attacks a named group and calls for their removal.',
        );
        await user.click(screen.getByRole('button', { name: /send report/i }));

        await waitFor(() => {
            expect(reportContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    targetType: 'COMMENT',
                    targetId: 'comment-1',
                    reportReason: 'HATE_SPEECH',
                    // Hate speech is critical, so the queue prioritises it
                    // without the reporter having to know that.
                    severity: 'CRITICAL',
                    isAnonymous: false,
                }),
            );
        });
    });

    it('maps a low-harm reason to a low severity', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('radio', { name: /^spam/i }));
        await user.type(
            screen.getByLabelText(/what happened/i),
            'The same promotional message was posted eleven times.',
        );
        await user.click(screen.getByRole('button', { name: /send report/i }));

        await waitFor(() => {
            expect(reportContent).toHaveBeenCalledWith(
                expect.objectContaining({ severity: 'LOW' }),
            );
        });
    });

    it('passes the anonymous choice through', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('radio', { name: /harassment/i }));
        await user.type(
            screen.getByLabelText(/what happened/i),
            'They have messaged me repeatedly after I asked them to stop.',
        );
        await user.click(screen.getByRole('checkbox', { name: /report anonymously/i }));
        await user.click(screen.getByRole('button', { name: /send report/i }));

        await waitFor(() => {
            expect(reportContent).toHaveBeenCalledWith(
                expect.objectContaining({ isAnonymous: true }),
            );
        });
    });

    it('trims whitespace from the description', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('radio', { name: /^spam/i }));
        await user.type(
            screen.getByLabelText(/what happened/i),
            '   Posted the same link in every discussion thread.   ',
        );
        await user.click(screen.getByRole('button', { name: /send report/i }));

        await waitFor(() => {
            expect(reportContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    description: 'Posted the same link in every discussion thread.',
                }),
            );
        });
    });

    // --- Confirmation -----------------------------------------------------

    it('confirms receipt and sets expectations about the outcome', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('radio', { name: /violence/i }));
        await user.type(
            screen.getByLabelText(/what happened/i),
            'This post threatens a named individual with physical harm.',
        );
        await user.click(screen.getByRole('button', { name: /send report/i }));

        expect(await screen.findByText(/report received/i)).toBeInTheDocument();
        // Reporters who hear nothing back stop reporting, so the dialog says
        // explicitly that silence is not inaction.
        expect(
            screen.getByText(/not usually hear the outcome/i),
        ).toBeInTheDocument();
    });

    it('does not show the form again after a successful report', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('radio', { name: /^spam/i }));
        await user.type(
            screen.getByLabelText(/what happened/i),
            'Repeated promotional posting across many threads.',
        );
        await user.click(screen.getByRole('button', { name: /send report/i }));

        await screen.findByText(/report received/i);
        expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    });

    // --- Accessibility ----------------------------------------------------

    it('labels the content being reported', () => {
        renderDialog({ contentLabel: 'Vaccines and microchips' });

        expect(
            screen.getByText(/Reporting: Vaccines and microchips/),
        ).toBeInTheDocument();
    });

    it('marks the description as required for assistive technology', () => {
        renderDialog();

        expect(screen.getByLabelText(/what happened/i)).toHaveAttribute(
            'aria-required',
            'true',
        );
    });

    it('offers reasons as a radio group with explanations', () => {
        renderDialog();

        expect(screen.getAllByRole('radio').length).toBeGreaterThan(5);
        expect(
            screen.getByText(/Attacks a person or group over who they are/i),
        ).toBeInTheDocument();
    });
});
