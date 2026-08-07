import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    moderationService,
    type ActionPayload,
    type AnalyticsQuery,
    type AppealStatus,
    type ModerationCaseDetail,
    type ModerationPermission,
    type QueueQuery,
} from '@/services/moderation.service';
import { useAuthStore } from '@/store/auth.store';

/**
 * Query keys are namespaced so a single `invalidateQueries({ queryKey:
 * moderationKeys.all })` after a mutation refreshes the dashboard, the queue
 * and the open case together — a moderation action almost always changes all
 * three.
 */
export const moderationKeys = {
    all: ['moderation'] as const,
    dashboard: () => [...moderationKeys.all, 'dashboard'] as const,
    permissions: () => [...moderationKeys.all, 'permissions'] as const,
    cases: (query: QueueQuery) => [...moderationKeys.all, 'cases', query] as const,
    case: (id: string) => [...moderationKeys.all, 'case', id] as const,
    moderators: () => [...moderationKeys.all, 'moderators'] as const,
    flags: (includeInactive: boolean) =>
        [...moderationKeys.all, 'flags', includeInactive] as const,
    user: (id: string) => [...moderationKeys.all, 'user', id] as const,
    appeals: (query: unknown) => [...moderationKeys.all, 'appeals', query] as const,
    appeal: (id: string) => [...moderationKeys.all, 'appeal', id] as const,
    analytics: (query: AnalyticsQuery) =>
        [...moderationKeys.all, 'analytics', query] as const,
    scorecard: (query: AnalyticsQuery) =>
        [...moderationKeys.all, 'scorecard', query] as const,
    audit: (query: unknown) => [...moderationKeys.all, 'audit', query] as const,
    savedFilters: () => [...moderationKeys.all, 'saved-filters'] as const,
    notifications: (unreadOnly: boolean) =>
        [...moderationKeys.all, 'notifications', unreadOnly] as const,
    unreadCount: () => [...moderationKeys.all, 'unread-count'] as const,
};

// ===========================================================================
// Permissions
// ===========================================================================

/**
 * The caller's capabilities, used to hide actions they cannot perform.
 *
 * This is presentation only — the server re-checks every request, so a stale
 * or tampered client cannot gain a capability by rendering a button.
 */
export function useModerationPermissions() {
    const { isAuthenticated } = useAuthStore();

    const query = useQuery({
        queryKey: moderationKeys.permissions(),
        queryFn: () => moderationService.getPermissions(),
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 10,
        retry: false,
    });

    const held = new Set(query.data?.permissions ?? []);

    return {
        ...query,
        permissions: query.data?.permissions ?? [],
        can: (permission: ModerationPermission) => held.has(permission),
        canAny: (...permissions: ModerationPermission[]) =>
            permissions.some((p) => held.has(p)),
    };
}

// ===========================================================================
// Dashboard & queue
// ===========================================================================

export function useModerationDashboard() {
    return useQuery({
        queryKey: moderationKeys.dashboard(),
        queryFn: () => moderationService.getDashboard(),
        // The overview cards are a live operational display; a minute-old
        // count is fine, an hour-old one is misleading.
        staleTime: 1000 * 60,
        refetchInterval: 1000 * 60 * 2,
    });
}

export function useModerationQueue(query: QueueQuery) {
    return useQuery({
        queryKey: moderationKeys.cases(query),
        queryFn: () => moderationService.getCases(query),
        placeholderData: (previous) => previous,
        staleTime: 1000 * 30,
    });
}

export function useModerationCase(id: string | undefined) {
    return useQuery({
        queryKey: moderationKeys.case(id ?? ''),
        queryFn: () => moderationService.getCase(id as string),
        enabled: !!id,
    });
}

export function useModerators() {
    return useQuery({
        queryKey: moderationKeys.moderators(),
        queryFn: () => moderationService.getModerators(),
        staleTime: 1000 * 60 * 5,
    });
}

// ===========================================================================
// Case mutations
// ===========================================================================

