import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/services/auth.service', () => ({
    authService: { login: vi.fn(), restoreAccount: vi.fn() },
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const authState = {
    setAuth: vi.fn(),
    loading: false,
    setLoading: vi.fn(),
    error: null as string | null,
    setError: vi.fn(),
};
vi.mock('@/store/auth.store', () => ({ useAuthStore: () => authState }));

import { LoginForm } from './LoginForm';
import { authService } from '@/services/auth.service';

const svc = authService as unknown as Record<string, ReturnType<typeof vi.fn>>;

const pendingDeletionError = {
    response: {
        status: 403,
        data: {
            code: 'ACCOUNT_PENDING_DELETION',
            message: 'This account is scheduled for deletion.',
            details: { deletionScheduledAt: '2026-10-24T08:00:00.000Z' },
        },
    },
};

async function signIn() {
    const user = userEvent.setup();
    render(
        <MemoryRouter>
            <LoginForm onSuccess={() => undefined} />
        </MemoryRouter>,
    );
    await user.type(screen.getByPlaceholderText(/email or username/i), 'player@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'Secret123!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    return user;
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('LoginForm — account pending deletion', () => {
    it('offers to restore the account instead of showing a login failure', async () => {
        svc.login.mockRejectedValue(pendingDeletionError);

        await signIn();

        expect(await screen.findByText(/scheduled for deletion/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /restore my account/i })).toBeInTheDocument();
        expect(authState.setError).not.toHaveBeenCalledWith(expect.stringMatching(/.+/));
    });

    it('restores with the same credentials and signs in', async () => {
        svc.login.mockRejectedValue(pendingDeletionError);
        svc.restoreAccount.mockResolvedValue({
            access_token: 'token',
            user: { userId: '1', role: 'PLAYER' },
        });

        const user = await signIn();
        await user.click(await screen.findByRole('button', { name: /restore my account/i }));

        await waitFor(() =>
            expect(svc.restoreAccount).toHaveBeenCalledWith({
                email: 'player@example.com',
                password: 'Secret123!',
            }),
        );
        expect(authState.setAuth).toHaveBeenCalledWith({ userId: '1', role: 'PLAYER' }, 'token');
    });
});
