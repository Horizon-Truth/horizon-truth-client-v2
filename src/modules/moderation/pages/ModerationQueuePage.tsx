import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Bookmark,
    BookmarkPlus,
    ChevronLeft,
    ChevronRight,
    Filter,
    Inbox,
    Search,
    Trash2,
    UserCheck,
    X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

import {
    moderationService,
    Permission,
    type IncidentSeverity,
    type ModerationCaseStatus,
    type QueueQuery,
} from '@/services/moderation.service';
import { useQueryClient } from '@tanstack/react-query';
import {
    moderationKeys,
    useDeleteSavedFilter,
    useModerationPermissions,
    useModerationQueue,
    useModerators,
    useSaveFilter,
    useSavedFilters,
    extractErrorMessage,
} from '@/shared/hooks/useModeration';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/store/auth.store';

import { CaseStatusBadge, FlagChip, SeverityBadge } from '../components/badges';
import { ModerationActionDialog } from '../components/ModerationActionDialog';
import { CASE_STATUS_TONE, REPORT_REASON_LABEL, SEVERITY_TONE, TARGET_TYPE_LABEL } from '../constants';

const STATUSES: ModerationCaseStatus[] = [
    'OPEN',
    'ASSIGNED',
    'UNDER_REVIEW',
    'AWAITING_INFO',
    'ESCALATED',
    'RESOLVED',
    'DISMISSED',
    'CLOSED',
    'DUPLICATE',
];

const SEVERITIES: IncidentSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const PAGE_SIZE = 20;

/**
 * The inbox. Search, filter, sort, page and act on many cases at once.
 *
 * Filter state lives in the URL, so a moderator can bookmark a view, share it
 * with a colleague during a handover, and use the browser's back button as an
 * undo for a filter change.
 */