/** Rollback payload handed from `onMutate` to `onError`. */
interface OptimisticContext {
    previous: ModerationCaseDetail | undefined;
}

interface CaseActionOptions {
    caseId: string;
    /** Toast shown when the action succeeds. */
    successMessage: string;
}

/**
 * Shared wrapper for the case actions.
 *
 * Applies an optimistic status change so the UI responds immediately, rolls
 * it back if the server refuses (an illegal transition, say), and always
 * refetches afterwards so the timeline reflects what actually happened.
 */
function useCaseAction<TVariables, TData>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    { caseId, successMessage }: CaseActionOptions,
    optimisticPatch?: (
        previous: ModerationCaseDetail,
        variables: TVariables,
    ) => ModerationCaseDetail,
) {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables, OptimisticContext>({
        mutationFn,
        onMutate: async (variables) => {
            if (!optimisticPatch) return { previous: undefined };

            await queryClient.cancelQueries({
                queryKey: moderationKeys.case(caseId),
            });

            const previous = queryClient.getQueryData<ModerationCaseDetail>(
                moderationKeys.case(caseId),
            );

            if (previous) {
                queryClient.setQueryData(
                    moderationKeys.case(caseId),
                    optimisticPatch(previous, variables),
                );
            }

            return { previous };
        },
        onError: (error, _variables, context) => {
            // Put the pre-mutation case back: the server refused, so the
            // optimistic status we painted was wrong.
            if (context?.previous) {
                queryClient.setQueryData(
                    moderationKeys.case(caseId),
                    context.previous,
                );
            }

            toast.error(extractErrorMessage(error));
        },
        onSuccess: () => {
            toast.success(successMessage);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: moderationKeys.all });
        },
    });
}

export function useAssignCase(caseId: string) {
    return useCaseAction<ActionPayload & { moderatorId?: string }, unknown>(
        (payload) => moderationService.assignCase(caseId, payload),
        { caseId, successMessage: 'Case assigned' },
        (previous) => ({ ...previous, status: 'ASSIGNED' }),
    );
}

export function useReviewCase(caseId: string) {
    return useCaseAction<
        ActionPayload & { status?: 'UNDER_REVIEW' | 'AWAITING_INFO' },
        unknown
    >(
        (payload) => moderationService.reviewCase(caseId, payload),
        { caseId, successMessage: 'Case moved into review' },
        (previous, variables) => ({
            ...previous,
            status: variables.status ?? 'UNDER_REVIEW',
        }),
    );
}

export function useResolveCase(caseId: string) {
    return useCaseAction<
        ActionPayload & { outcome: 'RESOLVED' | 'DISMISSED' },
        unknown
    >(
        (payload) => moderationService.resolveCase(caseId, payload),
        { caseId, successMessage: 'Case closed' },
        (previous, variables) => ({ ...previous, status: variables.outcome }),
    );
}

export function useReopenCase(caseId: string) {
    return useCaseAction<ActionPayload, unknown>(
        (payload) => moderationService.reopenCase(caseId, payload),
        { caseId, successMessage: 'Case reopened' },
        (previous) => ({ ...previous, status: 'OPEN' }),
    );
}

export function useEscalateCase(caseId: string) {
    return useCaseAction<ActionPayload & { escalateToId?: string }, unknown>(
        (payload) => moderationService.escalateCase(caseId, payload),
        { caseId, successMessage: 'Case escalated' },
        (previous) => ({ ...previous, status: 'ESCALATED' }),
    );
}

export function useCloseCase(caseId: string) {
    return useCaseAction<ActionPayload, unknown>(
        (payload) => moderationService.closeCase(caseId, payload),
        { caseId, successMessage: 'Case closed' },
        (previous) => ({ ...previous, status: 'CLOSED' }),
    );
}

export function useFlagCase(caseId: string) {
    return useCaseAction<ActionPayload & { flagCodes: string[] }, unknown>(
        (payload) => moderationService.flagCase(caseId, payload),
        { caseId, successMessage: 'Flags applied' },
    );
}

