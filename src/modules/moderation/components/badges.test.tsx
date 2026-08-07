import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    AppealStatusBadge,
    CaseStatusBadge,
    FlagChip,
    SanctionBadge,
    SeverityBadge,
} from './badges';

/**
 * Badges carry meaning that a moderator acts on, so they are checked for
 * readable text and for not relying on colour alone (WCAG 1.4.1).
 */
describe('CaseStatusBadge', () => {
    it('renders the human label, not the enum', () => {
        render(<CaseStatusBadge status="UNDER_REVIEW" />);
        expect(screen.getByText('Under review')).toBeInTheDocument();
    });

    it('distinguishes every status by text', () => {
        const { rerender } = render(<CaseStatusBadge status="RESOLVED" />);
        expect(screen.getByText('Resolved')).toBeInTheDocument();

        rerender(<CaseStatusBadge status="DISMISSED" />);
        expect(screen.getByText('Dismissed')).toBeInTheDocument();
    });
});

describe('SeverityBadge', () => {
    it('names the severity in text', () => {
        render(<SeverityBadge severity="CRITICAL" />);
        expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('carries a decorative dot that is hidden from screen readers', () => {
        const { container } = render(<SeverityBadge severity="HIGH" />);
        expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
    });
});

describe('AppealStatusBadge', () => {
    it('labels an upheld appeal as resolved rather than "accepted"', () => {
        render(<AppealStatusBadge status="ACCEPTED" />);
        expect(screen.getByText('Resolved')).toBeInTheDocument();
    });

    it('labels a rejected appeal explicitly', () => {
        render(<AppealStatusBadge status="REJECTED" />);
        expect(screen.getByText('Rejected')).toBeInTheDocument();
    });
});

describe('SanctionBadge', () => {
    it('renders the sanction type readably', () => {
        render(<SanctionBadge type="TEMPORARY_SUSPENSION" />);
        expect(screen.getByText('temporary suspension')).toBeInTheDocument();
    });
});

describe('FlagChip', () => {
    it('shows the flag label', () => {
        render(<FlagChip flag={{ id: '1', code: 'HATE_SPEECH', label: 'Hate Speech' }} />);
        expect(screen.getByText('Hate Speech')).toBeInTheDocument();
    });

    it('falls back to the code when no label came back from the API', () => {
        render(<FlagChip flag={{ id: '1', code: 'CUSTOM_POLICY' }} />);
        expect(screen.getByText('CUSTOM_POLICY')).toBeInTheDocument();
    });

    it('exposes the description as a tooltip for unfamiliar flags', () => {
        render(
            <FlagChip
                flag={{
                    id: '1',
                    code: 'EDUCATIONAL_CONCERN',
                    label: 'Educational Concern',
                    description: 'Teaches a flawed verification habit.',
                }}
            />,
        );

        expect(screen.getByTitle('Teaches a flawed verification habit.')).toBeInTheDocument();
    });

    it('offers no remove control unless a handler is supplied', () => {
        render(<FlagChip flag={{ id: '1', code: 'SPAM', label: 'Spam' }} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('gives the remove control a name that identifies which flag it clears', async () => {
        const onRemove = vi.fn();
        const user = userEvent.setup();

        render(
            <FlagChip
                flag={{ id: '1', code: 'SPAM', label: 'Spam' }}
                onRemove={onRemove}
            />,
        );

        const button = screen.getByRole('button', {
            name: 'Remove the Spam flag',
        });
        await user.click(button);

        expect(onRemove).toHaveBeenCalledOnce();
    });
});