export default function ModerationQueuePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { can } = useModerationPermissions();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
    const [saveFilterOpen, setSaveFilterOpen] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [bulkPending, setBulkPending] = useState(false);

    const query = useMemo<QueueQuery>(() => {
        const statuses = searchParams.getAll('status') as ModerationCaseStatus[];
        const severities = searchParams.getAll('severity') as IncidentSeverity[];

        return {
            page: Number(searchParams.get('page') ?? 1),
            limit: PAGE_SIZE,
            search: searchParams.get('search') ?? undefined,
            status: statuses.length ? statuses : undefined,
            severity: severities.length ? severities : undefined,
            mine: searchParams.get('mine') === 'true' || undefined,
            unassigned: searchParams.get('unassigned') === 'true' || undefined,
            openOnly: searchParams.get('openOnly') === 'true' || undefined,
            sortBy:
                (searchParams.get('sortBy') as QueueQuery['sortBy']) ?? 'createdAt',
            sortOrder:
                (searchParams.get('sortOrder') as 'ASC' | 'DESC') ?? 'DESC',
        };
    }, [searchParams]);

    const { data, isLoading, isError, error } = useModerationQueue(query);
    const { data: savedFilters } = useSavedFilters();
    const { data: moderators } = useModerators();
    const saveFilter = useSaveFilter();
    const deleteFilter = useDeleteSavedFilter();

    const activeFilterCount =
        (query.status?.length ?? 0) +
        (query.severity?.length ?? 0) +
        (query.mine ? 1 : 0) +
        (query.unassigned ? 1 : 0) +
        (query.openOnly ? 1 : 0);

    // --- URL helpers -----------------------------------------------------

    const patchParams = (patch: Record<string, string | string[] | null>) => {
        const next = new URLSearchParams(searchParams);

        for (const [key, value] of Object.entries(patch)) {
            next.delete(key);
            if (value === null) continue;

            if (Array.isArray(value)) {
                value.forEach((v) => next.append(key, v));
            } else {
                next.set(key, value);
            }
        }

        // Any filter change invalidates the current page number.
        if (!('page' in patch)) next.delete('page');

        setSearchParams(next);
        setSelected(new Set());
    };

    const toggleMulti = (key: 'status' | 'severity', value: string) => {
        const current = searchParams.getAll(key);
        const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];

        patchParams({ [key]: next.length ? next : null });
    };

    const toggleBool = (key: 'mine' | 'unassigned' | 'openOnly') => {
        patchParams({
            [key]: searchParams.get(key) === 'true' ? null : 'true',
        });
    };

    // --- Bulk selection --------------------------------------------------

    const allOnPageSelected =
        (data?.items.length ?? 0) > 0 &&
        data?.items.every((c) => selected.has(c.id));

    const toggleAll = () => {
        if (allOnPageSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(data?.items.map((c) => c.id) ?? []));
        }
    };

    const toggleOne = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    };

    /**
     * Bulk assign is issued as one request per case rather than a batch
     * endpoint: each assignment has to produce its own audit entry, and a
     * partial failure should leave the successful ones applied.
     */
    const bulkAssign = async (payload: { reason: string; notes?: string }) => {
        setBulkPending(true);
        const ids = [...selected];

        const results = await Promise.allSettled(
            ids.map((id) => moderationService.assignCase(id, payload)),
        );

        const failed = results.filter((r) => r.status === 'rejected');
        setBulkPending(false);
        setBulkAssignOpen(false);
        setSelected(new Set());

        if (failed.length === 0) {
            toast.success(`${ids.length} case${ids.length === 1 ? '' : 's'} claimed`);
        } else {
            toast.warning(
                `${ids.length - failed.length} of ${ids.length} claimed. ` +
                    extractErrorMessage(
                        (failed[0] as PromiseRejectedResult).reason,
                    ),
            );
        }

        // Assignment changes the row, the counts and the dashboard alike.
        queryClient.invalidateQueries({ queryKey: moderationKeys.all });
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Moderation queue
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {isLoading
                            ? 'Loading cases…'
                            : `${data?.total ?? 0} case${data?.total === 1 ? '' : 's'} match this view`}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSaveFilterOpen(true)}
                    >
                        <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                        Save this view
                    </Button>
                </div>
            </header>

            {/* --- Saved filters --- */}
            {(savedFilters?.length ?? 0) > 0 && (
                <nav aria-label="Saved views" className="flex flex-wrap gap-2">
                    {savedFilters?.map((filter) => (
                        <span
                            key={filter.id}
                            className="group inline-flex items-center overflow-hidden rounded-full border bg-card"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setSearchParams(
                                        new URLSearchParams(
                                            Object.entries(filter.query).flatMap(
                                                ([k, v]) =>
                                                    Array.isArray(v)
                                                        ? v.map((item) => [
                                                              k,
                                                              String(item),
                                                          ])
                                                        : [[k, String(v)]],
                                            ) as [string, string][],
                                        ),
                                    )
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <Bookmark className="h-3 w-3" aria-hidden="true" />
                                {filter.name}
                                {filter.isShared && (
                                    <span className="text-muted-foreground">
                                        (shared)
                                    </span>
                                )}
                            </button>
                            {filter.ownerId === user?.id && (
                                <button
                                    type="button"
                                    onClick={() => deleteFilter.mutate(filter.id)}
                                    aria-label={`Delete the saved view "${filter.name}"`}
                                    className="px-2 py-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                                </button>
                            )}
                        </span>
                    ))}
                </nav>
            )}

            {/* --- Filters --- */}
            <section
                aria-labelledby="filters-heading"
                className="space-y-4 rounded-xl border bg-card p-4 shadow-sm"
            >
                <h2 id="filters-heading" className="sr-only">
                    Filter the queue
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <Label htmlFor="queue-search" className="sr-only">
                            Search by case number, description or content
                        </Label>
                        <Input
                            id="queue-search"
                            type="search"
                            defaultValue={query.search ?? ''}
                            placeholder="Search case number, description or content…"
                            className="pl-9"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    patchParams({
                                        search:
                                            (e.target as HTMLInputElement).value ||
                                            null,
                                    });
                                }
                            }}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Label htmlFor="queue-sort" className="sr-only">
                            Sort by
                        </Label>
                        <select
                            id="queue-sort"
                            value={`${query.sortBy}:${query.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] =
                                    e.target.value.split(':');
                                patchParams({ sortBy, sortOrder });
                            }}
                            className="h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="createdAt:DESC">Newest first</option>
                            <option value="createdAt:ASC">Oldest first</option>
                            <option value="severity:DESC">Most severe</option>
                            <option value="updatedAt:DESC">
                                Recently updated
                            </option>
                        </select>

                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchParams(new URLSearchParams())}
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                                Clear ({activeFilterCount})
                            </Button>
                        )}
                    </div>
                </div>

                <fieldset className="flex flex-wrap items-center gap-2">
                    <legend className="sr-only">Quick filters</legend>
                    <FilterChip
                        label="My cases"
                        active={!!query.mine}
                        onClick={() => toggleBool('mine')}
                    />
                    <FilterChip
                        label="Unassigned"
                        active={!!query.unassigned}
                        onClick={() => toggleBool('unassigned')}
                    />
                    <FilterChip
                        label="Open only"
                        active={!!query.openOnly}
                        onClick={() => toggleBool('openOnly')}
                    />
                </fieldset>

                <fieldset className="flex flex-wrap items-center gap-2">
                    <legend className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Filter className="h-3 w-3" aria-hidden="true" />
                        Status
                    </legend>
                    {STATUSES.map((status) => (
                        <FilterChip
                            key={status}
                            label={CASE_STATUS_TONE[status].label}
                            active={query.status?.includes(status) ?? false}
                            onClick={() => toggleMulti('status', status)}
                        />
                    ))}
                </fieldset>

                <fieldset className="flex flex-wrap items-center gap-2">
                    <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Severity
                    </legend>
                    {SEVERITIES.map((severity) => (
                        <FilterChip
                            key={severity}
                            label={SEVERITY_TONE[severity].label}
                            active={query.severity?.includes(severity) ?? false}
                            onClick={() => toggleMulti('severity', severity)}
                        />
                    ))}
                </fieldset>
            </section>

            {/* --- Bulk action bar --- */}
            {selected.size > 0 && can(Permission.ASSIGN_REPORTS) && (
                <div
                    role="region"
                    aria-label="Bulk actions"
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3"
                >
                    <p className="text-sm font-medium">
                        {selected.size} case{selected.size === 1 ? '' : 's'}{' '}
                        selected
                    </p>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelected(new Set())}
                        >
                            Clear selection
                        </Button>
                        <Button size="sm" onClick={() => setBulkAssignOpen(true)}>
                            <UserCheck className="h-4 w-4" aria-hidden="true" />
                            Claim selected
                        </Button>
                    </div>
                </div>
            )}

            {/* --- Results --- */}
            <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <h2 className="sr-only">Cases</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <caption className="sr-only">
                            Moderation cases matching the current filters.
                            Select a row to open the full case.
                        </caption>
                        <thead className="border-b bg-muted/40">
                            <tr>
                                <th scope="col" className="w-10 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={allOnPageSelected}
                                        onChange={toggleAll}
                                        aria-label="Select all cases on this page"
                                        className="h-4 w-4 rounded border-input accent-primary"
                                    />
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Case
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Content
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Severity
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Status
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Owner
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Age
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={7} className="px-4 py-5">
                                            <div
                                                className="h-5 animate-pulse rounded bg-muted"
                                                aria-hidden="true"
                                            />
                                        </td>
                                    </tr>
                                ))
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
                                    <td colSpan={7} className="px-4 py-16 text-center">
                                        <Inbox
                                            className="mx-auto mb-3 h-8 w-8 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                        <p className="text-sm font-medium">
                                            No cases match this view
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {activeFilterCount > 0
                                                ? 'Try clearing a filter.'
                                                : 'The queue is empty — nothing to moderate.'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                data?.items.map((c) => (
                                    <tr
                                        key={c.id}
                                        className={cn(
                                            'transition-colors hover:bg-accent/40',
                                            selected.has(c.id) && 'bg-primary/5',
                                        )}
                                    >
                                        <td className="px-4 py-3 align-top">
                                            <input
                                                type="checkbox"
                                                checked={selected.has(c.id)}
                                                onChange={() => toggleOne(c.id)}
                                                aria-label={`Select case ${c.caseNumber}`}
                                                className="h-4 w-4 rounded border-input accent-primary"
                                            />
                                        </td>

                                        <td className="px-4 py-3 align-top">
                                            <Link
                                                to={`/dashboard/moderation/cases/${c.id}`}
                                                className="font-mono text-xs font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                {c.caseNumber}
                                            </Link>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {REPORT_REASON_LABEL[
                                                    c.reportReason
                                                ] ?? c.reportReason}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {c.isAnonymous
                                                    ? 'Anonymous reporter'
                                                    : (c.reportedByUser?.fullName ??
                                                      'Unknown reporter')}
                                            </p>
                                        </td>

                                        <td className="max-w-md px-4 py-3 align-top">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {TARGET_TYPE_LABEL[c.targetType]}
                                            </p>
                                            <p className="mt-0.5 line-clamp-2 text-sm">
                                                {c.targetPreview ?? c.description}
                                            </p>
                                            {(c.flags?.length ?? 0) > 0 && (
                                                <div className="mt-1.5 flex flex-wrap gap-1">
                                                    {c.flags?.map((f) => (
                                                        <FlagChip
                                                            key={f.id}
                                                            flag={f}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 align-top">
                                            <SeverityBadge severity={c.severity} />
                                        </td>

                                        <td className="px-4 py-3 align-top">
                                            <CaseStatusBadge status={c.status} />
                                        </td>

                                        <td className="px-4 py-3 align-top text-sm">
                                            {c.assignedModerator?.fullName ?? (
                                                <span className="text-muted-foreground">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground">
                                            {formatDistanceToNow(
                                                new Date(c.createdAt),
                                                { addSuffix: true },
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination --- */}
                {data && data.totalPages > 1 && (
                    <nav
                        aria-label="Queue pagination"
                        className="flex items-center justify-between border-t px-4 py-3"
                    >
                        <p className="text-xs text-muted-foreground">
                            Page {data.page} of {data.totalPages} · {data.total}{' '}
                            cases
                        </p>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={data.page <= 1}
                                onClick={() =>
                                    patchParams({ page: String(data.page - 1) })
                                }
                            >
                                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={data.page >= data.totalPages}
                                onClick={() =>
                                    patchParams({ page: String(data.page + 1) })
                                }
                            >
                                Next
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </div>
                    </nav>
                )}
            </section>

            {/* --- Dialogs --- */}
            <ModerationActionDialog
                open={bulkAssignOpen}
                onOpenChange={setBulkAssignOpen}
                title={`Claim ${selected.size} case${selected.size === 1 ? '' : 's'}`}
                description="You will become the owner of every selected case. Each assignment is recorded separately in the audit trail."
                confirmLabel="Claim cases"
                isPending={bulkPending}
                onConfirm={bulkAssign}
                reasonPresets={[
                    'Picking up unassigned work from the triage queue.',
                    'Taking ownership during my moderation shift.',
                ]}
            />

            <SaveFilterDialog
                open={saveFilterOpen}
                onOpenChange={setSaveFilterOpen}
                name={filterName}
                onNameChange={setFilterName}
                canShare={can(Permission.MANAGE_FLAGS)}
                isPending={saveFilter.isPending}
                onSave={(isShared) => {
                    saveFilter.mutate(
                        {
                            name: filterName,
                            query: Object.fromEntries(searchParams.entries()),
                            isShared,
                        },
                        {
                            onSuccess: () => {
                                setSaveFilterOpen(false);
                                setFilterName('');
                            },
                        },
                    );
                }}
            />

            {/* Announce result-count changes to assistive technology. */}
            <p aria-live="polite" className="sr-only">
                {isLoading
                    ? 'Loading cases'
                    : `${data?.total ?? 0} cases found`}
            </p>

            {/* Referenced for keyboard users scanning owners. */}
            <span className="sr-only">
                {moderators?.length ?? 0} moderators available for assignment.
            </span>
        </div>
    );
}

function FilterChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
        >
            {label}
        </button>
    );
}

function SaveFilterDialog({
    open,
    onOpenChange,
    name,
    onNameChange,
    canShare,
    isPending,
    onSave,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    name: string;
    onNameChange: (name: string) => void;
    canShare: boolean;
    isPending: boolean;
    onSave: (isShared: boolean) => void;
}) {
    const [isShared, setIsShared] = useState(false);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-filter-title"
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onOpenChange(false);
            }}
        >
            <div className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-lg">
                <h2 id="save-filter-title" className="text-lg font-semibold">
                    Save this view
                </h2>
                <p className="text-sm text-muted-foreground">
                    The current search, filters and sort order are saved together.
                </p>

                <div className="space-y-2">
                    <Label htmlFor="filter-name">Name</Label>
                    <Input
                        id="filter-name"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Unassigned critical"
                        autoFocus
                    />
                </div>

                {canShare && (
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={isShared}
                            onChange={(e) => setIsShared(e.target.checked)}
                            className="h-4 w-4 rounded border-input accent-primary"
                        />
                        Share with the whole moderation team
                    </label>
                )}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!name.trim() || isPending}
                        onClick={() => onSave(isShared)}
                    >
                        Save view
                    </Button>
                </div>
            </div>
        </div>
    );
}
