import { useState } from 'react';
import {
    CheckCircle2,
    Clock,
    Gavel,
    Loader2,
    ScrollText,
    ShieldCheck,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    moderationService,
    type OwnSanction,
} from '@/services/moderation.service';
import {
    moderationKeys,
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
import { APPEAL_STATUS_TONE, SANCTION_TONE } from '../constants';

const MIN_APPEAL_REASON = 20;

const SANCTION_LABEL: Record<OwnSanction['type'], string> = {
    WARNING: 'Warning',
    TEMPORARY_SUSPENSION: 'Temporary suspension',
    PERMANENT_SUSPENSION: 'Permanent suspension',
    BAN: 'Account ban',
};

/**
 * A user's own moderation record: what was decided about them, why, and how to
 * contest it.
 *
 * This is the counterpart to the moderator's user profile, and deliberately
 * shows less. It exists because a sanction the recipient cannot see or
 * challenge is not moderation, it is just punishment.
 */
export default function MyRecordPage() {
    const queryClient = useQueryClient();
    const [appealing, setAppealing] = useState<OwnSanction | null>(null);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [...moderationKeys.all, 'my-record'],
        queryFn: () => moderationService.getMyRecord(),
    });

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center" aria-busy="true">
                <Loader2
                    className="h-6 w-6 animate-spin text-muted-foreground"
                    aria-hidden="true"
                />
                <span className="sr-only">Loading your record</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center"
            >
                <h1 className="text-lg font-semibold">Record unavailable</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {extractErrorMessage(error)}
                </p>
            </div>
        );
    }

    const sanctions = data?.sanctions ?? [];
    const appeals = data?.appeals ?? [];
    const active = sanctions.filter((s) => s.status === 'ACTIVE');

    const appealBySanction = new Map(
        appeals.filter((a) => a.sanctionId).map((a) => [a.sanctionId, a]),
    );

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <header>
                <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
                    <ScrollText className="h-6 w-6 text-primary" aria-hidden="true" />
                    My moderation record
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Decisions about your account, and how to contest them.
                </p>
            </header>

            {/* --- Clean record --- */}
            {sanctions.length === 0 && (
                <div className="rounded-xl border bg-card p-8 text-center">
                    <ShieldCheck
                        className="mx-auto mb-3 h-10 w-10 text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                    />
                    <h2 className="text-lg font-semibold">Your record is clear</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        No warnings, suspensions or other moderation actions have
                        been applied to your account.
                    </p>
                </div>
            )}

            {/* --- Active restrictions --- */}
            {active.length > 0 && (
                <section
                    aria-labelledby="active-heading"
                    className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10"
                >
                    <h2
                        id="active-heading"
                        className="text-sm font-semibold text-amber-900 dark:text-amber-200"
                    >
                        Currently in effect
                    </h2>
                    <ul className="mt-3 space-y-3">
                        {active.map((s) => (
                            <li key={s.id} className="text-sm">
                                <p className="font-semibold text-amber-900 dark:text-amber-200">
                                    {SANCTION_LABEL[s.type]}
                                    {s.expiresAt && (
                                        <span className="ml-2 font-normal">
                                            until{' '}
                                            {format(
                                                new Date(s.expiresAt),
                                                'd MMMM yyyy',
                                            )}
                                        </span>
                                    )}
                                </p>
                                {s.expiresAt && (
                                    <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-300">
                                        This lifts automatically —{' '}
                                        {formatDistanceToNow(new Date(s.expiresAt))}{' '}
                                        remaining. You do not need to contact
                                        anyone.
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* --- Full history --- */}
            {sanctions.length > 0 && (
                <section
                    aria-labelledby="history-heading"
                    className="overflow-hidden rounded-xl border bg-card shadow-sm"
                >
                    <header className="border-b px-5 py-4">
                        <h2 id="history-heading" className="text-sm font-semibold">
                            History
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            You can appeal a decision within{' '}
                            {data?.appealWindowDays ?? 30} days of it being made.
                        </p>
                    </header>

                    <ul className="divide-y">
                        {sanctions.map((s) => {
                            const tone = SANCTION_TONE[s.type];
                            const existingAppeal = appealBySanction.get(s.id);

                            return (
                                <li key={s.id} className="px-5 py-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={cn(
                                                        'rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                                                        tone.className,
                                                    )}
                                                >
                                                    {SANCTION_LABEL[s.type]}
                                                </span>
                                                {s.status === 'OVERTURNED' && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                        <CheckCircle2
                                                            className="h-3.5 w-3.5"
                                                            aria-hidden="true"
                                                        />
                                                        Overturned on appeal
                                                    </span>
                                                )}
                                                {s.status === 'EXPIRED' && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Expired
                                                    </span>
                                                )}
                                                {s.status === 'REVOKED' && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Lifted early
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 text-sm">{s.reason}</p>

                                            <time
                                                dateTime={s.createdAt}
                                                className="mt-1 block text-xs text-muted-foreground"
                                            >
                                                {format(
                                                    new Date(s.createdAt),
                                                    'd MMMM yyyy',
                                                )}
                                            </time>
                                        </div>

                                        {s.isAppealable && !existingAppeal && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setAppealing(s)}
                                            >
                                                <Gavel
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                                Appeal
                                            </Button>
                                        )}
                                    </div>

                                    {existingAppeal && (
                                        <div className="mt-3 rounded-lg border-l-4 border-primary/40 bg-muted/40 px-3 py-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-xs">
                                                    {existingAppeal.appealNumber}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                                                        APPEAL_STATUS_TONE[
                                                            existingAppeal.status
                                                        ].className,
                                                    )}
                                                >
                                                    {
                                                        APPEAL_STATUS_TONE[
                                                            existingAppeal.status
                                                        ].label
                                                    }
                                                </span>
                                            </div>

                                            {existingAppeal.moderatorResponse ? (
                                                <>
                                                    <p className="mt-2 text-xs font-semibold text-muted-foreground">
                                                        Reviewer's response
                                                    </p>
                                                    <p className="mt-0.5 text-sm">
                                                        {
                                                            existingAppeal.moderatorResponse
                                                        }
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock
                                                        className="h-3.5 w-3.5"
                                                        aria-hidden="true"
                                                    />
                                                    Waiting for review. Someone
                                                    other than the original
                                                    decision-maker will look at it.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            {/* --- Appeals not tied to a sanction --- */}
            {appeals.some((a) => !a.sanctionId) && (
                <section
                    aria-labelledby="other-appeals-heading"
                    className="overflow-hidden rounded-xl border bg-card shadow-sm"
                >
                    <h2
                        id="other-appeals-heading"
                        className="border-b px-5 py-4 text-sm font-semibold"
                    >
                        Other appeals
                    </h2>
                    <ul className="divide-y">
                        {appeals
                            .filter((a) => !a.sanctionId)
                            .map((a) => (
                                <li key={a.id} className="px-5 py-4 text-sm">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-xs">
                                            {a.appealNumber}
                                        </span>
                                        <span
                                            className={cn(
                                                'rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                                                APPEAL_STATUS_TONE[a.status]
                                                    .className,
                                            )}
                                        >
                                            {APPEAL_STATUS_TONE[a.status].label}
                                        </span>
                                    </div>
                                    <p className="mt-1.5">{a.reason}</p>
                                    {a.moderatorResponse && (
                                        <p className="mt-1.5 text-sm text-muted-foreground">
                                            <span className="font-semibold">
                                                Response:{' '}
                                            </span>
                                            {a.moderatorResponse}
                                        </p>
                                    )}
                                </li>
                            ))}
                    </ul>
                </section>
            )}

            {appealing && (
                <AppealDialog
                    sanction={appealing}
                    onClose={() => setAppealing(null)}
                    onSubmitted={() => {
                        setAppealing(null);
                        void queryClient.invalidateQueries({
                            queryKey: moderationKeys.all,
                        });
                    }}
                />
            )}
        </div>
    );
}

function AppealDialog({
    sanction,
    onClose,
    onSubmitted,
}: {
    sanction: OwnSanction;
    onClose: () => void;
    onSubmitted: () => void;
}) {
    const [reason, setReason] = useState('');
    const [evidence, setEvidence] = useState('');
    const [touched, setTouched] = useState(false);

    const submit = useMutation({
        mutationFn: () =>
            moderationService.submitAppeal({
                subjectType: 'SANCTION',
                sanctionId: sanction.id,
                reason: reason.trim(),
                supportingEvidence: evidence.trim() || undefined,
            }),
        onSuccess: () => {
            toast.success('Appeal submitted — you will be notified of the outcome');
            onSubmitted();
        },
        onError: (error) => toast.error(extractErrorMessage(error)),
    });

    const tooShort = reason.trim().length < MIN_APPEAL_REASON;
    const showError = touched && tooShort;

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Appeal this decision</DialogTitle>
                    <DialogDescription>
                        Someone who was not involved in the original decision will
                        review this.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="rounded-lg border bg-muted/40 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            The decision you are appealing
                        </p>
                        <p className="mt-1 text-sm font-medium">
                            {SANCTION_LABEL[sanction.type]} ·{' '}
                            {format(new Date(sanction.createdAt), 'd MMMM yyyy')}
                        </p>
                        <p className="mt-1 text-sm">{sanction.reason}</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="appeal-reason">
                            Why do you think this was wrong?{' '}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                            <span className="sr-only">(required)</span>
                        </Label>
                        <Textarea
                            id="appeal-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            onBlur={() => setTouched(true)}
                            rows={4}
                            required
                            aria-required="true"
                            aria-invalid={showError}
                            aria-describedby="appeal-reason-help"
                            placeholder="Explain what the reviewer may have missed, or what context changes the picture."
                            className={cn(showError && 'border-destructive')}
                        />
                        <p
                            id="appeal-reason-help"
                            className={cn(
                                'text-xs',
                                showError
                                    ? 'text-destructive'
                                    : 'text-muted-foreground',
                            )}
                            role={showError ? 'alert' : undefined}
                        >
                            {showError
                                ? `Please write at least ${MIN_APPEAL_REASON} characters.`
                                : 'Be specific. Restating that you disagree is less useful than explaining what was misread.'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="appeal-evidence">
                            Anything that supports this? (optional)
                        </Label>
                        <Textarea
                            id="appeal-evidence"
                            value={evidence}
                            onChange={(e) => setEvidence(e.target.value)}
                            rows={3}
                            placeholder="Links, dates, or context a reviewer could check."
                        />
                    </div>

                    <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        You can appeal a decision once. If the appeal is rejected,
                        the decision stands and cannot be appealed again.
                    </p>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={submit.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={tooShort || submit.isPending}
                        onClick={() => {
                            setTouched(true);
                            if (!tooShort) submit.mutate();
                        }}
                    >
                        {submit.isPending ? (
                            <Loader2
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            <Gavel className="h-4 w-4" aria-hidden="true" />
                        )}
                        Submit appeal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
