import { useEffect, useId, useState } from 'react';
import { Flag, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import {
    moderationService,
    type IncidentReportReason,
    type IncidentSeverity,
    type ModerationTargetType,
} from '@/services/moderation.service';
import { extractErrorMessage } from '@/shared/hooks/useModeration';
import { useAuthStore } from '@/store/auth.store';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';

const MIN_DESCRIPTION = 20;

/**
 * Reasons offered to reporters, in the order a person would think of them.
 *
 * This is deliberately shorter than the moderator flag catalogue. A reporter
 * is telling us *what they saw*; the moderator decides what it was. Asking a
 * user to distinguish "misinformation" from "false information" — a judgement
 * about intent — would produce noise, not signal.
 */
const REPORT_REASONS: Array<{
    value: IncidentReportReason;
    label: string;
    help: string;
    severity: IncidentSeverity;
}> = [
    {
        value: 'HATE_SPEECH',
        label: 'Hate speech',
        help: 'Attacks a person or group over who they are.',
        severity: 'CRITICAL',
    },
    {
        value: 'VIOLENCE',
        label: 'Violence or threats',
        help: 'Threatens or encourages harm to people.',
        severity: 'CRITICAL',
    },
    {
        value: 'HARASSMENT',
        label: 'Harassment or bullying',
        help: 'Targets someone with abuse or unwanted contact.',
        severity: 'HIGH',
    },
    {
        value: 'FALSE_INFO',
        label: 'False or misleading',
        help: 'Spreads a claim that is untrue or missing vital context.',
        severity: 'MEDIUM',
    },
    {
        value: 'UNSAFE_LINK',
        label: 'Unsafe link',
        help: 'Links to a scam, a fake login page, or malware.',
        severity: 'CRITICAL',
    },
    {
        value: 'GRAPHIC_CONTENT',
        label: 'Graphic or disturbing',
        help: 'Shows injury, gore, or other distressing imagery.',
        severity: 'HIGH',
    },
    {
        value: 'IMPERSONATION',
        label: 'Impersonation',
        help: 'Pretends to be someone else or an official body.',
        severity: 'HIGH',
    },
    {
        value: 'SCAM',
        label: 'Scam or fraud',
        help: 'Tries to trick people out of money or information.',
        severity: 'HIGH',
    },
    {
        value: 'SPAM',
        label: 'Spam',
        help: 'Repetitive or promotional posting.',
        severity: 'LOW',
    },
    {
        value: 'EDUCATIONAL_CONCERN',
        label: 'Teaches the wrong lesson',
        help: 'Rewards a habit this platform exists to discourage.',
        severity: 'MEDIUM',
    },
    {
        value: 'OTHER',
        label: 'Something else',
        help: 'Describe it below and a moderator will read it.',
        severity: 'MEDIUM',
    },
];

export interface ReportContentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    targetType: ModerationTargetType;
    targetId?: string;
    /** Author of the content, when known. Lets moderators see their history. */
    reportedUserId?: string;
    /** Shown at the top so the reporter can confirm what they are reporting. */
    contentLabel?: string;
}

/**
 * The reporting form a player sees.
 *
 * Two deliberate differences from the moderator dialogs: the language avoids
 * moderation jargon entirely, and it closes by telling the user what happens
 * next. People who report harmful content and hear nothing back stop
 * reporting.
 */
