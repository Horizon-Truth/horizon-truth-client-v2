import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import {
    useMarkNotificationsRead,
    useModerationNotifications,
} from '@/shared/hooks/useModeration';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/shared/lib/utils';

/** Notification types that concern the recipient personally. */
const PERSONAL_TYPES = new Set([
    'WARNING_ISSUED',
    'CONTENT_REMOVED',
    'APPEAL_RESULT',
    'ACCOUNT_SUSPENDED',
    'ACCOUNT_RESTORED',
]);

/**
 * The moderation inbox in the header.
 *
 * Shown to everyone, not just moderators: a warned or suspended user needs to
 * see the decision as much as a moderator needs to see a new report. The
 * endpoint scopes every query to the caller, so the same component serves both
 * without a role check.
 */
export function NotificationBell() {
    const { isAuthenticated } = useAuthStore();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading } = useModerationNotifications(false);
    const markRead = useMarkNotificationsRead();

    const unread = data?.unreadCount ?? 0;
    const items = data?.items ?? [];

    // Close on outside click and on Escape — a dropdown that traps the user is
    // worse than no dropdown.
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={
                    unread > 0
                        ? `Notifications, ${unread} unread`
                        : 'Notifications'
                }
                aria-expanded={open}
                aria-haspopup="true"
                className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {unread > 0 && (
                    <span
                        className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground"
                        aria-hidden="true"
                    >
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-label="Notifications"
                    className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-card shadow-2xl"
                >
                    <header className="flex items-center justify-between border-b px-4 py-3">
                        <h2 className="text-sm font-semibold">Notifications</h2>
                        {unread > 0 && (
                            <button
                                type="button"
                                onClick={() => markRead.mutate(undefined)}
                                disabled={markRead.isPending}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                            >
                                <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                Mark all read
                            </button>
                        )}
                    </header>

                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex h-24 items-center justify-center">
                                <Loader2
                                    className="h-4 w-4 animate-spin text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <span className="sr-only">Loading notifications</span>
                            </div>
                        ) : items.length === 0 ? (
                            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                                Nothing here yet.
                            </p>
                        ) : (
                            <ul className="divide-y">
                                {items.map((item) => {
                                    const isUnread = !item.readAt;
                                    const isPersonal = PERSONAL_TYPES.has(item.type);

                                    const body = (
                                        <>
                                            <span className="flex items-start gap-2">
                                                {isUnread && (
                                                    <span
                                                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <span
                                                    className={cn(
                                                        'min-w-0 flex-1',
                                                        !isUnread && 'pl-4',
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'block text-sm',
                                                            isUnread
                                                                ? 'font-semibold'
                                                                : 'font-medium',
                                                            item.isUrgent &&
                                                                'text-destructive',
                                                        )}
                                                    >
                                                        {item.title}
                                                    </span>
                                                    <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">
                                                        {item.body}
                                                    </span>
                                                    <time
                                                        dateTime={item.createdAt}
                                                        className="mt-1 block text-[11px] text-muted-foreground"
                                                    >
                                                        {formatDistanceToNow(
                                                            new Date(item.createdAt),
                                                            { addSuffix: true },
                                                        )}
                                                    </time>
                                                </span>
                                            </span>
                                        </>
                                    );

                                    const onOpen = () => {
                                        if (isUnread) markRead.mutate([item.id]);
                                        setOpen(false);
                                    };

                                    // Personal notices route to the user's own
                                    // record, where they can appeal; everything
                                    // else follows the link the server set.
                                    const to = isPersonal
                                        ? '/dashboard/my-record'
                                        : (item.link ?? '/dashboard');

                                    return (
                                        <li key={item.id}>
                                            <Link
                                                to={to}
                                                onClick={onOpen}
                                                className={cn(
                                                    'block px-4 py-3 transition-colors hover:bg-accent/50 focus:outline-none focus-visible:bg-accent/50',
                                                    isUnread && 'bg-primary/5',
                                                )}
                                            >
                                                {body}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <footer className="border-t bg-muted/30 px-4 py-2.5">
                        <Link
                            to="/dashboard/my-record"
                            onClick={() => setOpen(false)}
                            className="text-xs font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            View my moderation record
                        </Link>
                    </footer>
                </div>
            )}
        </div>
    );
}
