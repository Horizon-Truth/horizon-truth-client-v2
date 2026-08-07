import api from './api';
import type { UserRole } from '../store/auth.store';

// ===========================================================================
// Domain types — mirror the backend enums in src/shared/enums
// ===========================================================================

export type ModerationCaseStatus =
    | 'OPEN'
    | 'ASSIGNED'
    | 'UNDER_REVIEW'
    | 'AWAITING_INFO'
    | 'ESCALATED'
    | 'DUPLICATE'
    | 'RESOLVED'
    | 'DISMISSED'
    | 'CLOSED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ModerationTargetType =
    | 'SCENARIO'
    | 'SCENE'
    | 'COMMENT'
    | 'DISCUSSION'
    | 'USER_PROFILE'
    | 'UPLOADED_IMAGE'
    | 'UPLOADED_VIDEO'
    | 'EXTERNAL_LINK'
    | 'CROWDSOURCE_REPORT'
    | 'CAPTURED_CONTENT';

export type IncidentReportReason =
    | 'SCAM'
    | 'HATE_SPEECH'
    | 'VIOLENCE'
    | 'FALSE_INFO'
    | 'OTHER'
    | 'SPAM'
    | 'HARASSMENT'
    | 'GRAPHIC_CONTENT'
    | 'IMPERSONATION'
    | 'COPYRIGHT'
    | 'UNSAFE_LINK'
    | 'LOW_QUALITY'
    | 'DUPLICATE'
    | 'EDUCATIONAL_CONCERN';

export type FlagSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AppealStatus =
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'CLOSED';

export type UserSanctionType =
    | 'WARNING'
    | 'TEMPORARY_SUSPENSION'
    | 'PERMANENT_SUSPENSION'
    | 'BAN';

export type UserSanctionStatus =
    | 'ACTIVE'
    | 'EXPIRED'
    | 'REVOKED'
    | 'OVERTURNED';

export type ContentVisibility = 'VISIBLE' | 'HIDDEN' | 'DELETED';

/** Capability strings returned by GET /moderation/permissions. */
export type ModerationPermission =
    | 'moderation:view_dashboard'
    | 'moderation:review_reports'
    | 'moderation:assign_reports'
    | 'moderation:assign_others'
    | 'moderation:flag_content'
    | 'moderation:hide_content'
    | 'moderation:delete_content'
    | 'moderation:restore_content'
    | 'moderation:warn_users'
    | 'moderation:suspend_users'
    | 'moderation:ban_users'
    | 'moderation:restore_users'
    | 'moderation:manage_flags'
    | 'moderation:review_appeals'
    | 'moderation:view_analytics'
    | 'moderation:view_audit'
    | 'moderation:export_data'
    | 'moderation:manage_moderators';

export const Permission = {
    VIEW_DASHBOARD: 'moderation:view_dashboard',
    REVIEW_REPORTS: 'moderation:review_reports',
    ASSIGN_REPORTS: 'moderation:assign_reports',
    ASSIGN_OTHERS: 'moderation:assign_others',
    FLAG_CONTENT: 'moderation:flag_content',
    HIDE_CONTENT: 'moderation:hide_content',
    DELETE_CONTENT: 'moderation:delete_content',
    RESTORE_CONTENT: 'moderation:restore_content',
    WARN_USERS: 'moderation:warn_users',
    SUSPEND_USERS: 'moderation:suspend_users',
    BAN_USERS: 'moderation:ban_users',
    RESTORE_USERS: 'moderation:restore_users',
    MANAGE_FLAGS: 'moderation:manage_flags',
    REVIEW_APPEALS: 'moderation:review_appeals',
    VIEW_ANALYTICS: 'moderation:view_analytics',
    VIEW_AUDIT: 'moderation:view_audit',
    EXPORT_DATA: 'moderation:export_data',
    MANAGE_MODERATORS: 'moderation:manage_moderators',
} satisfies Record<string, ModerationPermission>;

// ===========================================================================
// Entity shapes
// ===========================================================================

