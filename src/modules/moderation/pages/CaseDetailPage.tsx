import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowUpCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    Flag,
    Loader2,
    MessageSquarePlus,
    Paperclip,
    RotateCcw,
    ShieldQuestion,
    Trash2,
    UserCheck,
    UserMinus,
    XCircle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

import {
    Permission,
    type IncidentSeverity,
} from '@/services/moderation.service';
import {
    useAddCaseNote,
    useAssignCase,
    useContentAction,
    useEscalateCase,
    useFlagCase,
    useFlagCatalogue,
    useModerationCase,
    useModerationPermissions,
    useReopenCase,
    useResolveCase,
    useReviewCase,
    extractErrorMessage,
} from '@/shared/hooks/useModeration';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';

import { ContentPreviewCard } from '../components/ContentPreviewCard';
import { CaseTimeline } from '../components/CaseTimeline';
import { ModerationActionDialog } from '../components/ModerationActionDialog';
import {
    CaseStatusBadge,
    FlagChip,
    SeverityBadge,
} from '../components/badges';
import {
    REPORT_REASON_LABEL,
    TARGET_TYPE_LABEL,
    flagColorClasses,
    formatDuration,
} from '../constants';

/** Which dialog, if any, is currently open. */
type ActionKind =
    | 'claim'
    | 'review'
    | 'flag'
    | 'hide'
    | 'delete'
    | 'restore'
    | 'escalate'
    | 'uphold'
    | 'dismiss'
    | 'reopen'
    | null;

/**
 * The review screen: report details, the content itself, the full history, and
 * every action a moderator can take — each behind a confirmation dialog that
 * demands a written reason.
 */