export function useMergeCases(caseId: string) {
    return useCaseAction<ActionPayload & { duplicateIds: string[] }, unknown>(
        (payload) => moderationService.mergeCases(caseId, payload),
        { caseId, successMessage: 'Duplicates merged' },
    );
}

export function useContentAction(
    caseId: string,
    action: 'hide' | 'delete' | 'restore',
) {
    const call = {
        hide: moderationService.hideContent,
        delete: moderationService.deleteContent,
        restore: moderationService.restoreContent,
    }[action];

    const message = {
        hide: 'Content hidden',
        delete: 'Content deleted',
        restore: 'Content restored',
    }[action];

    const visibility = {
        hide: 'HIDDEN',
        delete: 'DELETED',
        restore: 'VISIBLE',
    }[action] as ModerationCaseDetail['contentVisibility'];

    return useCaseAction<ActionPayload, unknown>(
        (payload) => call(caseId, payload),
        { caseId, successMessage: message },
        (previous) => ({ ...previous, contentVisibility: visibility }),
    );
}

export function useAddCaseNote(caseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: {
            body: string;
            attachments?: string[];
            mentionedUserIds?: string[];
        }) => moderationService.addCaseNote(caseId, payload),
        onSuccess: () => {
            toast.success('Note added');
            queryClient.invalidateQueries({ queryKey: moderationKeys.case(caseId) });
        },
        onError: (error) => toast.error(extractErrorMessage(error)),
    });
}

// ===========================================================================
// Users
// ===========================================================================

export function useUserModerationProfile(userId: string | undefined) {
    return useQuery({
        queryKey: moderationKeys.user(userId ?? ''),
        queryFn: () => moderationService.getUserProfile(userId as string),
        enabled: !!userId,
    });
}

export function useUserSanction(
    userId: string,
    action: 'warn' | 'suspend' | 'restore',
) {
    const queryClient = useQueryClient();

    const call = {
        warn: moderationService.warnUser,
        suspend: moderationService.suspendUser,
        restore: moderationService.restoreUser,
    }[action];

    const message = {
        warn: 'Warning issued',
        suspend: 'Account suspended',
        restore: 'Account restored',
    }[action];

    return useMutation({
        mutationFn: (payload: ActionPayload & Record<string, unknown>) =>
            call(userId, payload as never),
        onSuccess: () => {
            toast.success(message);
            queryClient.invalidateQueries({ queryKey: moderationKeys.all });
        },
        onError: (error) => toast.error(extractErrorMessage(error)),
    });
}

// ===========================================================================
// Flags
// ===========================================================================

export function useFlagCatalogue(includeInactive = false) {
    return useQuery({
        queryKey: moderationKeys.flags(includeInactive),
        queryFn: () => moderationService.getFlags(includeInactive),
        staleTime: 1000 * 60 * 15,
    });
}

export function useFlagMutation(action: 'create' | 'update' | 'delete') {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { id?: string; payload?: Record<string, unknown> }) => {
            if (action === 'create') {
                return moderationService.createFlag(variables.payload as never);
            }
            if (action === 'update') {
                return moderationService.updateFlag(
                    variables.id as string,
                    variables.payload as never,
                );
            }
            return moderationService.deleteFlag(variables.id as string);
        },
        onSuccess: () => {
            toast.success(
                action === 'create'
                    ? 'Flag created'
                    : action === 'update'
                        ? 'Flag updated'
                        : 'Flag removed',
            );
            queryClient.invalidateQueries({ queryKey: moderationKeys.all });
        },
        onError: (error) => toast.error(extractErrorMessage(error)),
    });
}

// ===========================================================================
// Appeals
// ===========================================================================

export function useAppeals(query: {
    page?: number;
    limit?: number;
    status?: AppealStatus;
    search?: string;
}) {
    return useQuery({
        queryKey: moderationKeys.appeals(query),
        queryFn: () => moderationService.getAppeals(query),
        placeholderData: (previous) => previous,
    });
}