export interface ModeratorSummary {
    id: string;
    fullName: string;
    username?: string;
    email?: string;
    role: UserRole;
    lastLoginAt?: string;
    openCases: number;
}

export interface ModerationFlag {
    id: string;
    code: string;
    label: string;
    description: string;
    severity: FlagSeverity;
    color: string;
    icon: string;
    isSystem: boolean;
    isActive: boolean;
    sortOrder: number;
    translations?: Record<string, { label?: string; description?: string }>;
}

export interface FlagAssignment {
    id: string;
    flagId: string;
    flag?: ModerationFlag;
    targetType: ModerationTargetType;
    targetId: string;
    reason?: string;
    appliedById: string;
    appliedBy?: { id: string; fullName: string };
    removedAt?: string | null;
    removalReason?: string | null;
    createdAt: string;
}

export interface CaseFlagChip {
    id: string;
    code?: string;
    label?: string;
    color?: string;
    icon?: string;
    severity?: FlagSeverity;
}

export interface ModerationCase {
    id: string;
    caseNumber: string;
    status: ModerationCaseStatus;
    severity: IncidentSeverity;
    targetType: ModerationTargetType;
    targetId?: string | null;
    targetPreview?: string | null;
    reportReason: IncidentReportReason;
    description: string;
    evidenceUrls?: string[] | null;
    isAnonymous: boolean;
    reportedByUserId?: string | null;
    reportedByUser?: { id: string; fullName: string; username?: string } | null;
    reportedUserId?: string | null;
    reportedUser?: { id: string; fullName: string; username?: string } | null;
    assignedModeratorId?: string | null;
    assignedModerator?: { id: string; fullName: string } | null;
    assignedAt?: string | null;
    duplicateOfId?: string | null;
    escalatedToId?: string | null;
    reopenCount: number;
    resolutionNotes?: string | null;
    resolvedAt?: string | null;
    resolutionSeconds?: number | null;
    firstReviewedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    flags?: CaseFlagChip[];
}

export interface ContentPreview {
    targetType: ModerationTargetType;
    targetId: string | null;
    title: string;
    body: string | null;
    mediaUrl: string | null;
    externalUrl: string | null;
    authorId: string | null;
    available: boolean;
    deepLink: string | null;
}

export interface TimelineEvent {
    kind: 'ACTION' | 'STATUS';
    id: string;
    at: string;
    action: string;
    actorId: string | null;
    actorName: string | null;
    reason: string | null;
    notes: string | null;
    previousValue: Record<string, unknown> | null;
    newValue: Record<string, unknown> | null;
}