export default function CaseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { can } = useModerationPermissions();

    const { data: c, isLoading, isError, error } = useModerationCase(id);
    const { data: flagCatalogue } = useFlagCatalogue();

    const [action, setAction] = useState<ActionKind>(null);
    const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
    const [severity, setSeverity] = useState<IncidentSeverity | ''>('');
    const [noteBody, setNoteBody] = useState('');

    const caseId = id as string;
    const assign = useAssignCase(caseId);
    const review = useReviewCase(caseId);
    const flag = useFlagCase(caseId);
    const resolve = useResolveCase(caseId);
    const reopen = useReopenCase(caseId);
    const escalate = useEscalateCase(caseId);
    const hide = useContentAction(caseId, 'hide');
    const remove = useContentAction(caseId, 'delete');
    const restore = useContentAction(caseId, 'restore');
    const addNote = useAddCaseNote(caseId);

    const close = () => {
        setAction(null);
        setSelectedFlags([]);
        setSeverity('');
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center" aria-busy="true">
                <Loader2
                    className="h-6 w-6 animate-spin text-muted-foreground"
                    aria-hidden="true"
                />
                <span className="sr-only">Loading case</span>
            </div>
        );
    }

    if (isError || !c) {
        return (
            <div
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center"
            >
                <h1 className="text-lg font-semibold">Case unavailable</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {extractErrorMessage(error)}
                </p>
                <Link
                    to="/dashboard/moderation/queue"
                    className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                    Back to the queue
                </Link>
            </div>
        );
    }

    const isTerminal = ['RESOLVED', 'DISMISSED', 'CLOSED', 'DUPLICATE'].includes(
        c.status,
    );

    return (
        <div className="space-y-6">
            {/* --- Header --- */}
            <header className="space-y-3">
                <Link
                    to="/dashboard/moderation/queue"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to the queue
                </Link>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-mono text-2xl font-bold tracking-tight">
                        {c.caseNumber}
                    </h1>
                    <CaseStatusBadge status={c.status} />
                    <SeverityBadge severity={c.severity} />
                    {c.reopenCount > 0 && (
                        <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                            Reopened {c.reopenCount}×
                        </span>
                    )}
                </div>

                <p className="text-sm text-muted-foreground">
                    Reported{' '}
                    {formatDistanceToNow(new Date(c.createdAt), {
                        addSuffix: true,
                    })}
                    {c.assignedModerator &&
                        ` · owned by ${c.assignedModerator.fullName}`}
                    {c.resolutionSeconds !== null &&
                        c.resolutionSeconds !== undefined &&
                        ` · closed in ${formatDuration(c.resolutionSeconds)}`}
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* ============ Main column ============ */}
                <div className="space-y-6 xl:col-span-2">
                    <ContentPreviewCard
                        preview={c.preview}
                        visibility={c.contentVisibility}
                        snapshot={c.targetPreview}
                    />

                    {/* --- Report details --- */}
                    <section
                        aria-labelledby="details-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="details-heading"
                            className="mb-4 text-sm font-semibold"
                        >
                            Report details
                        </h2>

                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Detail label="Reason">
                                {REPORT_REASON_LABEL[c.reportReason] ??
                                    c.reportReason}
                            </Detail>
                            <Detail label="Content type">
                                {TARGET_TYPE_LABEL[c.targetType]}
                            </Detail>
                            <Detail label="Submitted">
                                {format(new Date(c.createdAt), 'dd MMM yyyy, HH:mm')}
                            </Detail>
                            <Detail label="Reporter">
                                {c.isAnonymous ? (
                                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                        <ShieldQuestion
                                            className="h-3.5 w-3.5"
                                            aria-hidden="true"
                                        />
                                        Anonymous
                                    </span>
                                ) : (
                                    (c.reportedByUser?.fullName ?? 'Unknown')
                                )}
                            </Detail>
                            <Detail label="Reported user">
                                {c.reportedUser ? (
                                    <Link
                                        to={`/dashboard/moderation/users/${c.reportedUser.id}`}
                                        className="font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {c.reportedUser.fullName}
                                    </Link>
                                ) : (
                                    '—'
                                )}
                            </Detail>
                            <Detail label="Owner">
                                {c.assignedModerator?.fullName ?? 'Unassigned'}
                            </Detail>
                        </dl>

                        <div className="mt-5 border-t pt-4">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                What the reporter said
                            </dt>
                            <dd className="mt-1.5 whitespace-pre-wrap text-sm">
                                {c.description}
                            </dd>
                        </div>

                        {(c.evidenceUrls?.length ?? 0) > 0 && (
                            <div className="mt-4 border-t pt-4">
                                <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <Paperclip
                                        className="h-3 w-3"
                                        aria-hidden="true"
                                    />
                                    Evidence
                                </dt>
                                <dd>
                                    <ul className="mt-1.5 space-y-1">
                                        {c.evidenceUrls?.map((url) => (
                                            <li
                                                key={url}
                                                className="break-all rounded bg-muted/50 px-2 py-1 font-mono text-xs"
                                            >
                                                {url}
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        )}

                        {c.resolutionNotes && (
                            <div className="mt-4 border-t pt-4">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Outcome
                                </dt>
                                <dd className="mt-1.5 text-sm">
                                    {c.resolutionNotes}
                                </dd>
                            </div>
                        )}
                    </section>

                    {/* --- Timeline --- */}
                    <section
                        aria-labelledby="timeline-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="timeline-heading"
                            className="mb-4 text-sm font-semibold"
                        >
                            History
                        </h2>
                        <CaseTimeline events={c.timeline} />
                    </section>
                </div>

                {/* ============ Sidebar ============ */}
                <div className="space-y-6">
                    {/* --- Actions --- */}
                    <section
                        aria-labelledby="actions-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="actions-heading"
                            className="mb-1 text-sm font-semibold"
                        >
                            Actions
                        </h2>
                        <p className="mb-4 text-xs text-muted-foreground">
                            Every action asks for a reason and is recorded
                            permanently.
                        </p>

                        <div className="space-y-2">
                            {!isTerminal && (
                                <>
                                    {can(Permission.ASSIGN_REPORTS) && (
                                        <ActionButton
                                            icon={UserCheck}
                                            label={
                                                c.assignedModeratorId
                                                    ? 'Reassign case'
                                                    : 'Claim case'
                                            }
                                            onClick={() => setAction('claim')}
                                        />
                                    )}
                                    {can(Permission.REVIEW_REPORTS) && (
                                        <ActionButton
                                            icon={Eye}
                                            label="Start review"
                                            onClick={() => setAction('review')}
                                        />
                                    )}
                                    {can(Permission.FLAG_CONTENT) && (
                                        <ActionButton
                                            icon={Flag}
                                            label="Apply flags"
                                            onClick={() => setAction('flag')}
                                        />
                                    )}
                                    {can(Permission.HIDE_CONTENT) &&
                                        c.contentVisibility === 'VISIBLE' && (
                                            <ActionButton
                                                icon={EyeOff}
                                                label="Hide content"
                                                onClick={() => setAction('hide')}
                                            />
                                        )}
                                    {can(Permission.DELETE_CONTENT) &&
                                        c.contentVisibility !== 'DELETED' && (
                                            <ActionButton
                                                icon={Trash2}
                                                label="Delete content"
                                                destructive
                                                onClick={() =>
                                                    setAction('delete')
                                                }
                                            />
                                        )}
                                    {can(Permission.RESTORE_CONTENT) &&
                                        c.contentVisibility !== 'VISIBLE' && (
                                            <ActionButton
                                                icon={RotateCcw}
                                                label="Restore content"
                                                onClick={() =>
                                                    setAction('restore')
                                                }
                                            />
                                        )}
                                    {can(Permission.REVIEW_REPORTS) && (
                                        <ActionButton
                                            icon={ArrowUpCircle}
                                            label="Escalate"
                                            onClick={() => setAction('escalate')}
                                        />
                                    )}

                                    <div className="!mt-4 space-y-2 border-t pt-4">
                                        <ActionButton
                                            icon={CheckCircle2}
                                            label="Uphold and close"
                                            primary
                                            onClick={() => setAction('uphold')}
                                        />
                                        <ActionButton
                                            icon={XCircle}
                                            label="Dismiss as unfounded"
                                            onClick={() => setAction('dismiss')}
                                        />
                                    </div>
                                </>
                            )}

                            {isTerminal && can(Permission.REVIEW_REPORTS) && (
                                <ActionButton
                                    icon={RotateCcw}
                                    label="Reopen case"
                                    onClick={() => setAction('reopen')}
                                />
                            )}
                        </div>

                        {/* User actions live on the profile, where the full
                            violation history is visible — a sanction should
                            never be issued from a single case in isolation. */}
                        {c.reportedUser && (
                            <div className="mt-4 border-t pt-4">
                                <p className="mb-2 text-xs text-muted-foreground">
                                    To warn, suspend or ban this user, open
                                    their profile so you can see their full
                                    history first.
                                </p>
                                <Link
                                    to={`/dashboard/moderation/users/${c.reportedUser.id}`}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <UserMinus
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                    User moderation profile
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* --- Flags --- */}
                    <section
                        aria-labelledby="flags-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="flags-heading"
                            className="mb-3 text-sm font-semibold"
                        >
                            Flags
                        </h2>

                        {c.flags.filter((f) => !f.removedAt).length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No flags applied.
                            </p>
                        ) : (
                            <ul className="flex flex-wrap gap-1.5">
                                {c.flags
                                    .filter((f) => !f.removedAt)
                                    .map((assignment) => (
                                        <li key={assignment.id}>
                                            <FlagChip
                                                flag={{
                                                    id: assignment.id,
                                                    code: assignment.flag?.code,
                                                    label: assignment.flag?.label,
                                                    color: assignment.flag?.color,
                                                    severity:
                                                        assignment.flag?.severity,
                                                    description:
                                                        assignment.flag
                                                            ?.description,
                                                }}
                                            />
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </section>

                    {/* --- Notes --- */}
                    <section
                        aria-labelledby="notes-heading"
                        className="rounded-xl border bg-card p-5 shadow-sm"
                    >
                        <h2
                            id="notes-heading"
                            className="mb-1 text-sm font-semibold"
                        >
                            Moderator notes
                        </h2>
                        <p className="mb-3 text-xs text-muted-foreground">
                            Private to the moderation team. Never shown to the
                            reporter or the reported user.
                        </p>

                        <div className="space-y-2">
                            <Label htmlFor="new-note" className="sr-only">
                                Add a note
                            </Label>
                            <Textarea
                                id="new-note"
                                value={noteBody}
                                onChange={(e) => setNoteBody(e.target.value)}
                                rows={3}
                                placeholder="Markdown supported. Use @username to notify a colleague."
                            />
                            <Button
                                size="sm"
                                className="w-full"
                                disabled={!noteBody.trim() || addNote.isPending}
                                onClick={() =>
                                    addNote.mutate(
                                        { body: noteBody.trim() },
                                        { onSuccess: () => setNoteBody('') },
                                    )
                                }
                            >
                                <MessageSquarePlus
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                Add note
                            </Button>
                        </div>

                        {c.notes.length > 0 && (
                            <ul className="mt-4 space-y-3 border-t pt-4">
                                {c.notes.map((note) => (
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
                                        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
                                            {note.body}
                                        </p>
                                        {note.version > 1 && (
                                            <p className="mt-0.5 text-xs italic text-muted-foreground">
                                                Edited · version {note.version}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* --- Duplicates --- */}
                    {c.duplicates.length > 0 && (
                        <section
                            aria-labelledby="dupes-heading"
                            className="rounded-xl border bg-card p-5 shadow-sm"
                        >
                            <h2
                                id="dupes-heading"
                                className="mb-3 text-sm font-semibold"
                            >
                                Merged duplicates ({c.duplicates.length})
                            </h2>
                            <ul className="space-y-1">
                                {c.duplicates.map((d) => (
                                    <li key={d.id}>
                                        <Link
                                            to={`/dashboard/moderation/cases/${d.id}`}
                                            className="font-mono text-xs text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            {d.caseNumber}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>

            {/* ============ Dialogs ============ */}

            <ModerationActionDialog
                open={action === 'claim'}
                onOpenChange={close}
                title={c.assignedModeratorId ? 'Reassign case' : 'Claim case'}
                description="You become the owner and are accountable for the outcome."
                confirmLabel="Claim case"
                isPending={assign.isPending}
                onConfirm={(payload) =>
                    assign.mutate(payload, { onSuccess: close })
                }
                reasonPresets={[
                    'Picking this up during my moderation shift.',
                    'This falls within my area of responsibility.',
                ]}
            />

            <ModerationActionDialog
                open={action === 'review'}
                onOpenChange={close}
                title="Start review"
                description="Marks the case as actively being worked. You can also adjust the severity if the reporter mis-rated it."
                confirmLabel="Start review"
                isPending={review.isPending}
                onConfirm={(payload) =>
                    review.mutate(
                        {
                            ...payload,
                            ...(severity ? { severity } : {}),
                        } as never,
                        { onSuccess: close },
                    )
                }
            >
                <div className="space-y-2">
                    <Label htmlFor="severity-override">
                        Correct the severity (optional)
                    </Label>
                    <select
                        id="severity-override"
                        value={severity}
                        onChange={(e) =>
                            setSeverity(e.target.value as IncidentSeverity | '')
                        }
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">Leave as {c.severity}</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>
            </ModerationActionDialog>

            <ModerationActionDialog
                open={action === 'flag'}
                onOpenChange={close}
                title="Apply flags"
                description="Flags record your assessment of what is wrong. They drive analytics and the user's risk score."
                confirmLabel={`Apply ${selectedFlags.length || ''} flag${selectedFlags.length === 1 ? '' : 's'}`}
                disabled={selectedFlags.length === 0}
                isPending={flag.isPending}
                onConfirm={(payload) =>
                    flag.mutate(
                        { ...payload, flagCodes: selectedFlags },
                        { onSuccess: close },
                    )
                }
            >
                <fieldset className="space-y-2">
                    <legend className="mb-2 text-sm font-medium">
                        Choose one or more flags
                    </legend>
                    <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto rounded-lg border p-3">
                        {(flagCatalogue ?? []).map((f) => {
                            const checked = selectedFlags.includes(f.code);
                            return (
                                <label
                                    key={f.id}
                                    title={f.description}
                                    className={cn(
                                        'cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-all',
                                        checked
                                            ? flagColorClasses(f.color)
                                            : 'border-border bg-background text-muted-foreground hover:bg-accent',
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={checked}
                                        onChange={() =>
                                            setSelectedFlags((prev) =>
                                                prev.includes(f.code)
                                                    ? prev.filter(
                                                          (code) =>
                                                              code !== f.code,
                                                      )
                                                    : [...prev, f.code],
                                            )
                                        }
                                    />
                                    {f.label}
                                </label>
                            );
                        })}
                    </div>
                </fieldset>
            </ModerationActionDialog>

            <ModerationActionDialog
                open={action === 'hide'}
                onOpenChange={close}
                title="Hide content"
                description="The content is withheld from the public but stays visible to moderators and can be restored."
                confirmLabel="Hide content"
                isPending={hide.isPending}
                onConfirm={(payload) => hide.mutate(payload, { onSuccess: close })}
            />

            <ModerationActionDialog
                open={action === 'delete'}
                onOpenChange={close}
                title="Delete content"
                description="A soft delete. The author is notified. A senior moderator can still restore it."
                confirmLabel="Delete content"
                destructive
                isPending={remove.isPending}
                onConfirm={(payload) =>
                    remove.mutate(payload, { onSuccess: close })
                }
            />

            <ModerationActionDialog
                open={action === 'restore'}
                onOpenChange={close}
                title="Restore content"
                description="Returns the content to public view."
                confirmLabel="Restore content"
                isPending={restore.isPending}
                onConfirm={(payload) =>
                    restore.mutate(payload, { onSuccess: close })
                }
            />

            <ModerationActionDialog
                open={action === 'escalate'}
                onOpenChange={close}
                title="Escalate case"
                description="Raises the case to senior moderators. Use this when the decision needs authority you do not hold, or when you are too close to it."
                confirmLabel="Escalate"
                isPending={escalate.isPending}
                onConfirm={(payload) =>
                    escalate.mutate(payload, { onSuccess: close })
                }
                reasonPresets={[
                    'Requires a permanent sanction, which is above my permission level.',
                    'Potential legal exposure — needs senior judgement.',
                    'I have a conflict of interest in this case.',
                ]}
            />

            <ModerationActionDialog
                open={action === 'uphold'}
                onOpenChange={close}
                title="Uphold the report"
                description="Confirms a violation occurred. Take any content or user action first — closing the case does not apply them."
                confirmLabel="Uphold and close"
                isPending={resolve.isPending}
                onConfirm={(payload) =>
                    resolve.mutate(
                        { ...payload, outcome: 'RESOLVED' },
                        { onSuccess: close },
                    )
                }
            />

            <ModerationActionDialog
                open={action === 'dismiss'}
                onOpenChange={close}
                title="Dismiss the report"
                description="Records that no violation was found. The reported content and user are unaffected."
                confirmLabel="Dismiss report"
                isPending={resolve.isPending}
                onConfirm={(payload) =>
                    resolve.mutate(
                        { ...payload, outcome: 'DISMISSED' },
                        { onSuccess: close },
                    )
                }
                reasonPresets={[
                    'No policy violation found on review of the full context.',
                    'Content is satire and is clearly labelled as such.',
                    'Report appears to be retaliatory rather than substantive.',
                ]}
            />

            <ModerationActionDialog
                open={action === 'reopen'}
                onOpenChange={close}
                title="Reopen case"
                description="Returns the case to the queue. Use this when new information changes the picture."
                confirmLabel="Reopen case"
                isPending={reopen.isPending}
                onConfirm={(payload) =>
                    reopen.mutate(payload, { onSuccess: close })
                }
            />
        </div>
    );
}

function Detail({
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
            <dd className="mt-0.5 text-sm">{children}</dd>
        </div>
    );
}

function ActionButton({
    icon: Icon,
    label,
    onClick,
    destructive = false,
    primary = false,
}: {
    icon: typeof Flag;
    label: string;
    onClick: () => void;
    destructive?: boolean;
    primary?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                primary
                    ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90'
                    : destructive
                      ? 'border-destructive/40 text-destructive hover:bg-destructive/10'
                      : 'border-input hover:bg-accent hover:text-accent-foreground',
            )}
        >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
        </button>
    );
}
