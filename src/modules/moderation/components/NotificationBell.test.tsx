import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { NotificationBell } from './NotificationBell';
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
            getNotifications: vi.fn(),
            markNotificationsRead: vi.fn(),
        },
    };
});

const getNotifications = vi.mocked(moderationService.getNotifications);
const markRead = vi.mocked(moderationService.markNotificationsRead);

function makeNotification(overrides = {}) {
    return {
        id: 'n1',
        type: 'NEW_REPORT',
        title: 'New report HT-4F2A19',
        body: 'Hate speech — a comment attacking a named group',
        link: '/dashboard/moderation/cases/case-1',
        isUrgent: false,
        readAt: null,
        createdAt: new Date().toISOString(),
        ...overrides,
    };
}

function renderBell(payload: {
    items?: unknown[];
    unreadCount?: number;
} = {}) {
    getNotifications.mockResolvedValue({
        items: (payload.items ?? [makeNotification()]) as never,
        total: payload.items?.length ?? 1,
        unreadCount: payload.unreadCount ?? 1,
        page: 1,
        limit: 20,
        totalPages: 1,
    });

    const client = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    return render(
        <QueryClientProvider client={client}>
            <MemoryRouter>
                <NotificationBell />
            </MemoryRouter>
        </QueryClientProvider>,
    );
}

describe('NotificationBell', () => {
    beforeEach(() => {
        getNotifications.mockReset();
        markRead.mockReset();
        markRead.mockResolvedValue({ updated: 1 });
        useAuthStore.setState({
            isAuthenticated: true,
            user: { id: 'u1', fullName: 'Test', role: 'PLAYER' },
            token: 't',
        } as never);
    });

    afterEach(() => {
        useAuthStore.setState({ isAuthenticated: false, user: null } as never);
    });

    it('renders nothing for signed-out visitors', () => {
        useAuthStore.setState({ isAuthenticated: false, user: null } as never);
        const { container } = renderBell();

        expect(container).toBeEmptyDOMElement();
    });

    it('announces the unread count in the accessible name', async () => {
        renderBell({ unreadCount: 3 });

        expect(
            await screen.findByRole('button', { name: /3 unread/i }),
        ).toBeInTheDocument();
    });

    it('drops the count from the label when nothing is unread', async () => {
        renderBell({ unreadCount: 0 });

        await waitFor(() =>
            expect(
                screen.getByRole('button', { name: 'Notifications' }),
            ).toBeInTheDocument(),
        );
    });

    it('caps the visible badge at 9+', async () => {
        renderBell({ unreadCount: 42 });

        expect(await screen.findByText('9+')).toBeInTheDocument();
    });

    it('opens the panel and lists notifications', async () => {
        const user = userEvent.setup();
        renderBell();

        await user.click(await screen.findByRole('button', { name: /notification/i }));

        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('New report HT-4F2A19')).toBeInTheDocument();
    });

    it('shows an empty state rather than a blank panel', async () => {
        const user = userEvent.setup();
        renderBell({ items: [], unreadCount: 0 });

        await user.click(await screen.findByRole('button', { name: /notification/i }));

        expect(await screen.findByText(/nothing here yet/i)).toBeInTheDocument();
    });

    it('marks everything read on request', async () => {
        const user = userEvent.setup();
        renderBell({ unreadCount: 2 });

        await user.click(await screen.findByRole('button', { name: /notification/i }));
        await user.click(await screen.findByRole('button', { name: /mark all read/i }));

        await waitFor(() => expect(markRead).toHaveBeenCalledWith(undefined));
    });

    it('offers no "mark all read" control when nothing is unread', async () => {
        const user = userEvent.setup();
        renderBell({ unreadCount: 0 });

        await user.click(await screen.findByRole('button', { name: /notification/i }));

        await screen.findByRole('dialog');
        expect(
            screen.queryByRole('button', { name: /mark all read/i }),
        ).not.toBeInTheDocument();
    });

    it('marks a single notification read when it is opened', async () => {
        const user = userEvent.setup();
        renderBell();

        await user.click(await screen.findByRole('button', { name: /notification/i }));
        await user.click(await screen.findByText('New report HT-4F2A19'));

        await waitFor(() => expect(markRead).toHaveBeenCalledWith(['n1']));
    });

    it('routes a personal notice to the user’s own record, not a case', async () => {
        const user = userEvent.setup();
        renderBell({
            items: [
                makeNotification({
                    type: 'ACCOUNT_SUSPENDED',
                    title: 'Your account has been suspended',
                    // The server link points at the profile; a suspended user
                    // needs the record page, where they can appeal.
                    link: '/dashboard/profile',
                }),
            ],
        });

        await user.click(await screen.findByRole('button', { name: /notification/i }));

        const link = await screen.findByRole('link', {
            name: /your account has been suspended/i,
        });
        expect(link).toHaveAttribute('href', '/dashboard/my-record');
    });

    it('follows the server-supplied link for moderator notices', async () => {
        const user = userEvent.setup();
        renderBell();

        await user.click(await screen.findByRole('button', { name: /notification/i }));

        const link = await screen.findByRole('link', {
            name: /new report HT-4F2A19/i,
        });
        expect(link).toHaveAttribute(
            'href',
            '/dashboard/moderation/cases/case-1',
        );
    });

    it('closes on Escape', async () => {
        const user = userEvent.setup();
        renderBell();

        await user.click(await screen.findByRole('button', { name: /notification/i }));
        await screen.findByRole('dialog');

        await user.keyboard('{Escape}');

        await waitFor(() =>
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
        );
    });

    it('always offers a route to the full record', async () => {
        const user = userEvent.setup();
        renderBell({ items: [], unreadCount: 0 });

        await user.click(await screen.findByRole('button', { name: /notification/i }));

        expect(
            await screen.findByRole('link', { name: /view my moderation record/i }),
        ).toHaveAttribute('href', '/dashboard/my-record');
    });
});