export interface ModerationNote {
    id: string;
    body: string;
    attachments?: string[] | null;
    mentionedUserIds?: string[] | null;
    authorId: string;
    author?: { id: string; fullName: string };
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface ModerationCaseDetail extends ModerationCase {
    preview: ContentPreview;
    contentVisibility: ContentVisibility;
    flags: FlagAssignment[];
    notes: ModerationNote[];
    duplicates: Array<{ id: string; caseNumber: string; createdAt: string }>;
    timeline: TimelineEvent[];
}

export interface UserSanction {
    id: string;
    userId: string;
    type: UserSanctionType;
    status: UserSanctionStatus;
    reason: string;
    notes?: string | null;
    expiresAt?: string | null;
    issuedById: string;
    issuedBy?: { id: string; fullName: string };
    incidentReportId?: string | null;
    liftedAt?: string | null;
    liftReason?: string | null;
    createdAt: string;
}

export interface UserModerationProfile {
    user: {
        id: string;
        fullName: string;
        username?: string;
        email?: string;
        role: UserRole;
        status: string;
        createdAt: string;
        lastLoginAt?: string;
    };
    counts: {
        reportsReceived: number;
        reportsUpheld: number;
        reportsDismissed: number;
        reportsFiled: number;
        warnings: number;
        suspensions: number;
        bans: number;
        appeals: number;
        appealsUpheld: number;
    };
    riskScore: number;
    activeSanctions: UserSanction[];
    sanctionHistory: UserSanction[];
    reportsAgainst: ModerationCase[];
    appeals: Appeal[];
    notes: ModerationNote[];
    timeline: Array<{
        kind: 'SANCTION' | 'REPORT' | 'APPEAL';
        id: string;
        at: string;
        label: string;
        detail: string;
        status: string;
    }>;
}

export interface Appeal {
    id: string;
    appealNumber: string;
    appellantId: string;
    appellant?: { id: string; fullName: string; username?: string };
    subjectType: 'CASE' | 'SANCTION' | 'CONTENT_REMOVAL';
    incidentReportId?: string | null;
    sanctionId?: string | null;
    sanction?: UserSanction | null;
    reason: string;
    supportingEvidence?: string | null;
    attachments?: string[] | null;
    status: AppealStatus;
    reviewerId?: string | null;
    reviewer?: { id: string; fullName: string } | null;
    moderatorResponse?: string | null;
    reviewedAt?: string | null;
    createdAt: string;
}

export interface DashboardOverview {
    pendingReports: number;
    awaitingReview: number;
    escalated: number;
    flaggedContent: number;
    suspendedUsers: number;
    activeModerators: number;
    resolvedToday: number;
    reportsThisWeek: number;
    openAppeals: number;
    averageResolutionSeconds: number | null;
    generatedAt: string;
}

export interface NamedValue {
    name: string;
    value: number;
    label?: string;
    color?: string;
    severity?: FlagSeverity;
}

export interface TimeSeriesPoint {
    bucket: string;
    [series: string]: string | number;
}

export interface ModerationAnalytics {
    window: { from: string; to: string };
    granularity: 'day' | 'week' | 'month';
    reportsOverTime: TimeSeriesPoint[];
    reportsByType: NamedValue[];
    violationCategories: NamedValue[];
    resolutionStats: {
        total: number;
        upheld: number;
        dismissed: number;
        duplicates: number;
        averageSeconds: number | null;
        medianSeconds: number | null;
        p90Seconds: number | null;
    };
    moderatorActivity: Array<{ moderatorId: string; name: string; value: number }>;
    appealStats: {
        byStatus: Partial<Record<AppealStatus, number>>;
        total: number;
        decided: number;
        overturnRatePercent: number | null;
    };
    removalTrends: TimeSeriesPoint[];
    severityBreakdown: NamedValue[];
    statusBreakdown: NamedValue[];
}

export interface ModeratorScorecardRow {
    moderatorId: string;
    fullName: string;
    role: UserRole;
    handled: number;
    upheld: number;
    dismissed: number;
    pending: number;
    appealsOverturned: number;
    averageResolutionSeconds: number;
    accuracyPercent: number | null;
}

export interface SavedFilter {
    id: string;
    ownerId: string;
    name: string;
    icon?: string | null;
    query: Record<string, unknown>;
    isShared: boolean;
    sortOrder: number;
}

export interface ModerationNotification {
    id: string;
    type: string;
    title: string;
    body: string;
    link?: string | null;
    isUrgent: boolean;
    readAt?: string | null;
    createdAt: string;
}

export interface AuditEntry {
    id: string;
    userId?: string;
    user?: { id: string; fullName: string; username?: string; email?: string };
    action: string;
    entityType: string;
    entityId: string;
    reason?: string | null;
    previousValue?: Record<string, unknown> | null;
    newValue?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

/** The narrowed self-service view: no internal notes, no moderator identity. */
export interface OwnSanction {
    id: string;
    type: UserSanctionType;
    status: UserSanctionStatus;
    reason: string;
    expiresAt: string | null;
    createdAt: string;
    liftedAt: string | null;
    /** Mirrors the API's own appeal checks, so we never offer a refused action. */
    isAppealable: boolean;
}

export interface OwnModerationRecord {
    sanctions: OwnSanction[];
    appeals: Array<{
        id: string;
        appealNumber: string;
        subjectType: 'CASE' | 'SANCTION' | 'CONTENT_REMOVAL';
        sanctionId: string | null;
        incidentReportId: string | null;
        reason: string;
        status: AppealStatus;
        moderatorResponse: string | null;
        reviewedAt: string | null;
        createdAt: string;
    }>;
    appealWindowDays: number;
}

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ===========================================================================
// Request payloads
// ===========================================================================

export interface QueueQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: ModerationCaseStatus[];
    severity?: IncidentSeverity[];
    reason?: IncidentReportReason[];
    targetType?: ModerationTargetType[];
    assignedModeratorId?: string;
    unassigned?: boolean;
    mine?: boolean;
    openOnly?: boolean;
    reportedUserId?: string;
    flagCode?: string;
    from?: string;
    to?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'severity' | 'status' | 'resolvedAt';
    sortOrder?: 'ASC' | 'DESC';
}

/** Shared by every moderation action: reason is mandatory, notes optional. */
export interface ActionPayload {
    reason: string;
    notes?: string;
}

export type AnalyticsQuery = {
    from?: string;
    to?: string;
    granularity?: 'day' | 'week' | 'month';
    moderatorId?: string;
    topN?: number;
};

// ===========================================================================
// Client
// ===========================================================================

/**
 * Repeated query keys (`?status=A&status=B`) are what the backend DTO expects,
 * and axios serialises arrays that way when told to drop the `[]` suffix.
 */
function serialiseQuery(query: Record<string, unknown>): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === '') continue;

        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
        } else {
            params.append(key, String(value));
        }
    }

    return params.toString();
}

