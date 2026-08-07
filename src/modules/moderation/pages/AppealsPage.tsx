import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CheckCircle2,
    Gavel,
    Inbox,
    Loader2,
    Scale,
    XCircle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

import type { Appeal, AppealStatus } from '@/services/moderation.service';
import {
    useAppealDecision,
    useAppeals,
    useStartAppealReview,
    extractErrorMessage,
} from '@/shared/hooks/useModeration';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

import { AppealStatusBadge, SanctionBadge } from '../components/badges';

const FILTERS: Array<{ label: string; value: AppealStatus | 'ALL' }> = [
    { label: 'Awaiting decision', value: 'SUBMITTED' },
    { label: 'Under review', value: 'UNDER_REVIEW' },
    { label: 'Upheld', value: 'ACCEPTED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'All', value: 'ALL' },
];

/**
 * The appeals queue and decision surface.
 *
 * An appeal is a second look by someone who was not involved the first time,
 * so the review panel deliberately shows the original decision alongside what
 * the user says about it.
 */
export default function AppealsPage() {
    const [statusFilter, setStatusFilter] = useState<AppealStatus | 'ALL'>(
        'SUBMITTED',
    );
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Appeal | null>(null);

    const { data, isLoading, isError, error } = useAppeals({
        page,
        limit: 20,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
    });

    return (
        <div className="space-y-6">
            <header>
                <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
                    <Scale className="h-6 w-6 text-primary" aria-hidden="true" />
                    Appeals
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Users contesting a moderation decision. You cannot rule on an
                    appeal against a decision you made yourself.
                </p>
            </header>

            <nav aria-label="Filter appeals" className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => {
                            setStatusFilter(filter.value);
                            setPage(1);
                        }}
                        aria-pressed={statusFilter === filter.value}
                        className={cn(
                            'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            statusFilter === filter.value
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-background text-muted-foreground hover:bg-accent',
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </nav>

            <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <h2 className="sr-only">Appeal list</h2>

                {isLoading ? (
                    <div className="flex h-48 items-center justify-center" aria-busy="true">
                        <Loader2
                            className="h-5 w-5 animate-spin text-muted-foreground"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Loading appeals</span>
                    </div>
                ) : isError ? (
                    <p role="alert" className="px-5 py-12 text-center text-sm text-destructive">
                        {extractErrorMessage(error)}
                    </p>
                ) : data?.items.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                        <Inbox
                            className="mx-auto mb-3 h-8 w-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="text-sm font-medium">No appeals here</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Nothing is waiting in this view.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y">
                        {data?.items.map((appeal) => (
                            <li key={appeal.id} className="px-5 py-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-xs font-semibold">
                                                {appeal.appealNumber}
                                            </span>
                                            <AppealStatusBadge
                                                status={appeal.status}
                                            />
                                            {appeal.sanction && (
                                                <SanctionBadge
                                                    type={appeal.sanction.type}
                                                />
                                            )}
                                        </div>

                                        <p className="mt-1.5 text-sm">
                                            <span className="font-medium">
                                                {appeal.appellant?.fullName ??
                                                    'Unknown user'}
                                            </span>{' '}
                                            <span className="text-muted-foreground">
                                                is contesting{' '}
                                                {appeal.subjectType.toLowerCase()}
                                            </span>
                                        </p>

                                        <p className="mt-1 line-clamp-2 text-sm text-foreground/90">
                                            {appeal.reason}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Submitted{' '}
                                            {formatDistanceToNow(
                                                new Date(appeal.createdAt),
                                                { addSuffix: true },
                                            )}
                                            {appeal.reviewer &&
                                                ` · reviewed by ${appeal.reviewer.fullName}`}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        {appeal.appellant && (
                                            <Link
                                                to={`/dashboard/moderation/users/${appeal.appellantId}`}
                                                className="rounded-md border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                View account
                                            </Link>
                                        )}
                                        {(appeal.status === 'SUBMITTED' ||
                                            appeal.status === 'UNDER_REVIEW') && (
                                            <Button
                                                size="sm"
                                                onClick={() => setSelected(appeal)}
                                            >
                                                <Gavel
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                                Review
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {appeal.moderatorResponse && (
                                    <div className="mt-3 rounded-lg border-l-4 border-primary/40 bg-muted/40 px-3 py-2">
                                        <p className="text-xs font-semibold text-muted-foreground">
                                            Decision
                                        </p>
                                        <p className="mt-0.5 text-sm">
                                            {appeal.moderatorResponse}
                                        </p>
                                        {appeal.reviewedAt && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {format(
                                                    new Date(appeal.reviewedAt),
                                                    'dd MMM yyyy, HH:mm',
                                                )}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {data && data.totalPages > 1 && (
                    <nav
                        aria-label="Appeals pagination"
                        className="flex items-center justify-between border-t px-5 py-3"
                    >
                        <p className="text-xs text-muted-foreground">
                            Page {data.page} of {data.totalPages}
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
                <AppealReviewDialog
                    appeal={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}

function AppealReviewDialog({
    appeal,
    onClose,
}: {
    appeal: Appeal;
    onClose: () => void;
}) {
    const [response, setResponse] = useState('');
    const [touched, setTouched] = useState(false);

    const decide = useAppealDecision(appeal.id);
    const startReview = useStartAppealReview(appeal.id);

    const tooShort = response.trim().length < 10;
    const showError = touched && tooShort;

    const submit = (decision: 'ACCEPTED' | 'REJECTED') => {
        setTouched(true);
        if (tooShort) return;

        decide.mutate(
            { decision, moderatorResponse: response.trim() },
            { onSuccess: onClose },
        );
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Review appeal {appeal.appealNumber}</DialogTitle>
                    <DialogDescription>
                        Judge the appeal on its own merits. Your response is sent
                        to the user in full.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* The decision being contested */}
                    {appeal.sanction && (
                        <section className="rounded-lg border bg-muted/40 p-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                The original decision
                            </h3>
                            <div className="mt-2 flex items-center gap-2">
                                <SanctionBadge type={appeal.sanction.type} />
                                <span className="text-xs text-muted-foreground">
                                    {format(
                                        new Date(appeal.sanction.createdAt),
                                        'dd MMM yyyy',
                                    )}
                                </span>
                            </div>
                            <p className="mt-2 text-sm">{appeal.sanction.reason}</p>
                        </section>
                    )}

                    {/* What the user says */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            What {appeal.appellant?.fullName ?? 'the user'} says
                        </h3>
                        <p className="mt-2 whitespace-pre-wrap text-sm">
                            {appeal.reason}
                        </p>

                        {appeal.supportingEvidence && (
                            <>
                                <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Supporting evidence
                                </h4>
                                <p className="mt-1 whitespace-pre-wrap text-sm">
                                    {appeal.supportingEvidence}
                                </p>
                            </>
                        )}

                        {(appeal.attachments?.length ?? 0) > 0 && (
                            <ul className="mt-2 space-y-1">
                                {appeal.attachments?.map((url) => (
                                    <li
                                        key={url}
                                        className="break-all rounded bg-muted/50 px-2 py-1 font-mono text-xs"
                                    >
                                        {url}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {appeal.status === 'SUBMITTED' && (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={startReview.isPending}
                            onClick={() => startReview.mutate()}
                        >
                            Claim this appeal for review
                        </Button>
                    )}

                    {/* Decision */}
                    <div className="space-y-2">
                        <Label htmlFor="appeal-response">
                            Your response to the user{' '}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                            <span className="sr-only">(required)</span>
                        </Label>
                        <Textarea
                            id="appeal-response"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            onBlur={() => setTouched(true)}
                            rows={4}
                            required
                            aria-required="true"
                            aria-invalid={showError}
                            aria-describedby="appeal-response-help"
                            placeholder="Explain what you reviewed and how you reached your conclusion."
                            className={cn(showError && 'border-destructive')}
                        />
                        <p
                            id="appeal-response-help"
                            className={cn(
                                'text-xs',
                                showError
                                    ? 'text-destructive'
                                    : 'text-muted-foreground',
                            )}
                            role={showError ? 'alert' : undefined}
                        >
                            {showError
                                ? 'Give at least 10 characters — this is sent to the user.'
                                : 'Sent to the user verbatim. Be specific and civil.'}
                        </p>
                    </div>

                    <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        Upholding an appeal reverses the sanction and reopens the
                        originating case. Rejecting it is final — the same
                        decision cannot be appealed twice.
                    </p>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={decide.isPending}
                        onClick={() => submit('REJECTED')}
                    >
                        <XCircle className="h-4 w-4" aria-hidden="true" />
                        Reject appeal
                    </Button>
                    <Button
                        disabled={decide.isPending}
                        onClick={() => submit('ACCEPTED')}
                    >
                        {decide.isPending ? (
                            <Loader2
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        )}
                        Uphold appeal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
