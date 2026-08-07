import type {
    AppealStatus,
    FlagSeverity,
    IncidentReportReason,
    IncidentSeverity,
    ModerationCaseStatus,
    ModerationTargetType,
    UserSanctionType,
} from '@/services/moderation.service';

/**
 * Presentation metadata for the moderation vocabulary.
 *
 * Colours are written as explicit light/dark Tailwind pairs rather than theme
 * tokens: status and severity carry meaning that has to stay legible and
 * distinguishable in both themes, which a single semantic token cannot do.
 */

export interface Tone {
    label: string;
    /** Badge classes, light and dark. */
    className: string;
    /** Solid fill for charts and meters. */
    hex: string;
}

export const CASE_STATUS_TONE: Record<ModerationCaseStatus, Tone> = {
    OPEN: {
        label: 'Open',
        className:
            'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300 border-sky-200 dark:border-sky-500/30',
        hex: '#0284c7',
    },
    ASSIGNED: {
        label: 'Assigned',
        className:
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
        hex: '#4f46e5',
    },
    UNDER_REVIEW: {
        label: 'Under review',
        className:
            'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300 border-violet-200 dark:border-violet-500/30',
        hex: '#7c3aed',
    },
    AWAITING_INFO: {
        label: 'Awaiting info',
        className:
            'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
        hex: '#d97706',
    },
    ESCALATED: {
        label: 'Escalated',
        className:
            'bg-orange-100 text-orange-900 dark:bg-orange-500/15 dark:text-orange-300 border-orange-200 dark:border-orange-500/30',
        hex: '#ea580c',
    },
    DUPLICATE: {
        label: 'Duplicate',
        className:
            'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300 border-slate-200 dark:border-slate-500/30',
        hex: '#64748b',
    },
    RESOLVED: {
        label: 'Resolved',
        className:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
        hex: '#059669',
    },
    DISMISSED: {
        label: 'Dismissed',
        className:
            'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300 border-zinc-200 dark:border-zinc-500/30',
        hex: '#71717a',
    },
    CLOSED: {
        label: 'Closed',
        className:
            'bg-neutral-100 text-neutral-700 dark:bg-neutral-500/15 dark:text-neutral-300 border-neutral-200 dark:border-neutral-500/30',
        hex: '#525252',
    },
};

export const SEVERITY_TONE: Record<IncidentSeverity, Tone> = {
    LOW: {
        label: 'Low',
        className:
            'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300 border-slate-200 dark:border-slate-500/30',
        hex: '#94a3b8',
    },
    MEDIUM: {
        label: 'Medium',
        className:
            'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
        hex: '#f59e0b',
    },
    HIGH: {
        label: 'High',
        className:
            'bg-orange-100 text-orange-900 dark:bg-orange-500/15 dark:text-orange-300 border-orange-200 dark:border-orange-500/30',
        hex: '#f97316',
    },
    CRITICAL: {
        label: 'Critical',
        className:
            'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300 border-red-200 dark:border-red-500/30',
        hex: '#dc2626',
    },
};

export const FLAG_SEVERITY_TONE: Record<FlagSeverity, Tone> = {
    INFO: SEVERITY_TONE.LOW,
    LOW: SEVERITY_TONE.LOW,
    MEDIUM: SEVERITY_TONE.MEDIUM,
    HIGH: SEVERITY_TONE.HIGH,
    CRITICAL: SEVERITY_TONE.CRITICAL,
};

export const APPEAL_STATUS_TONE: Record<AppealStatus, Tone> = {
    SUBMITTED: CASE_STATUS_TONE.OPEN,
    UNDER_REVIEW: CASE_STATUS_TONE.UNDER_REVIEW,
    ACCEPTED: CASE_STATUS_TONE.RESOLVED,
    REJECTED: {
        label: 'Rejected',
        className:
            'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300 border-red-200 dark:border-red-500/30',
        hex: '#dc2626',
    },
    CLOSED: CASE_STATUS_TONE.CLOSED,
};

export const SANCTION_TONE: Record<UserSanctionType, Tone> = {
    WARNING: SEVERITY_TONE.MEDIUM,
    TEMPORARY_SUSPENSION: SEVERITY_TONE.HIGH,
    PERMANENT_SUSPENSION: SEVERITY_TONE.CRITICAL,
    BAN: SEVERITY_TONE.CRITICAL,
};

/**
 * Flag colours come from the catalogue as semantic names so administrators
 * can retune them without a deploy. This map turns a name into theme-aware
 * classes; unknown names fall back to slate rather than rendering unstyled.
 */
const FLAG_COLOR_CLASSES: Record<string, string> = {
    red: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30',
    rose: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
    orange:
        'bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30',
    amber: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
    emerald:
        'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30',
    blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
    violet: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30',
    purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30',
};