export function ReportContentDialog({
    open,
    onOpenChange,
    targetType,
    targetId,
    reportedUserId,
    contentLabel,
}: ReportContentDialogProps) {
    const { isAuthenticated } = useAuthStore();

    const [reason, setReason] = useState<IncidentReportReason | ''>('');
    const [description, setDescription] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [touched, setTouched] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const descriptionId = useId();
    const errorId = useId();

    useEffect(() => {
        if (!open) {
            setReason('');
            setDescription('');
            setIsAnonymous(false);
            setTouched(false);
            setSubmitted(false);
        }
    }, [open]);

    const submit = useMutation({
        mutationFn: () =>
            moderationService.reportContent({
                targetType,
                targetId,
                reportedUserId,
                reportReason: reason as IncidentReportReason,
                description: description.trim(),
                severity: REPORT_REASONS.find((r) => r.value === reason)?.severity,
                isAnonymous,
            }),
        onSuccess: () => setSubmitted(true),
        onError: (error) => toast.error(extractErrorMessage(error)),
    });

    const tooShort = description.trim().length < MIN_DESCRIPTION;
    const showError = touched && tooShort;
    const canSubmit = !!reason && !tooShort && !submit.isPending;

    if (!isAuthenticated) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Sign in to report</DialogTitle>
                        <DialogDescription>
                            Reports are tied to an account so moderators can ask
                            follow-up questions. You can still report anonymously
                            — your name is hidden from moderators, not from the
                            system.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => onOpenChange(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // --- Confirmation state ----------------------------------------------

    if (submitted) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck
                                className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                                aria-hidden="true"
                            />
                            Thank you — report received
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 py-2 text-sm">
                        <p>
                            A moderator will review this. Reports about serious
                            harm are looked at within an hour; others within a
                            few days.
                        </p>
                        <p className="text-muted-foreground">
                            You will not usually hear the outcome — decisions
                            about other people are private to them. That is not
                            a sign nothing happened.
                        </p>
                        <p className="text-muted-foreground">
                            If you reported something that puts someone in
                            immediate danger, please also contact your local
                            emergency services.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => onOpenChange(false)}>Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // --- Form state -------------------------------------------------------

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5" aria-hidden="true" />
                        Report this content
                    </DialogTitle>
                    <DialogDescription>
                        {contentLabel
                            ? `Reporting: ${contentLabel}`
                            : 'Tell us what is wrong and a moderator will look at it.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <fieldset>
                        <legend className="mb-2 text-sm font-medium">
                            What is the problem?{' '}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                            <span className="sr-only">(required)</span>
                        </legend>

                        <div className="space-y-1.5">
                            {REPORT_REASONS.map((option) => (
                                <label
                                    key={option.value}
                                    className={cn(
                                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                                        reason === option.value
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:bg-accent/50',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="report-reason"
                                        value={option.value}
                                        checked={reason === option.value}
                                        onChange={() => setReason(option.value)}
                                        className="mt-0.5 h-4 w-4 accent-primary"
                                    />
                                    <span className="min-w-0">
                                        <span className="block text-sm font-medium">
                                            {option.label}
                                        </span>
                                        <span className="block text-xs text-muted-foreground">
                                            {option.help}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className="space-y-2">
                        <Label htmlFor={descriptionId}>
                            What happened?{' '}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                            <span className="sr-only">(required)</span>
                        </Label>
                        <Textarea
                            id={descriptionId}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={() => setTouched(true)}
                            rows={4}
                            required
                            aria-required="true"
                            aria-invalid={showError}
                            aria-describedby={errorId}
                            placeholder="Describe what you saw. Specifics help — what was said, and why it concerned you."
                            className={cn(showError && 'border-destructive')}
                        />
                        <div className="flex items-start justify-between gap-3">
                            <p
                                id={errorId}
                                className={cn(
                                    'text-xs',
                                    showError
                                        ? 'text-destructive'
                                        : 'text-muted-foreground',
                                )}
                                role={showError ? 'alert' : undefined}
                            >
                                {showError
                                    ? `Please write at least ${MIN_DESCRIPTION} characters so a moderator can act on this.`
                                    : 'A moderator reads every report. Detail helps them decide faster.'}
                            </p>
                            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                {description.trim().length}/{MIN_DESCRIPTION}
                            </span>
                        </div>
                    </div>

                    <label className="flex items-start gap-3 rounded-lg border p-3">
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                        />
                        <span>
                            <span className="block text-sm font-medium">
                                Report anonymously
                            </span>
                            <span className="block text-xs text-muted-foreground">
                                Moderators will not see your name. Administrators
                                still can, so that abuse of reporting can be
                                investigated.
                            </span>
                        </span>
                    </label>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={submit.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!canSubmit}
                        onClick={() => {
                            setTouched(true);
                            if (canSubmit) submit.mutate();
                        }}
                    >
                        {submit.isPending && (
                            <Loader2
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        {submit.isPending ? 'Sending…' : 'Send report'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Drop-in trigger. Renders a discreet "Report" control and owns the dialog
 * state, so a content page adds reporting with one element.
 */
export function ReportButton({
    targetType,
    targetId,
    reportedUserId,
    contentLabel,
    className,
    variant = 'link',
}: Omit<ReportContentDialogProps, 'open' | 'onOpenChange'> & {
    className?: string;
    variant?: 'link' | 'icon' | 'button';
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {variant === 'icon' ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label={
                        contentLabel ? `Report ${contentLabel}` : 'Report this content'
                    }
                    title="Report this content"
                    className={cn(
                        'rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        className,
                    )}
                >
                    <Flag className="h-4 w-4" aria-hidden="true" />
                </button>
            ) : variant === 'button' ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(true)}
                    className={className}
                >
                    <Flag className="h-4 w-4" aria-hidden="true" />
                    Report
                </Button>
            ) : (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        className,
                    )}
                >
                    <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                    Report
                </button>
            )}

            <ReportContentDialog
                open={open}
                onOpenChange={setOpen}
                targetType={targetType}
                targetId={targetId}
                reportedUserId={reportedUserId}
                contentLabel={contentLabel}
            />
        </>
    );
}
