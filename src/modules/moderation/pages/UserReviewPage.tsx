import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowLeft,
    Ban,
    Gavel,
    Loader2,
    MessageSquarePlus,
    RotateCcw,
    ShieldCheck,
    UserMinus,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

import { Permission, moderationService } from '@/services/moderation.service';
import {
    useModerationPermissions,
    useUserModerationProfile,
    useUserSanction,
    extractErrorMessage,
} from '@/shared/hooks/useModeration';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

import { ModerationActionDialog } from '../components/ModerationActionDialog';
import {
    CaseStatusBadge,
    SanctionBadge,
    SeverityBadge,
} from '../components/badges';
import { REPORT_REASON_LABEL, riskBand } from '../constants';

type UserAction = 'warn' | 'suspend' | 'ban' | 'restore' | null;

/**
 * Everything known about one account, so an enforcement decision is made
 * against the full history rather than a single report.
 */
export default function UserReviewPage() {
    const { id } = useParams<{ id: string }>();
    const { can } = useModerationPermissions();
    const { data, isLoading, isError, error } = useUserModerationProfile(id);

    const [action, setAction] = useState<UserAction>(null);
    const [durationDays, setDurationDays] = useState(7);
    const [noteBody, setNoteBody] = useState('');
    const [notePending, setNotePending] = useState(false);

    const userId = id as string;
    const warn = useUserSanction(userId, 'warn');
    const suspend = useUserSanction(userId, 'suspend');
    const restore = useUserSanction(userId, 'restore');

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center" aria-busy="true">
                <Loader2
                    className="h-6 w-6 animate-spin text-muted-foreground"
                    aria-hidden="true"
                />
                <span className="sr-only">Loading profile</span>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center"
            >
                <h1 className="text-lg font-semibold">Profile unavailable</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {extractErrorMessage(error)}
                </p>
            </div>
        );
    }

    const { user, counts, riskScore, activeSanctions, sanctionHistory } = data;
    const band = riskBand(riskScore);
    const isSuspended = activeSanctions.some((s) => s.type !== 'WARNING');

    const addNote = async () => {
        setNotePending(true);
        try {
            await moderationService.addUserNote(userId, { body: noteBody.trim() });
            toast.success('Note added');
            setNoteBody('');
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setNotePending(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="space-y-3">
                <Link
                    to="/dashboard/moderation/queue"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to the queue
                </Link>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {user.fullName}
                    </h1>
                    <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {user.role}
                    </span>
                    {isSuspended && (
                        <span className="rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                            Suspended
                        </span>
                    )}
                </div>

                <p className="text-sm text-muted-foreground">
                    {user.username && `@${user.username} · `}
                    Joined {format(new Date(user.createdAt), 'dd MMM yyyy')}
                    {user.lastLoginAt &&
                        ` · last seen ${formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })}`}
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* --- Risk --- */}
                    <section
                        aria-labelledby="risk-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <div className="flex items-baseline justify-between">
                            <h2 id="risk-heading" className="text-sm font-semibold">
                                Risk score
                            </h2>
                            <p className={cn('text-sm font-semibold', band.className)}>
                                {band.label}
                            </p>
                        </div>

                        <div
                            className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted"
                            role="meter"
                            aria-valuenow={riskScore}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Risk score ${riskScore} out of 100 — ${band.label}`}
                        >
                            <div
                                className={cn(
                                    'h-full rounded-full transition-all',
                                    band.barClassName,
                                )}
                                style={{ width: `${riskScore}%` }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                            {riskScore}/100 — combines sanction history, upheld
                            reports against the account, and a decay for older
                            incidents. It informs a decision; it does not make
                            one.
                        </p>
                    </section>

                    {/* --- Counts --- */}
                    <section
                        aria-labelledby="record-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="record-heading"
                            className="mb-4 text-sm font-semibold"
                        >
                            Violation record
                        </h2>
                        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <Stat label="Reports received" value={counts.reportsReceived} />
                            <Stat
                                label="Upheld"
                                value={counts.reportsUpheld}
                                tone={counts.reportsUpheld > 0 ? 'bad' : undefined}
                            />
                            <Stat label="Dismissed" value={counts.reportsDismissed} />
                            <Stat label="Reports filed" value={counts.reportsFiled} />
                            <Stat
                                label="Warnings"
                                value={counts.warnings}
                                tone={counts.warnings > 0 ? 'warn' : undefined}
                            />
                            <Stat
                                label="Suspensions"
                                value={counts.suspensions}
                                tone={counts.suspensions > 0 ? 'bad' : undefined}
                            />
                            <Stat label="Appeals" value={counts.appeals} />
                            <Stat
                                label="Appeals upheld"
                                value={counts.appealsUpheld}
                                tone={counts.appealsUpheld > 0 ? 'warn' : undefined}
                            />
                        </dl>

                        {counts.appealsUpheld > 0 && (
                            <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                                <AlertTriangle
                                    className="mt-0.5 h-4 w-4 shrink-0"
                                    aria-hidden="true"
                                />
                                {counts.appealsUpheld} previous sanction
                                {counts.appealsUpheld === 1 ? ' was' : 's were'}{' '}
                                overturned on appeal. Read the earlier decisions
                                before adding another.
                            </p>
                        )}
                    </section>

                    {/* --- Reports against --- */}
                    <section
                        aria-labelledby="reports-heading"
                        className="overflow-hidden rounded-xl border bg-card shadow-sm"
                    >
                        <h2
                            id="reports-heading"
                            className="border-b px-5 py-3 text-sm font-semibold"
                        >
                            Reports against this account
                        </h2>

                        {data.reportsAgainst.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                                None. This account has never been reported.
                            </p>
                        ) : (
                            <ul className="divide-y">
                                {data.reportsAgainst.slice(0, 10).map((c) => (
                                    <li key={c.id}>
                                        <Link
                                            to={`/dashboard/moderation/cases/${c.id}`}
                                            className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-accent/40 focus:outline-none focus-visible:bg-accent/40"
                                        >
                                            <span className="min-w-0 flex-1">
                                                <span className="flex flex-wrap items-center gap-2">
                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        {c.caseNumber}
                                                    </span>
                                                    <CaseStatusBadge
                                                        status={c.status}
                                                    />
                                                    <SeverityBadge
                                                        severity={c.severity}
                                                    />
                                                </span>
                                                <span className="mt-1 block truncate text-sm">
                                                    {REPORT_REASON_LABEL[
                                                        c.reportReason
                                                    ] ?? c.reportReason}{' '}
                                                    — {c.description}
                                                </span>
                                            </span>
                                            <time
                                                dateTime={c.createdAt}
                                                className="shrink-0 text-xs text-muted-foreground"
                                            >
                                                {format(
                                                    new Date(c.createdAt),
                                                    'dd MMM yy',
                                                )}
                                            </time>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* --- Activity timeline --- */}
                    <section
                        aria-labelledby="activity-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="activity-heading"
                            className="mb-4 text-sm font-semibold"
                        >
                            Activity timeline
                        </h2>

                        {data.timeline.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No moderation activity recorded.
                            </p>
                        ) : (
                            <ol className="space-y-3">
                                {data.timeline.slice(0, 20).map((event) => (
                                    <li
                                        key={`${event.kind}-${event.id}`}
                                        className="flex gap-3 text-sm"
                                    >
                                        <span
                                            className={cn(
                                                'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                                                event.kind === 'SANCTION'
                                                    ? 'bg-red-500'
                                                    : event.kind === 'APPEAL'
                                                      ? 'bg-amber-500'
                                                      : 'bg-muted-foreground/50',
                                            )}
                                            aria-hidden="true"
                                        />
                                        <span className="min-w-0 flex-1">
                                            <span className="flex flex-wrap items-baseline gap-2">
                                                <span className="font-medium capitalize">
                                                    {event.label
                                                        .replace(/_/g, ' ')
                                                        .toLowerCase()}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {event.status}
                                                </span>
                                                <time
                                                    dateTime={event.at}
                                                    className="ml-auto text-xs text-muted-foreground"
                                                >
                                                    {format(
                                                        new Date(event.at),
                                                        'dd MMM yyyy',
                                                    )}
                                                </time>
                                            </span>
                                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                                {event.detail}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </section>
                </div>

                {/* ============ Sidebar ============ */}
                <div className="space-y-6">
                    <section
                        aria-labelledby="user-actions-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="user-actions-heading"
                            className="mb-1 text-sm font-semibold"
                        >
                            Enforcement
                        </h2>
                        <p className="mb-4 text-xs text-muted-foreground">
                            Escalate in steps. A warning first, unless the breach
                            is severe enough to justify skipping it.
                        </p>

                        <div className="space-y-2">
                            {can(Permission.WARN_USERS) && (
                                <ActionButton
                                    icon={AlertTriangle}
                                    label="Issue a warning"
                                    onClick={() => setAction('warn')}
                                />
                            )}
                            {can(Permission.SUSPEND_USERS) && !isSuspended && (
                                <ActionButton
                                    icon={UserMinus}
                                    label="Suspend temporarily"
                                    onClick={() => setAction('suspend')}
                                />
                            )}
                            {can(Permission.BAN_USERS) && !isSuspended && (
                                <ActionButton
                                    icon={Ban}
                                    label="Ban permanently"
                                    destructive
                                    onClick={() => setAction('ban')}
                                />
                            )}
                            {can(Permission.RESTORE_USERS) &&
                                activeSanctions.length > 0 && (
                                    <ActionButton
                                        icon={RotateCcw}
                                        label="Lift sanctions"
                                        onClick={() => setAction('restore')}
                                    />
                                )}
                        </div>
                    </section>

                    {/* --- Active sanctions --- */}
                    <section
                        aria-labelledby="sanctions-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="sanctions-heading"
                            className="mb-3 text-sm font-semibold"
                        >
                            Sanction history
                        </h2>

                        {sanctionHistory.length === 0 ? (
                            <p className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                                Clean record.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {sanctionHistory.map((s) => (
                                    <li
                                        key={s.id}
                                        className={cn(
                                            'rounded-lg border p-3',
                                            s.status === 'ACTIVE' &&
                                                'border-red-300 bg-red-50/50 dark:border-red-500/30 dark:bg-red-500/5',
                                        )}
                                    >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <SanctionBadge type={s.type} />
                                            <span className="text-xs text-muted-foreground">
                                                {s.status.toLowerCase()}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 text-sm">{s.reason}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {format(
                                                new Date(s.createdAt),
                                                'dd MMM yyyy',
                                            )}
                                            {s.expiresAt &&
                                                ` · until ${format(new Date(s.expiresAt), 'dd MMM yyyy')}`}
                                            {s.issuedBy &&
                                                ` · by ${s.issuedBy.fullName}`}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* --- Appeals --- */}
                    {data.appeals.length > 0 && (
                        <section
                            aria-labelledby="user-appeals-heading"
                            className="rounded-xl border bg-card p-5 shadow-sm"
                        >
                            <h2
                                id="user-appeals-heading"
                                className="mb-3 flex items-center gap-2 text-sm font-semibold"
                            >
                                <Gavel className="h-4 w-4" aria-hidden="true" />
                                Appeals
                            </h2>
                            <ul className="space-y-2">
                                {data.appeals.map((a) => (
                                    <li key={a.id} className="text-sm">
                                        <Link
                                            to={`/dashboard/moderation/appeals/${a.id}`}
                                            className="font-mono text-xs text-primary hover:underline"
                                        >
                                            {a.appealNumber}
                                        </Link>
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            {a.status.toLowerCase()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* --- Notes --- */}
                    <section
                        aria-labelledby="user-notes-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="user-notes-heading"
                            className="mb-3 text-sm font-semibold"
                        >
                            Moderator notes
                        </h2>

                        <div className="space-y-2">
                            <Label htmlFor="user-note" className="sr-only">
                                Add a note about this account
                            </Label>
                            <Textarea
                                id="user-note"
                                value={noteBody}
                                onChange={(e) => setNoteBody(e.target.value)}
                                rows={3}
                                placeholder="Private context for other moderators."
                            />
                            <Button
                                size="sm"
                                className="w-full"
                                disabled={!noteBody.trim() || notePending}
                                onClick={addNote}
                            >
                                <MessageSquarePlus
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                Add note
                            </Button>
                        </div>

                        {data.notes.length > 0 && (
                            <ul className="mt-4 space-y-3 border-t pt-4">
                                {data.notes.map((note) => (
                                    <li key={note.id} className="text-sm">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <span className="text-xs font-semibold">
                                                {note.author?.fullName ??
                                                    'Moderator'}
                                            </span>
                                            <time
                                                dateTime={note.createdAt}
                                                className="text-xs text-muted-foreground"
                                            >
                                                {formatDistanceToNow(
                                                    new Date(note.createdAt),
                                                    { addSuffix: true },
                                                )}
                                            </time>
                                        </div>
                                        <p className="mt-1 whitespace-pre-wrap">
                                            {note.body}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>

            {/* ============ Dialogs ============ */}

            <ModerationActionDialog
                open={action === 'warn'}
                onOpenChange={() => setAction(null)}
                title="Issue a warning"
                description="The user is notified by email and in the app. No access is withdrawn."
                confirmLabel="Issue warning"
                isPending={warn.isPending}
                onConfirm={(payload) =>
                    warn.mutate(payload, { onSuccess: () => setAction(null) })
                }
                reasonPresets={[
                    'First breach of the community guidelines on respectful discussion.',
                    'Sharing unverified claims without the required context.',
                ]}
            />

            <ModerationActionDialog
                open={action === 'suspend'}
                onOpenChange={() => setAction(null)}
                title="Suspend account"
                description="The user cannot sign in until the suspension expires. They will be told why, and how to appeal."
                confirmLabel={`Suspend for ${durationDays} day${durationDays === 1 ? '' : 's'}`}
                destructive
                isPending={suspend.isPending}
                onConfirm={(payload) =>
                    suspend.mutate(
                        { ...payload, durationDays },
                        { onSuccess: () => setAction(null) },
                    )
                }
            >
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <select
                        id="duration"
                        value={durationDays}
                        onChange={(e) => setDurationDays(Number(e.target.value))}
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value={1}>1 day</option>
                        <option value={3}>3 days</option>
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                        The account returns automatically when the suspension
                        expires. No one needs to remember to lift it.
                    </p>
                </div>
            </ModerationActionDialog>

            <ModerationActionDialog
                open={action === 'ban'}
                onOpenChange={() => setAction(null)}
                title="Ban account permanently"
                description="This ends the account's access indefinitely. Use it only for severe or repeated violations, and expect the decision to be appealed."
                confirmLabel="Ban permanently"
                destructive
                isPending={suspend.isPending}
                onConfirm={(payload) =>
                    suspend.mutate(
                        { ...payload, ban: true },
                        { onSuccess: () => setAction(null) },
                    )
                }
            />

            <ModerationActionDialog
                open={action === 'restore'}
                onOpenChange={() => setAction(null)}
                title="Lift sanctions"
                description="Every active sanction on this account is revoked and the account returns to its previous status."
                confirmLabel="Restore account"
                isPending={restore.isPending}
                onConfirm={(payload) =>
                    restore.mutate(payload, { onSuccess: () => setAction(null) })
                }
                reasonPresets={[
                    'Sanction applied in error — the content did not breach policy.',
                    'User has acknowledged the issue and the suspension has served its purpose.',
                ]}
            />
        </div>
    );
}

function Stat({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone?: 'warn' | 'bad';
}) {
    return (
        <div>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd
                className={cn(
                    'mt-0.5 text-xl font-bold tabular-nums',
                    tone === 'bad' && 'text-red-600 dark:text-red-400',
                    tone === 'warn' && 'text-amber-600 dark:text-amber-400',
                )}
            >
                {value}
            </dd>
        </div>
    );
}

function ActionButton({
    icon: Icon,
    label,
    onClick,
    destructive = false,
}: {
    icon: typeof AlertTriangle;
    label: string;
    onClick: () => void;
    destructive?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                destructive
                    ? 'border-destructive/40 text-destructive hover:bg-destructive/10'
                    : 'border-input hover:bg-accent hover:text-accent-foreground',
            )}
        >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
        </button>
    );
}
