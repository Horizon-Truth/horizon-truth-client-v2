import { useEffect, useId, useState, type ReactNode } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
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

/** Matches the backend's `MinLength(10)` on every action reason. */
export const MIN_REASON_LENGTH = 10;

export interface ModerationActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    /** What the action will do, in plain language. */
    description: ReactNode;
    /** Label for the confirm button, e.g. "Suspend account". */
    confirmLabel: string;
    /** Destructive actions get the red button and an explicit warning. */
    destructive?: boolean;
    /** Extra fields shown above the reason box (duration, flag picker, …). */
    children?: ReactNode;
    isPending?: boolean;
    onConfirm: (payload: { reason: string; notes?: string }) => void;
    /** Suggested reasons; picking one fills the box, which stays editable. */
    reasonPresets?: string[];
    /** Blocks confirmation while a parent-owned field is invalid. */
    disabled?: boolean;
}

/**
 * The single confirmation surface for every moderation action.
 *
 * Two rules are enforced here rather than per-caller, because they are policy
 * rather than styling:
 *
 * 1. **A written reason is mandatory.** It becomes part of a permanent audit
 *    record and, for sanctions, of what the user is told.
 * 2. **Nothing happens on first click.** The dialog is the confirmation step,
 *    so no destructive action is ever one keystroke away.
 */
export function ModerationActionDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    destructive = false,
    children,
    isPending = false,
    onConfirm,
    reasonPresets,
    disabled = false,
}: ModerationActionDialogProps) {
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [touched, setTouched] = useState(false);

    const reasonId = useId();
    const notesId = useId();
    const errorId = useId();

    // Never carry a reason from one action over to the next: each decision
    // has to be justified on its own terms.
    useEffect(() => {
        if (!open) {
            setReason('');
            setNotes('');
            setTouched(false);
        }
    }, [open]);

    const tooShort = reason.trim().length < MIN_REASON_LENGTH;
    const showError = touched && tooShort;
    const canSubmit = !tooShort && !isPending && !disabled;

    const submit = () => {
        setTouched(true);
        if (!canSubmit) return;
        onConfirm({ reason: reason.trim(), notes: notes.trim() || undefined });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {destructive && (
                            <AlertTriangle
                                className="h-5 w-5 text-destructive"
                                aria-hidden="true"
                            />
                        )}
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {children}

                    <div className="space-y-2">
                        <Label htmlFor={reasonId}>
                            Reason{' '}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                            <span className="sr-only">(required)</span>
                        </Label>

                        {reasonPresets && reasonPresets.length > 0 && (
                            <div className="flex flex-wrap gap-2 pb-1">
                                {reasonPresets.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setReason(preset)}
                                        className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        )}

                        <Textarea
                            id={reasonId}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            onBlur={() => setTouched(true)}
                            rows={3}
                            required
                            aria-required="true"
                            aria-invalid={showError}
                            aria-describedby={showError ? errorId : undefined}
                            placeholder="Which policy applies, and what did you observe?"
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
                                    ? `Give at least ${MIN_REASON_LENGTH} characters — this is a permanent record.`
                                    : 'Recorded in the audit trail and visible to administrators.'}
                            </p>
                            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                {reason.trim().length}/{MIN_REASON_LENGTH}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={notesId}>Internal notes (optional)</Label>
                        <Textarea
                            id={notesId}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="Context for other moderators. Never shown to the user."
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={destructive ? 'destructive' : 'default'}
                        onClick={submit}
                        disabled={!canSubmit}
                    >
                        {isPending && (
                            <Loader2
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        {isPending ? 'Working…' : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