export const moderationService = {
    // --- Dashboard & queue ---------------------------------------------

    async getDashboard(): Promise<DashboardOverview> {
        const { data } = await api.get('/moderation/dashboard');
        return data;
    },

    async getPermissions(): Promise<{
        role: UserRole;
        permissions: ModerationPermission[];
    }> {
        const { data } = await api.get('/moderation/permissions');
        return data;
    },

    async getCases(query: QueueQuery = {}): Promise<Paginated<ModerationCase>> {
        const { data } = await api.get(
            `/moderation/reports?${serialiseQuery(query as Record<string, unknown>)}`,
        );
        return data;
    },

    async getCase(id: string): Promise<ModerationCaseDetail> {
        const { data } = await api.get(`/moderation/reports/${id}`);
        return data;
    },

    // --- Case actions ---------------------------------------------------

    async assignCase(
        id: string,
        payload: ActionPayload & { moderatorId?: string },
    ) {
        const { data } = await api.post(`/moderation/reports/${id}/assign`, payload);
        return data;
    },

    async reviewCase(
        id: string,
        payload: ActionPayload & {
            severity?: IncidentSeverity;
            status?: 'UNDER_REVIEW' | 'AWAITING_INFO';
        },
    ) {
        const { data } = await api.post(`/moderation/reports/${id}/review`, payload);
        return data;
    },

    async flagCase(id: string, payload: ActionPayload & { flagCodes: string[] }) {
        const { data } = await api.post(`/moderation/reports/${id}/flag`, payload);
        return data;
    },

    async resolveCase(
        id: string,
        payload: ActionPayload & { outcome: 'RESOLVED' | 'DISMISSED' },
    ) {
        const { data } = await api.post(`/moderation/reports/${id}/resolve`, payload);
        return data;
    },

    async reopenCase(id: string, payload: ActionPayload) {
        const { data } = await api.post(`/moderation/reports/${id}/reopen`, payload);
        return data;
    },

    async closeCase(id: string, payload: ActionPayload) {
        const { data } = await api.post(`/moderation/reports/${id}/close`, payload);
        return data;
    },

    async escalateCase(
        id: string,
        payload: ActionPayload & { escalateToId?: string },
    ) {
        const { data } = await api.post(`/moderation/reports/${id}/escalate`, payload);
        return data;
    },

    async mergeCases(
        id: string,
        payload: ActionPayload & { duplicateIds: string[] },
    ) {
        const { data } = await api.post(`/moderation/reports/${id}/merge`, payload);
        return data;
    },

    async hideContent(id: string, payload: ActionPayload) {
        const { data } = await api.post(
            `/moderation/reports/${id}/content/hide`,
            payload,
        );
        return data;
    },

    async deleteContent(id: string, payload: ActionPayload) {
        const { data } = await api.post(
            `/moderation/reports/${id}/content/delete`,
            payload,
        );
        return data;
    },

    async restoreContent(id: string, payload: ActionPayload) {
        const { data } = await api.post(
            `/moderation/reports/${id}/content/restore`,
            payload,
        );
        return data;
    },

    // --- Notes -----------------------------------------------------------

    async addCaseNote(
        caseId: string,
        payload: { body: string; attachments?: string[]; mentionedUserIds?: string[] },
    ): Promise<ModerationNote> {
        const { data } = await api.post(`/moderation/reports/${caseId}/notes`, payload);
        return data;
    },

    async getCaseNotes(caseId: string, search?: string) {
        const { data } = await api.get(`/moderation/reports/${caseId}/notes`, {
            params: { search },
        });
        return data as Paginated<ModerationNote>;
    },

    async updateNote(noteId: string, payload: { body: string; attachments?: string[] }) {
        const { data } = await api.patch(`/moderation/notes/${noteId}`, payload);
        return data;
    },

    async deleteNote(noteId: string) {
        const { data } = await api.delete(`/moderation/notes/${noteId}`);
        return data;
    },

    async getNoteRevisions(noteId: string) {
        const { data } = await api.get(`/moderation/notes/${noteId}/revisions`);
        return data;
    },

    // --- Users -----------------------------------------------------------

    async getModerators(): Promise<ModeratorSummary[]> {
        const { data } = await api.get('/moderation/moderators');
        return data;
    },

    async getUserProfile(userId: string): Promise<UserModerationProfile> {
        const { data } = await api.get(`/moderation/users/${userId}`);
        return data;
    },

    async warnUser(
        userId: string,
        payload: ActionPayload & { incidentReportId?: string },
    ) {
        const { data } = await api.post(`/moderation/users/${userId}/warn`, payload);
        return data;
    },

    async suspendUser(
        userId: string,
        payload: ActionPayload & {
            durationDays?: number;
            permanent?: boolean;
            ban?: boolean;
            incidentReportId?: string;
        },
    ) {
        const { data } = await api.post(`/moderation/users/${userId}/suspend`, payload);
        return data;
    },

    async restoreUser(
        userId: string,
        payload: ActionPayload & { sanctionId?: string },
    ) {
        const { data } = await api.post(`/moderation/users/${userId}/restore`, payload);
        return data;
    },

    async addUserNote(
        userId: string,
        payload: { body: string; attachments?: string[]; mentionedUserIds?: string[] },
    ) {
        const { data } = await api.post(`/moderation/users/${userId}/notes`, payload);
        return data;
    },

    // --- Flags -----------------------------------------------------------

    async getFlags(includeInactive = false): Promise<ModerationFlag[]> {
        const { data } = await api.get('/moderation/flags', {
            params: includeInactive ? { includeInactive: true } : {},
        });
        return data;
    },

    async createFlag(payload: Partial<ModerationFlag> & { code: string; label: string; description: string }) {
        const { data } = await api.post('/moderation/flags', payload);
        return data;
    },

    async updateFlag(id: string, payload: Partial<ModerationFlag>) {
        const { data } = await api.patch(`/moderation/flags/${id}`, payload);
        return data;
    },

    async deleteFlag(id: string) {
        const { data } = await api.delete(`/moderation/flags/${id}`);
        return data;
    },

    async removeFlagAssignment(assignmentId: string, payload: ActionPayload) {
        const { data } = await api.post(
            `/moderation/flags/assignments/${assignmentId}/remove`,
            payload,
        );
        return data;
    },

    // --- Appeals ---------------------------------------------------------

    async getAppeals(query: {
        page?: number;
        limit?: number;
        status?: AppealStatus;
        search?: string;
    } = {}): Promise<Paginated<Appeal>> {
        const { data } = await api.get('/moderation/appeals', { params: query });
        return data;
    },

    async getAppeal(id: string): Promise<Appeal> {
        const { data } = await api.get(`/moderation/appeals/${id}`);
        return data;
    },

    async startAppealReview(id: string) {
        const { data } = await api.post(`/moderation/appeals/${id}/review`, {});
        return data;
    },

    async decideAppeal(
        id: string,
        payload: { decision: 'ACCEPTED' | 'REJECTED'; moderatorResponse: string },
    ) {
        const { data } = await api.post(`/moderation/appeals/${id}/decide`, payload);
        return data;
    },

    async submitAppeal(payload: {
        subjectType: 'CASE' | 'SANCTION' | 'CONTENT_REMOVAL';
        incidentReportId?: string;
        sanctionId?: string;
        reason: string;
        supportingEvidence?: string;
        attachments?: string[];
    }) {
        const { data } = await api.post('/moderation/appeals', payload);
        return data;
    },

    async getMyAppeals(): Promise<Appeal[]> {
        const { data } = await api.get('/moderation/appeals/mine');
        return data;
    },

    /** The caller's own sanctions and appeals. Any signed-in user may call it. */
    async getMyRecord(): Promise<OwnModerationRecord> {
        const { data } = await api.get('/moderation/me/record');
        return data;
    },

    // --- Analytics & audit ------------------------------------------------

    async getAnalytics(query: AnalyticsQuery = {}): Promise<ModerationAnalytics> {
        const { data } = await api.get('/moderation/analytics', { params: query });
        return data;
    },

    async getModeratorScorecard(
        query: AnalyticsQuery = {},
    ): Promise<ModeratorScorecardRow[]> {
        const { data } = await api.get('/moderation/analytics/moderators', {
            params: query,
        });
        return data;
    },

    /** Returns a Blob so the caller can trigger a download. */
    async exportAnalytics(
        query: AnalyticsQuery & { format: 'csv' | 'xlsx' | 'pdf' },
    ): Promise<Blob> {
        const { data } = await api.get('/moderation/analytics/export', {
            params: query,
            responseType: 'blob',
        });
        return data;
    },

    async getAuditLog(query: {
        page?: number;
        limit?: number;
        userId?: string;
        action?: string;
        entityType?: string;
        entityId?: string;
        search?: string;
        from?: string;
        to?: string;
    } = {}): Promise<Paginated<AuditEntry>> {
        const { data } = await api.get('/moderation/audit', { params: query });
        return data;
    },

    // --- Saved filters ----------------------------------------------------

    async getSavedFilters(): Promise<SavedFilter[]> {
        const { data } = await api.get('/moderation/saved-filters');
        return data;
    },

    async createSavedFilter(payload: {
        name: string;
        icon?: string;
        query: Record<string, unknown>;
        isShared?: boolean;
    }) {
        const { data } = await api.post('/moderation/saved-filters', payload);
        return data;
    },

    async deleteSavedFilter(id: string) {
        const { data } = await api.delete(`/moderation/saved-filters/${id}`);
        return data;
    },

    // --- Notifications ----------------------------------------------------

    async getNotifications(unreadOnly = false) {
        const { data } = await api.get('/moderation/notifications', {
            params: { unreadOnly },
        });
        return data as Paginated<ModerationNotification> & { unreadCount: number };
    },

    async getUnreadCount(): Promise<number> {
        const { data } = await api.get('/moderation/notifications/unread-count');
        return data.count;
    },

    async markNotificationsRead(ids?: string[]) {
        const { data } = await api.post('/moderation/notifications/read', { ids });
        return data;
    },

    // --- Intake -----------------------------------------------------------

    async reportContent(payload: {
        targetType: ModerationTargetType;
        targetId?: string;
        reportedUserId?: string;
        reportReason: IncidentReportReason;
        description: string;
        evidenceUrls?: string[];
        severity?: IncidentSeverity;
        isAnonymous?: boolean;
    }) {
        const { data } = await api.post('/moderation/report', payload);
        return data;
    },
};

/** Trigger a browser download for an exported report. */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