export function useAppeal(id: string | undefined) {
    return useQuery({
        queryKey: moderationKeys.appeal(id ?? ''),
        queryFn: () => moderationService.getAppeal(id as string),
        enabled: !!id,
    });
}

export function useAppealDecision(appealId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: {
            decision: 'ACCEPTED' | 'REJECTED';
            moderatorResponse: string;
        }) => moderationService.decideAppeal(appealId, payload),
        onSuccess: (_data, variables) => {
            toast.success(
                variables.decision === 'ACCEPTED'
                    ? 'Appeal upheld — the sanction has been reversed'
                    : 'Appeal rejected',
            );
            queryClient.invalidateQueries({ queryKey: moderationKeys.all });
        },
        onError: (error) => toast.error(extractErrorMessage(error)),
    });
}

export function useStartAppealReview(appealId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => moderationService.startAppealReview(appealId),
        onSuccess: () => {
            toast.success('Appeal claimed for review');
            queryClient.invalidateQueries({ queryKey: moderationKeys.all });
        },
        onError: (error) => toast.error(extractErrorMessage(error)),
    });
}

// ===========================================================================
// Analytics, audit, filters, notifications
// ===========================================================================

export function useModerationAnalytics(query: AnalyticsQuery) {
    return useQuery({
        queryKey: moderationKeys.analytics(query),
        queryFn: () => moderationService.getAnalytics(query),
        staleTime: 1000 * 60 * 5,
    });
}

export function useModeratorScorecard(query: AnalyticsQuery) {
    return useQuery({
        queryKey: moderationKeys.scorecard(query),
        queryFn: () => moderationService.getModeratorScorecard(query),
        staleTime: 1000 * 60 * 5,
    });
}

export function useModerationAudit(query: Record<string, unknown>) {
    return useQuery({
        queryKey: moderationKeys.audit(query),
        queryFn: () => moderationService.getAuditLog(query),
        placeholderData: (previous) => previous,
    });
}

export function useSavedFilters() {
    return useQuery({
        queryKey: moderationKeys.savedFilters(),
        queryFn: () => moderationService.getSavedFilters(),
        staleTime: 1000 * 60 * 5,
    });
}

export function useSaveFilter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: {
            name: string;
            icon?: string;
            query: Record<string, unknown>;
            isShared?: boolean;
        }) => moderationService.createSavedFilter(payload),
        onSuccess: () => {
            toast.success('Filter saved');
            queryClient.invalidateQueries({
                queryKey: moderationKeys.savedFilters(),
            });
        },
        onError: (error) => toast.error(extractErrorMessage(error)),
    });
}

export function useDeleteSavedFilter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => moderationService.deleteSavedFilter(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: moderationKeys.savedFilters(),
            });
        },
        onError: (error) => toast.error(extractErrorMessage(error)),
    });
}

export function useModerationNotifications(unreadOnly = false) {
    return useQuery({
        queryKey: moderationKeys.notifications(unreadOnly),
        queryFn: () => moderationService.getNotifications(unreadOnly),
        refetchInterval: 1000 * 60,
    });
}

export function useMarkNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids?: string[]) => moderationService.markNotificationsRead(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: moderationKeys.all });
        },
    });
}

// ===========================================================================
// Helpers
// ===========================================================================

/**
 * Surface the API's own message. Nest's exception filters carry the useful
 * detail ("A case in RESOLVED cannot move to DISMISSED"), which is far more
 * actionable than a generic failure toast.
 */
export function extractErrorMessage(error: unknown): string {
    const response = (
        error as {
            response?: { data?: { message?: string | string[]; error?: string } };
        }
    )?.response;

    const message = response?.data?.message;

    if (Array.isArray(message)) return message.join('. ');
    if (typeof message === 'string') return message;
    if (response?.data?.error) return response.data.error;

    return (error as Error)?.message ?? 'Something went wrong. Please try again.';
}
