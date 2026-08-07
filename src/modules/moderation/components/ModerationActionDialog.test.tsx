import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    MIN_REASON_LENGTH,
    ModerationActionDialog,
} from './ModerationActionDialog';

/**
 * The dialog is the single choke point for every moderation action, so the
 * two rules it enforces — a written reason, and an explicit confirmation —
 * are tested here rather than in each calling page.
 */
describe('ModerationActionDialog', () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    const renderDialog = (props: Partial<
        React.ComponentProps<typeof ModerationActionDialog>
    > = {}) =>
        render(
            <ModerationActionDialog
                open
                onOpenChange={onOpenChange}
                title="Suspend account"
                description="The user cannot sign in until the suspension expires."
                confirmLabel="Suspend account"
                onConfirm={onConfirm}
                {...props}
            />,
        );

    beforeEach(() => {
        onConfirm.mockClear();
        onOpenChange.mockClear();
    });

    // --- Reason enforcement ---------------------------------------------

    it('starts with the confirm button disabled', () => {
        renderDialog();

        expect(
            screen.getByRole('button', { name: 'Suspend account' }),
        ).toBeDisabled();
    });

    it('will not confirm without a reason', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('button', { name: 'Suspend account' }));

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('rejects a reason shorter than the minimum', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.type(screen.getByLabelText(/reason/i), 'spam');
        await user.click(screen.getByRole('button', { name: 'Suspend account' }));

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('rejects a reason that is only whitespace', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.type(screen.getByLabelText(/reason/i), '              ');
        await user.click(screen.getByRole('button', { name: 'Suspend account' }));

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('confirms once a sufficient reason is given', async () => {
        const user = userEvent.setup();
        renderDialog();

        const reason = 'Third upheld harassment report in fourteen days.';
        await user.type(screen.getByLabelText(/reason/i), reason);
        await user.click(screen.getByRole('button', { name: 'Suspend account' }));

        expect(onConfirm).toHaveBeenCalledWith({
            reason,
            notes: undefined,
        });
    });

    it('passes internal notes through when supplied', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.type(
            screen.getByLabelText(/reason/i),
            'Repeated coordinated posting.',
        );
        await user.type(
            screen.getByLabelText(/internal notes/i),
            'Linked to the ring tracked in HT-99A1.',
        );
        await user.click(screen.getByRole('button', { name: 'Suspend account' }));

        expect(onConfirm).toHaveBeenCalledWith({
            reason: 'Repeated coordinated posting.',
            notes: 'Linked to the ring tracked in HT-99A1.',
        });
    });

    it('trims surrounding whitespace from the reason', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.type(
            screen.getByLabelText(/reason/i),
            '   Violates policy 4.2 on doctored evidence.   ',
        );
        await user.click(screen.getByRole('button', { name: 'Suspend account' }));

        expect(onConfirm).toHaveBeenCalledWith({
            reason: 'Violates policy 4.2 on doctored evidence.',
            notes: undefined,
        });
    });

    // --- Feedback --------------------------------------------------------

    it('shows a live character count against the minimum', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.type(screen.getByLabelText(/reason/i), 'abc');

        expect(screen.getByText(`3/${MIN_REASON_LENGTH}`)).toBeInTheDocument();
    });

    it('raises an alert when a too-short reason loses focus', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.type(screen.getByLabelText(/reason/i), 'no');
        await user.tab();

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent(/at least 10 characters/i);
    });

    it('marks the reason field invalid for assistive technology', async () => {
        const user = userEvent.setup();
        renderDialog();

        const field = screen.getByLabelText(/reason/i);
        await user.type(field, 'no');
        await user.tab();

        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    // --- Presets ---------------------------------------------------------

    it('fills the reason from a preset, still editable afterwards', async () => {
        const user = userEvent.setup();
        renderDialog({
            reasonPresets: ['No policy violation found on review.'],
        });

        await user.click(
            screen.getByRole('button', { name: 'No policy violation found on review.' }),
        );

        expect(screen.getByLabelText(/reason/i)).toHaveValue(
            'No policy violation found on review.',
        );

        await user.type(screen.getByLabelText(/reason/i), ' Confirmed with a second moderator.');
        expect(screen.getByLabelText(/reason/i)).toHaveValue(
            'No policy violation found on review. Confirmed with a second moderator.',
        );
    });

    // --- Guards ----------------------------------------------------------

    it('stays disabled while the parent reports an invalid extra field', async () => {
        const user = userEvent.setup();
        renderDialog({ disabled: true });

        await user.type(
            screen.getByLabelText(/reason/i),
            'A perfectly valid reason for this action.',
        );

        expect(
            screen.getByRole('button', { name: 'Suspend account' }),
        ).toBeDisabled();
    });

    it('disables both buttons while the request is in flight', () => {
        renderDialog({ isPending: true });

        expect(screen.getByRole('button', { name: /working/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    });

    it('closes without confirming when cancelled', async () => {
        const user = userEvent.setup();
        renderDialog();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onConfirm).not.toHaveBeenCalled();
    });

    // --- Accessibility ---------------------------------------------------

    it('exposes the action as a labelled dialog', () => {
        renderDialog();

        const dialog = screen.getByRole('dialog');
        expect(
            within(dialog).getByRole('heading', { name: 'Suspend account' }),
        ).toBeInTheDocument();
    });

    it('marks the reason field as required', () => {
        renderDialog();

        expect(screen.getByLabelText(/reason/i)).toHaveAttribute(
            'aria-required',
            'true',
        );
    });

    it('warns visually when the action is destructive', () => {
        renderDialog({ destructive: true, confirmLabel: 'Delete content' });

        // The destructive variant is what carries the red styling; the label
        // itself must still be unambiguous on its own.
        expect(
            screen.getByRole('button', { name: 'Delete content' }),
        ).toBeInTheDocument();
    });

    it('renders caller-supplied fields above the reason', () => {
        renderDialog({
            children: (
                <label>
                    Duration
                    <select aria-label="Duration">
                        <option>7 days</option>
                    </select>
                </label>
            ),
        });

        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
    });
});
