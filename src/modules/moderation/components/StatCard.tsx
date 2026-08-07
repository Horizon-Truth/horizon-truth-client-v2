import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';

export interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    /** Short qualifier under the number, e.g. "last 7 days". */
    hint?: string;
    /** Emphasis for counts that demand attention. */
    tone?: 'default' | 'warning' | 'critical' | 'positive';
    /** Makes the whole card a link into the filtered queue. */
    to?: string;
    isLoading?: boolean;
}

const TONE_CLASSES = {
    default: 'text-foreground',
    warning: 'text-amber-600 dark:text-amber-400',
    critical: 'text-red-600 dark:text-red-400',
    positive: 'text-emerald-600 dark:text-emerald-400',
} as const;

const ICON_TONE_CLASSES = {
    default: 'bg-primary/10 text-primary',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    critical: 'bg-red-500/10 text-red-600 dark:text-red-400',
    positive: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
} as const;

export function StatCard({
    label,
    value,
    icon: Icon,
    hint,
    tone = 'default',
    to,
    isLoading = false,
}: StatCardProps) {
    const body = (
        <div
            className={cn(
                'flex h-full items-start gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-colors',
                to &&
                    'hover:border-primary/40 hover:bg-accent/40 focus-within:border-primary/40',
            )}
        >
            <span
                className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-lg',
                    ICON_TONE_CLASSES[tone],
                )}
            >
                <Icon className="h-5 w-5" aria-hidden="true" />
            </span>

            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>

                {isLoading ? (
                    <div
                        className="mt-2 h-7 w-16 animate-pulse rounded bg-muted"
                        aria-hidden="true"
                    />
                ) : (
                    <p
                        className={cn(
                            'mt-1 text-2xl font-bold tabular-nums',
                            TONE_CLASSES[tone],
                        )}
                    >
                        {value}
                    </p>
                )}

                {hint && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {hint}
                    </p>
                )}
            </div>
        </div>
    );

    if (!to) return body;

    return (
        <Link
            to={to}
            className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`${label}: ${isLoading ? 'loading' : value}`}
        >
            {body}
        </Link>
    );
}
