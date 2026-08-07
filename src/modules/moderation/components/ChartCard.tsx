import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

export interface ChartCardProps {
    title: string;
    /** One line explaining what the chart shows and over what window. */
    description?: string;
    action?: ReactNode;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyMessage?: string;
    className?: string;
    children: ReactNode;
}

/**
 * Frame for a chart: title, caption, and the three states a chart can be in.
 *
 * Charts are wrapped in `role="img"` with a text label at the call site so a
 * screen-reader user is told what the visual conveys instead of hearing a
 * stream of SVG.
 */
export function ChartCard({
    title,
    description,
    action,
    isLoading = false,
    isEmpty = false,
    emptyMessage = 'No data in this period.',
    className,
    children,
}: ChartCardProps) {
    return (
        <section
            className={cn(
                'rounded-xl border bg-card p-5 text-card-foreground shadow-sm',
                className,
            )}
            aria-busy={isLoading}
        >
            <header className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{title}</h3>
                    {description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {action}
            </header>

            {isLoading ? (
                <div
                    className="h-64 animate-pulse rounded-lg bg-muted"
                    aria-hidden="true"
                />
            ) : isEmpty ? (
                <p className="grid h-64 place-items-center text-sm text-muted-foreground">
                    {emptyMessage}
                </p>
            ) : (
                children
            )}
        </section>
    );
}
