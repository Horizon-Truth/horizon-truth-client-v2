import { useState } from 'react';
import { ChevronRight, Loader2, Search, ShieldCheck, X } from 'lucide-react';
import { format } from 'date-fns';

import type { AuditEntry } from '@/services/moderation.service';
import {
    useModerationAudit,
    extractErrorMessage,
} from '@/shared/hooks/useModeration';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { actionLabel } from '../constants';

const ENTITY_TYPES = [
    { label: 'All moderation activity', value: '' },
    { label: 'Cases', value: 'moderation_case' },
    { label: 'Users', value: 'user' },
    { label: 'Notes', value: 'moderation_note' },
    { label: 'Appeals', value: 'moderation_appeal' },
];

/**
 * The moderation audit trail: who did what, when, from where, and why.
 *
 * Scoped to moderation entity types. The unrestricted platform-wide trail
 * remains at /dashboard/audit-logs and is system-administrator only.
 */
export default function ModerationAuditPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [entityType, setEntityType] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [selected, setSelected] = useState<AuditEntry | null>(null);

    const { data, isLoading, isError, error } = useModerationAudit({
        page,
        limit: 25,
        search: search || undefined,
        entityType: entityType || undefined,
        from: from || undefined,
        to: to || undefined,
    });

    const hasFilters = !!(search || entityType || from || to);

    const clearFilters = () => {
        setSearch('');
        setEntityType('');
        setFrom('');
        setTo('');
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
                    <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                    Moderation audit
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Every moderation action, permanently recorded. Entries are
                    append-only — nothing here can be edited or deleted.
                </p>
            </header>

            {/* --- Filters --- */}
            <section
                aria-labelledby="audit-filters-heading"
                className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-4"
            >
                <h2 id="audit-filters-heading" className="sr-only">
                    Filter the audit trail
                </h2>

                <div className="relative md:col-span-2">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Label htmlFor="audit-search" className="sr-only">
                        Search actions, reasons, entity ids and IP addresses
                    </Label>
                    <Input
                        id="audit-search"
                        type="search"
                        defaultValue={search}
                        placeholder="Search action, reason, entity id or IP…"
                        className="pl-9"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setSearch((e.target as HTMLInputElement).value);
                                setPage(1);
                            }
                        }}
                    />
                </div>

                <div>
                    <Label htmlFor="audit-entity" className="sr-only">
                        Entity type
                    </Label>
                    <select
                        id="audit-entity"
                        value={entityType}
                        onChange={(e) => {
                            setEntityType(e.target.value);
                            setPage(1);
                        }}
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {ENTITY_TYPES.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <Label htmlFor="audit-from" className="sr-only">
                            From date
                        </Label>
                        <Input
                            id="audit-from"
                            type="date"
                            value={from}
                            onChange={(e) => {
                                setFrom(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="audit-to" className="sr-only">
                            To date
                        </Label>
                        <Input
                            id="audit-to"
                            type="date"
                            value={to}
                            onChange={(e) => {
                                setTo(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                </div>

                {hasFilters && (
                    <div className="md:col-span-4">
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4" aria-hidden="true" />
                            Clear filters
                        </Button>
                    </div>
                )}
            </section>

            {/* --- Entries --- */}
            <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <h2 className="sr-only">Audit entries</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <caption className="sr-only">
                            Moderation audit entries, newest first. Select a row
                            to see the full record.
                        </caption>
                        <thead className="border-b bg-muted/40">
                            <tr>
                                {['When', 'Who', 'Action', 'Object', 'Reason', 'Origin', ''].map(
                                    (header, i) => (
                                        <th
                                            key={i}
                                            scope="col"
                                            className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                        >
                                            {header}
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center">
                                        <Loader2
                                            className="mx-auto h-5 w-5 animate-spin text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                        <span className="sr-only">Loading entries</span>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-12 text-center text-sm text-destructive"
                                    >
                                        {extractErrorMessage(error)}
                                    </td>
                                </tr>
                            ) : data?.items.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-12 text-center text-sm text-muted-foreground"
                                    >
                                        No audit entries match these filters.
                                    </td>
                                </tr>
                            ) : (
                                data?.items.map((entry) => (
                                    <tr
                                        key={entry.id}
                                        className="cursor-pointer transition-colors hover:bg-accent/40"
                                        onClick={() => setSelected(entry)}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setSelected(entry);
                                            }
                                        }}
                                        aria-label={`Audit entry: ${entry.action} by ${entry.user?.fullName ?? 'system'}`}
                                    >
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <time
                                                dateTime={entry.createdAt}
                                                className="text-xs tabular-nums"
                                            >
                                                {format(
                                                    new Date(entry.createdAt),
                                                    'dd MMM yy, HH:mm',
                                                )}
                                            </time>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium">
                                                {entry.user?.fullName ?? 'System'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {entry.user?.username ??
                                                    'automated'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                                {actionLabel(
                                                    entry.action.replace(
                                                        'MODERATION ',
                                                        '',
                                                    ),
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs capitalize">
                                                {entry.entityType.replace(
                                                    /_/g,
                                                    ' ',
                                                )}
                                            </p>
                                            <p className="font-mono text-[10px] text-muted-foreground">
                                                {entry.entityId?.slice(0, 8)}
                                            </p>
                                        </td>
                                        <td className="max-w-xs px-4 py-3">
                                            <p className="line-clamp-1 text-xs text-muted-foreground">
                                                {entry.reason ?? '—'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-mono text-[10px] text-muted-foreground">
                                                {entry.ipAddress ?? 'unknown'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <ChevronRight
                                                className="h-4 w-4 text-muted-foreground"
                                                aria-hidden="true"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {data && data.totalPages > 1 && (
                    <nav
                        aria-label="Audit pagination"
                        className="flex items-center justify-between border-t px-4 py-3"
                    >
                        <p className="text-xs text-muted-foreground">
                            Page {data.page} of {data.totalPages} · {data.total}{' '}
                            entries
                        </p>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page >= data.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </nav>
                )}
            </section>

            {selected && (
                <AuditDetailDialog
                    entry={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}

function AuditDetailDialog({
    entry,
    onClose,
}: {
    entry: AuditEntry;
    onClose: () => void;
}) {
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Audit entry</DialogTitle>
                </DialogHeader>

                <dl className="grid grid-cols-2 gap-4 py-2 text-sm">
                    <Field label="When">
                        {format(new Date(entry.createdAt), 'PPpp')}
                    </Field>
                    <Field label="Who">
                        {entry.user?.fullName ?? 'System'}
                        {entry.user?.email && (
                            <span className="block text-xs text-muted-foreground">
                                {entry.user.email}
                            </span>
                        )}
                    </Field>
                    <Field label="Action">{entry.action}</Field>
                    <Field label="Object">
                        <span className="capitalize">
                            {entry.entityType.replace(/_/g, ' ')}
                        </span>
                        <span className="block break-all font-mono text-xs text-muted-foreground">
                            {entry.entityId}
                        </span>
                    </Field>
                    <Field label="IP address">
                        <span className="font-mono text-xs">
                            {entry.ipAddress ?? 'unknown'}
                        </span>
                    </Field>
                    <Field label="Browser">
                        <span className="text-xs text-muted-foreground">
                            {entry.userAgent ?? 'unknown'}
                        </span>
                    </Field>
                </dl>

                {entry.reason && (
                    <div className="border-t pt-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Reason given
                        </h3>
                        <p className="mt-1 text-sm">{entry.reason}</p>
                    </div>
                )}

                {(entry.previousValue || entry.newValue) && (
                    <div className="grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-2">
                        <ValuePanel
                            title="Before"
                            value={entry.previousValue}
                            className="border-red-200 dark:border-red-500/30"
                        />
                        <ValuePanel
                            title="After"
                            value={entry.newValue}
                            className="border-emerald-200 dark:border-emerald-500/30"
                        />
                    </div>
                )}

                {entry.metadata && (
                    <details className="border-t pt-4">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Raw metadata
                        </summary>
                        <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                            {JSON.stringify(entry.metadata, null, 2)}
                        </pre>
                    </details>
                )}
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-0.5">{children}</dd>
        </div>
    );
}

function ValuePanel({
    title,
    value,
    className,
}: {
    title: string;
    value: Record<string, unknown> | null | undefined;
    className?: string;
}) {
    return (
        <div className={cn('rounded-lg border p-3', className)}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
            </h3>
            {value ? (
                <dl className="mt-1.5 space-y-1">
                    {Object.entries(value).map(([key, val]) => (
                        <div key={key} className="flex gap-2 text-xs">
                            <dt className="text-muted-foreground">{key}:</dt>
                            <dd className="break-all font-medium">
                                {val === null || val === undefined
                                    ? '—'
                                    : typeof val === 'object'
                                      ? JSON.stringify(val)
                                      : String(val)}
                            </dd>
                        </div>
                    ))}
                </dl>
            ) : (
                <p className="mt-1.5 text-xs text-muted-foreground">
                    Not recorded
                </p>
            )}
        </div>
    );
}