export function flagColorClasses(color?: string): string {
    return FLAG_COLOR_CLASSES[color ?? 'slate'] ?? FLAG_COLOR_CLASSES.slate;
}

export const TARGET_TYPE_LABEL: Record<ModerationTargetType, string> = {
    SCENARIO: 'Scenario',
    SCENE: 'Scene',
    COMMENT: 'Comment',
    DISCUSSION: 'Discussion',
    USER_PROFILE: 'User profile',
    UPLOADED_IMAGE: 'Uploaded image',
    UPLOADED_VIDEO: 'Uploaded video',
    EXTERNAL_LINK: 'External link',
    CROWDSOURCE_REPORT: 'Crowdsourced report',
    CAPTURED_CONTENT: 'Captured content',
};

export const REPORT_REASON_LABEL: Record<IncidentReportReason, string> = {
    SCAM: 'Scam',
    HATE_SPEECH: 'Hate speech',
    VIOLENCE: 'Violence',
    FALSE_INFO: 'False information',
    OTHER: 'Other',
    SPAM: 'Spam',
    HARASSMENT: 'Harassment',
    GRAPHIC_CONTENT: 'Graphic content',
    IMPERSONATION: 'Impersonation',
    COPYRIGHT: 'Copyright',
    UNSAFE_LINK: 'Unsafe link',
    LOW_QUALITY: 'Low quality',
    DUPLICATE: 'Duplicate',
    EDUCATIONAL_CONCERN: 'Educational concern',
};

/** Human phrasing for the timeline, which otherwise reads as SHOUTED_ENUMS. */
export const ACTION_LABEL: Record<string, string> = {
    CREATED: 'Report created',
    ASSIGNED: 'Assigned',
    CLAIMED: 'Claimed',
    REASSIGNED: 'Reassigned',
    UNASSIGNED: 'Unassigned',
    REVIEW_STARTED: 'Review started',
    REQUEST_MORE_INFO: 'More information requested',
    APPROVED: 'Report upheld',
    DISMISSED: 'Report dismissed',
    MERGED_DUPLICATE: 'Merged as duplicate',
    REOPENED: 'Reopened',
    CLOSED: 'Closed',
    NOTE_ADDED: 'Note added',
    ESCALATE: 'Escalated',
    CONTENT_FLAGGED: 'Content flagged',
    CONTENT_UNFLAGGED: 'Flag removed',
    CONTENT_HIDDEN: 'Content hidden',
    CONTENT_DELETED: 'Content deleted',
    CONTENT_RESTORED: 'Content restored',
    USER_WARNED: 'User warned',
    USER_SUSPENDED: 'User suspended',
    USER_BANNED: 'User banned',
    USER_RESTORED: 'User restored',
    APPEAL_SUBMITTED: 'Appeal submitted',
    APPEAL_REVIEW_STARTED: 'Appeal review started',
    APPEAL_ACCEPTED: 'Appeal upheld',
    APPEAL_REJECTED: 'Appeal rejected',
    CONFIRM: 'Confirmed',
    REJECT: 'Rejected',
};

export function actionLabel(action: string): string {
    return ACTION_LABEL[action] ?? action.replace(/_/g, ' ').toLowerCase();
}

/** Chart palette, chosen to stay distinguishable in both themes. */
export const CHART_COLORS = [
    '#0ea5e9',
    '#8b5cf6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#14b8a6',
    '#6366f1',
];

/** `3600` → `1.0h`. Used wherever a resolution time is displayed. */
export function formatDuration(seconds: number | null | undefined): string {
    if (seconds === null || seconds === undefined) return '—';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    if (seconds < 86_400) return `${(seconds / 3600).toFixed(1)}h`;
    return `${(seconds / 86_400).toFixed(1)}d`;
}

/** Risk bands used by the user review screen. */
export function riskBand(score: number): {
    label: string;
    className: string;
    barClassName: string;
} {
    if (score >= 70) {
        return {
            label: 'High risk',
            className: 'text-red-700 dark:text-red-300',
            barClassName: 'bg-red-500',
        };
    }
    if (score >= 40) {
        return {
            label: 'Elevated risk',
            className: 'text-orange-700 dark:text-orange-300',
            barClassName: 'bg-orange-500',
        };
    }
    if (score >= 15) {
        return {
            label: 'Some history',
            className: 'text-amber-700 dark:text-amber-300',
            barClassName: 'bg-amber-500',
        };
    }
    return {
        label: 'Low risk',
        className: 'text-emerald-700 dark:text-emerald-300',
        barClassName: 'bg-emerald-500',
    };
}
