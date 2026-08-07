import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { actionLabel } from '../constants';
import type { TimelineEvent } from '@/services/moderation.service';

/** Actions that changed something a user would feel. */
const ENFORCEMENT_ACTIONS = new Set([
    'CONTENT_HIDDEN',
    'CONTENT_DELETED',
    'USER_WARNED',
    'USER_SUSPENDED',
    'USER_BANNED',
]);

const POSITIVE_ACTIONS = new Set([
    'CONTENT_RESTORED',
    'USER_RESTORED',
    'APPEAL_ACCEPTED',
    'APPROVED',
]);

/**
 * The complete history of a case, oldest first.
 *
 * Rendered as an ordered list rather than a set of divs so the sequence is
 * conveyed to a screen reader, and so it prints legibly when a case has to be
 * exported for a review.
 */
export function CaseTimeline({ events }: { events: TimelineEvent[] }) {
    if (events.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-muted-foreground">
                No activity recorded yet.
            </p>
        );
    }

    return (
        <ol className="relative space-y-0">
            {events.map((event, index) => {
                const isEnforcement = ENFORCEMENT_ACTIONS.has(event.action);
                const isPositive = POSITIVE_ACTIONS.has(event.action);
                const isLast = index === events.length - 1;

                return (
                    <li key={`${event.kind}-${event.id}`} className="flex gap-4">
                        {/* Rail */}
                        <div
                            className="flex flex-col items-center"
                            aria-hidden="true"
                        >
                            <span
                                className={cn(
                                    'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4',
                                    isEnforcement
                                        ? 'bg-red-500 ring-red-500/15'
                                        : isPositive
                                          ? 'bg-emerald-500 ring-emerald-500/15'
                                          : event.kind === 'STATUS'
                                            ? 'bg-primary ring-primary/15'
                                            : 'bg-muted-foreground/50 ring-muted',
                                )}
                            />
                            {!isLast && (
                                <span className="w-px flex-1 bg-border" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1 pb-6">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                <p
                                    className={cn(
                                        'text-sm font-semibold',
                                        isEnforcement &&
                                            'text-red-700 dark:text-red-300',
                                        isPositive &&
                                            'text-emerald-700 dark:text-emerald-300',
                                    )}
                                >
                                    {event.kind === 'STATUS'
                                        ? event.action
                                        : actionLabel(event.action)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {event.actorName ?? 'System'}
                                </p>
                                <time
                                    dateTime={event.at}
                                    className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground"
                                >
                                    {format(new Date(event.at), 'dd MMM yyyy, HH:mm')}
                                </time>
                            </div>

                            {event.reason && (
                                <p className="mt-1 text-sm text-foreground/90">
                                    {event.reason}
                                </p>
                            )}

                            {event.notes && event.notes !== event.reason && (
                                <p className="mt-1 text-sm italic text-muted-foreground">
                                    {event.notes}
                                </p>
                            )}

                            {(event.previousValue || event.newValue) && (
                                <ValueDiff
                                    previous={event.previousValue}
                                    next={event.newValue}
                                />
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

/**
 * Renders the before/after of an action compactly. Only keys that actually
 * changed are shown — a full JSON dump buries the one field that matters.
 */
function ValueDiff({
    previous,
    next,
}: {
    previous: Record<string, unknown> | null;
    next: Record<string, unknown> | null;
}) {
    const keys = [
        ...new Set([
            ...Object.keys(previous ?? {}),
            ...Object.keys(next ?? {}),
        ]),
    ].filter((key) => stringify(previous?.[key]) !== stringify(next?.[key]));

    if (keys.length === 0) return null;

    return (
        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {keys.map((key) => (
                <div key={key} className="flex items-center gap-1.5">
                    <dt className="text-muted-foreground">{humanise(key)}:</dt>
                    <dd className="flex items-center gap-1.5">
                        {previous?.[key] !== undefined && (
                            <>
                                <span className="text-muted-foreground line-through">
                                    {stringify(previous[key])}
                                </span>
                                <span
                                    className="text-muted-foreground"
                                    aria-label="changed to"
                                >
                                    →
                                </span>
                            </>
                        )}
                        <span className="font-medium">
                            {stringify(next?.[key])}
                        </span>
                    </dd>
                </div>
            ))}
        </dl>
    );
}

function stringify(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (Array.isArray(value)) return value.join(', ') || '—';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

function humanise(key: string): string {
    return key
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/^\w/, (c) => c.toUpperCase());
}
