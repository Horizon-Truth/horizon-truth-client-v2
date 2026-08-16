import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DefangedUrl } from './DefangedUrl';

vi.mock('sonner', () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}));

const writeText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
    vi.clearAllMocks();
});

/**
 * userEvent.setup() installs its own clipboard stub, so ours has to be applied
 * afterwards. navigator.clipboard is getter-only in jsdom, hence defineProperty.
 */
function setupUser() {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
    });
    return user;
}

const SCAM = 'https://free-crypto.example/claim?ref=abc';

describe('DefangedUrl', () => {
    it('renders the address defanged', () => {
        render(<DefangedUrl url={SCAM} />);

        expect(screen.getByTestId('defanged-url')).toHaveTextContent(
            'hxxps://free-crypto[.]example/claim?ref=abc',
        );
    });

    it('renders no link at all, so the reported content cannot be opened', () => {
        const { container } = render(<DefangedUrl url={SCAM} />);

        // Not "a link with a safe rel" — no anchor exists, so there is nothing
        // to click, middle-click, or activate with a keyboard.
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(container.querySelector('a')).toBeNull();
    });

    it('never puts the live URL in the rendered markup', () => {
        const { container } = render(<DefangedUrl url={SCAM} />);

        expect(container.innerHTML).not.toContain('https://free-crypto.example');
    });

    it('copies the original URL for sandboxed inspection', async () => {
        const user = setupUser();
        render(<DefangedUrl url={SCAM} />);

        await user.click(screen.getByRole('button', { name: /Copy original link/i }));

        // The real address is what an investigator needs on the clipboard.
        expect(writeText).toHaveBeenCalledWith(SCAM);
        expect(await screen.findByText('Copied')).toBeInTheDocument();
    });

    it('warns the reader why the link is inert', () => {
        render(<DefangedUrl url={SCAM} />);

        expect(screen.getByText(/Link disabled for safety/i)).toBeInTheDocument();
    });

    it('shows the optional label', () => {
        render(<DefangedUrl url={SCAM} label="Reported source URL" />);

        expect(screen.getByText('Reported source URL')).toBeInTheDocument();
    });

    it('survives a clipboard failure without crashing', async () => {
        const user = setupUser();
        writeText.mockRejectedValueOnce(new Error('denied'));
        render(<DefangedUrl url={SCAM} />);

        await user.click(screen.getByRole('button', { name: /Copy original link/i }));

        expect(screen.getByTestId('defanged-url')).toBeInTheDocument();
    });
});
