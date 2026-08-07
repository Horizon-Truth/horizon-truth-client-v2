import { cn } from '@/shared/lib/utils';
import {
    APPEAL_STATUS_TONE,
    CASE_STATUS_TONE,
    FLAG_SEVERITY_TONE,
    SANCTION_TONE,
    SEVERITY_TONE,
    flagColorClasses,
} from '../constants';
import type {
    AppealStatus,
    CaseFlagChip,
    FlagSeverity,
    IncidentSeverity,
    ModerationCaseStatus,
    UserSanctionType,
} from '@/services/moderation.service';

const base =
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap';

export function CaseStatusBadge({
    status,
    className,
}: {
    status: ModerationCaseStatus;
    className?: string;
}) {
    const tone = CASE_STATUS_TONE[status];

    return (
        <span className={cn(base, tone.className, className)}>{tone.label}</span>
    );
}

export function SeverityBadge({
    severity,
    className,
}: {
    severity: IncidentSeverity;
    className?: string;
}) {
    const tone = SEVERITY_TONE[severity];

    return (
        <span className={cn(base, tone.className, className)}>
            {/* Severity is also encoded as a dot so it is not colour-only. */}
            <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-current"
            />
            {tone.label}
        </span>
    );
}

export function AppealStatusBadge({ status }: { status: AppealStatus }) {
    const tone = APPEAL_STATUS_TONE[status];
    return <span className={cn(base, tone.className)}>{tone.label}</span>;
}

export function SanctionBadge({ type }: { type: UserSanctionType }) {
    const tone = SANCTION_TONE[type];
    const label = type.replace(/_/g, ' ').toLowerCase();

    return (
        <span className={cn(base, tone.className, 'capitalize')}>{label}</span>
    );
}

export function FlagSeverityBadge({ severity }: { severity: FlagSeverity }) {
    const tone = FLAG_SEVERITY_TONE[severity];
    return (
        <span className={cn(base, tone.className, 'capitalize')}>
            {severity.toLowerCase()}
        </span>
    );
}

/**
 * A flag as shown on a case row or preview card.
 *
 * `title` carries the description so the meaning of an unfamiliar flag is one
 * hover — or one screen-reader announcement — away.
 */
export function FlagChip({
    flag,
    onRemove,
    className,
}: {
    flag: CaseFlagChip & { description?: string };
    onRemove?: () => void;
    className?: string;
}) {
    return (
        <span
            className={cn(base, flagColorClasses(flag.color), className)}
            title={flag.description ?? flag.label ?? flag.code}
        >
            {flag.label ?? flag.code}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remove the ${flag.label ?? flag.code} flag`}
                    className="ml-0.5 rounded-full px-1 leading-none hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-white/10"
                >
                    ×
                </button>
            )}
        </span>
    );
}
