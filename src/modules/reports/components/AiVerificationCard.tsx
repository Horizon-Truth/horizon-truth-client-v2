import { useCallback, useEffect, useRef, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ExternalLink,
    HelpCircle,
    Info,
    Loader2,
    RefreshCw,
    Sparkles,
    XCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
    aiVerificationService,
    isAiVerificationInProgress,
    type AiVerification,
} from "@/services/ai-verification.service";
import {
    formatRelevance,
    getConfidenceLabel,
    getRenderableSources,
    getSourceDomain,
    getVerdictPresentation,
    getVerificationView,
    toExcerpt,
    type VerdictTone,
} from "./ai-verification.presentation";

/**
 * AI verification panel for a crowdsourced report.
 *
 * Deliberately framed as one evidence layer: it presents what the AI found and
 * why, alongside — never instead of — community verification and moderator
 * review. It reads and re-runs through the Horizon-Truth API; the external AI
 * service is the backend's concern.
 *
 * The card never POSTs on mount. Mounting only reads stored state, so opening or
 * refreshing a report cannot trigger repeat analyses; a new analysis happens
 * only when someone presses a button.
 */

const POLL_INTERVAL_MS = 3000;
/** ~2 minutes of polling; a run that outlives this is picked up on next visit. */
const MAX_POLLS = 40;

const TONE_ICONS: Record<VerdictTone, typeof CheckCircle2> = {
    positive: CheckCircle2,
    negative: XCircle,
    caution: AlertTriangle,
    neutral: HelpCircle,
};

export interface AiVerificationCardProps {
    reportId: string;
    /**
     * Verification that came with the report payload. `undefined` means "not
     * loaded yet" and the card fetches it; `null` means "confirmed none".
     */
    initialVerification?: AiVerification | null;
    /** False for signed-out visitors, who are prompted to sign in instead. */
    canRequest?: boolean;
    onRequireAuth?: () => void;
    /** Moderator surfaces additionally show claim/provider/timestamps. */
    variant?: "public" | "moderator";
    className?: string;
}

export function AiVerificationCard({
    reportId,
    initialVerification,
    canRequest = true,
    onRequireAuth,
    variant = "public",
    className,
}: AiVerificationCardProps) {
    const [verification, setVerification] = useState<AiVerification | null>(initialVerification ?? null);
    const [isLoading, setIsLoading] = useState(initialVerification === undefined);
    const [isRequesting, setIsRequesting] = useState(false);
    const [requestError, setRequestError] = useState<string | null>(null);
    const [isReasoningOpen, setIsReasoningOpen] = useState(false);

    // Guards against state updates and stray polls after unmount.
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (initialVerification !== undefined) {
            setVerification(initialVerification);
            setIsLoading(false);
        }
    }, [initialVerification]);

    const loadVerification = useCallback(async () => {
        try {
            const result = await aiVerificationService.getVerification(reportId);
            if (isMounted.current) setVerification(result);
            return result;
        } catch {
            // A read failure leaves the last known state in place rather than
            // blanking a result the reader was looking at.
            return null;
        }
    }, [reportId]);

    useEffect(() => {
        if (initialVerification !== undefined) return;

        let cancelled = false;
        setIsLoading(true);
        void loadVerification().finally(() => {
            if (!cancelled && isMounted.current) setIsLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [initialVerification, loadVerification]);

    // While an attempt is running, poll until it reaches a terminal state.
    useEffect(() => {
        if (!isAiVerificationInProgress(verification)) return;

        let polls = 0;
        const timer = setInterval(() => {
            polls += 1;
            if (polls > MAX_POLLS) {
                clearInterval(timer);
                return;
            }
            void loadVerification();
        }, POLL_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [verification, loadVerification]);

    const runVerification = useCallback(
        async (force: boolean) => {
            if (!canRequest) {
                onRequireAuth?.();
                return;
            }
            if (isRequesting) return; // Debounces double clicks.

            setIsRequesting(true);
            setRequestError(null);
            try {
                const result = await aiVerificationService.requestVerification(reportId, force);
                if (isMounted.current) setVerification(result);
            } catch {
                // Backend messages can carry internals; show a fixed, safe line.
                if (isMounted.current) {
                    setRequestError("AI verification could not be started. Please try again in a moment.");
                }
            } finally {
                if (isMounted.current) setIsRequesting(false);
            }
        },
        [canRequest, isRequesting, onRequireAuth, reportId],
    );

    const view = isLoading ? "loading" : getVerificationView(verification);
    const isModerator = variant === "moderator";

    return (
        <section
            aria-labelledby="ai-verification-heading"
            className={cn(
                "rounded-3xl border bg-card shadow-sm overflow-hidden",
                className,
            )}
        >
            <header className="flex flex-wrap items-start justify-between gap-4 border-b bg-muted/30 px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Sparkles size={20} aria-hidden="true" />
                    </span>
                    <div>
                        <h3 id="ai-verification-heading" className="text-xl font-bold tracking-tight sm:text-2xl">
                            AI Verification
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            AI-assisted analysis — separate from community and moderator review
                        </p>
                    </div>
                </div>

                {view === "result" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-semibold"
                        onClick={() => void runVerification(true)}
                        disabled={isRequesting}
                    >
                        {isRequesting ? (
                            <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />
                        ) : (
                            <RefreshCw size={16} className="mr-2" aria-hidden="true" />
                        )}
                        Run AI verification again
                    </Button>
                )}
            </header>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
                {view === "loading" && <AnalyzingState />}

                {view === "none" && (
                    <NotAnalysedState
                        canRequest={canRequest}
                        isRequesting={isRequesting}
                        onRun={() => void runVerification(false)}
                    />
                )}

                {view === "failed" && (
                    <FailedState
                        isRequesting={isRequesting}
                        canRequest={canRequest}
                        onRetry={() => void runVerification(true)}
                    />
                )}

                {view === "result" && verification && (
                    <ResultState
                        verification={verification}
                        isReasoningOpen={isReasoningOpen}
                        onToggleReasoning={() => setIsReasoningOpen((open) => !open)}
                        showMetadata={isModerator}
                    />
                )}

                {requestError && (
                    <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                        {requestError}
                    </p>
                )}
            </div>

            <Disclaimer />
        </section>
    );
}

/** Progressive skeleton — never a blank card while an attempt runs. */
function AnalyzingState() {
    const steps = ["Checking available evidence", "Evaluating sources", "Preparing assessment"];

    return (
        <div role="status" aria-live="polite" className="space-y-6">
            <div className="flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-primary" aria-hidden="true" />
                <p className="font-semibold">Analyzing this claim…</p>
            </div>

            <ul className="space-y-3">
                {steps.map((step, index) => (
                    <li key={step} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span
                            className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary/60"
                            style={{ animationDelay: `${index * 250}ms` }}
                            aria-hidden="true"
                        />
                        {step}
                    </li>
                ))}
            </ul>

            <div className="space-y-3 pt-2" aria-hidden="true">
                <div className="h-8 w-40 animate-pulse rounded-xl bg-muted" />
                <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded-lg bg-muted" />
            </div>
        </div>
    );
}

/** Reports predating this feature, and any report never sent for analysis. */
function NotAnalysedState({
    canRequest,
    isRequesting,
    onRun,
}: {
    canRequest: boolean;
    isRequesting: boolean;
    onRun: () => void;
}) {
    return (
        <div className="space-y-5">
            <div className="flex items-start gap-3">
                <HelpCircle size={20} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                    <p className="font-semibold">Not yet analyzed</p>
                    <p className="text-sm text-muted-foreground">
                        This report has not been checked by Horizon-Truth's AI analysis yet.
                    </p>
                </div>
            </div>

            <Button onClick={onRun} disabled={isRequesting} className="rounded-xl font-semibold">
                {isRequesting ? (
                    <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />
                ) : (
                    <Sparkles size={16} className="mr-2" aria-hidden="true" />
                )}
                Verify with AI
            </Button>

            {!canRequest && (
                <p className="text-xs text-muted-foreground">Sign in to request AI verification.</p>
            )}
        </div>
    );
}

/**
 * Failure is explicitly framed so nobody reads it as a problem with their
 * report — the submission is safe, only the AI step did not complete.
 */
function FailedState({
    canRequest,
    isRequesting,
    onRetry,
}: {
    canRequest: boolean;
    isRequesting: boolean;
    onRetry: () => void;
}) {
    return (
        <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-4">
                <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <div className="space-y-1">
                    <p className="font-semibold text-amber-700 dark:text-amber-300">
                        AI verification is temporarily unavailable.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        The community report was submitted successfully and is unaffected. Please try
                        verification again later.
                    </p>
                </div>
            </div>

            <Button
                variant="outline"
                onClick={onRetry}
                disabled={isRequesting}
                className="rounded-xl font-semibold"
            >
                {isRequesting ? (
                    <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />
                ) : (
                    <RefreshCw size={16} className="mr-2" aria-hidden="true" />
                )}
                Try again
            </Button>

            {!canRequest && (
                <p className="text-xs text-muted-foreground">Sign in to retry AI verification.</p>
            )}
        </div>
    );
}

function ResultState({
    verification,
    isReasoningOpen,
    onToggleReasoning,
    showMetadata,
}: {
    verification: AiVerification;
    isReasoningOpen: boolean;
    onToggleReasoning: () => void;
    showMetadata: boolean;
}) {
    const presentation = getVerdictPresentation(verification.verdict);
    const VerdictIcon = TONE_ICONS[presentation.tone];
    const confidence = getConfidenceLabel(verification.confidence);
    const sources = getRenderableSources(verification);
    const reasoning = verification.reasoning?.trim();
    // Long reasoning collapses; short reasoning is not worth a toggle.
    const isReasoningLong = (reasoning?.length ?? 0) > 420;

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Claim analyzed</p>
                <p className="text-base font-medium leading-relaxed break-words">{verification.claim}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div
                    className={cn(
                        "flex items-center gap-3 rounded-2xl border px-5 py-4",
                        presentation.className,
                    )}
                >
                    <VerdictIcon size={28} aria-hidden="true" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">AI verdict</p>
                        <p className="text-2xl font-extrabold leading-tight">{presentation.label}</p>
                    </div>
                </div>

                <div className="space-y-1">
                    {confidence && (
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Confidence:</span> {confidence}
                        </p>
                    )}
                    <p className="max-w-md text-sm text-muted-foreground">{presentation.meaning}</p>
                </div>
            </div>

            {reasoning && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        Why this verdict?
                    </h4>
                    <p
                        id="ai-verification-reasoning"
                        className={cn(
                            "text-[15px] leading-relaxed text-muted-foreground break-words",
                            isReasoningLong && !isReasoningOpen && "line-clamp-4",
                        )}
                    >
                        {reasoning}
                    </p>
                    {isReasoningLong && (
                        <button
                            type="button"
                            onClick={onToggleReasoning}
                            aria-expanded={isReasoningOpen}
                            aria-controls="ai-verification-reasoning"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                            {isReasoningOpen ? "Show less" : "Read full reasoning"}
                            <ChevronDown
                                size={16}
                                className={cn("transition-transform", isReasoningOpen && "rotate-180")}
                                aria-hidden="true"
                            />
                        </button>
                    )}
                </div>
            )}

            {verification.evidenceSummary?.trim() && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        Evidence summary
                    </h4>
                    <p className="rounded-2xl bg-muted/40 px-5 py-4 text-[15px] leading-relaxed break-words">
                        {verification.evidenceSummary}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Supporting sources
                </h4>

                {sources.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        The AI did not return any citable sources for this claim.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {sources.map((source, index) => {
                            const domain = getSourceDomain(source.url);
                            const relevance = formatRelevance(source.score);
                            const excerpt = toExcerpt(source.content);

                            return (
                                <li
                                    key={`${source.url}-${index}`}
                                    className="rounded-2xl border bg-background/60 p-4 transition-colors hover:border-primary/40 sm:p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0 space-y-1">
                                            <p className="font-semibold leading-snug break-words">{source.title}</p>
                                            {domain && (
                                                <p className="text-xs font-medium text-muted-foreground">{domain}</p>
                                            )}
                                        </div>
                                        {relevance && (
                                            <span className="shrink-0 rounded-full border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                                                Relevance: {relevance}
                                            </span>
                                        )}
                                    </div>

                                    {excerpt && (
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground break-words">
                                            {excerpt}
                                        </p>
                                    )}

                                    <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                                    >
                                        View source
                                        <ExternalLink size={14} aria-hidden="true" />
                                        <span className="sr-only">
                                            {`${source.title} (opens in a new tab)`}
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {showMetadata && <VerificationMetadata verification={verification} />}
        </div>
    );
}

/** Provenance for moderators: which service ran, when, and in what state. */
function VerificationMetadata({ verification }: { verification: AiVerification }) {
    const completed = verification.completedAt ?? verification.updatedAt;

    return (
        <dl className="grid gap-4 rounded-2xl border bg-muted/20 p-5 text-sm sm:grid-cols-3">
            <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</dt>
                <dd className="font-semibold">{verification.status}</dd>
            </div>
            <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Analyzed</dt>
                <dd className="font-semibold">{completed ? new Date(completed).toLocaleString() : "—"}</dd>
            </div>
            <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Provider</dt>
                <dd className="font-semibold break-words">{verification.provider ?? "—"}</dd>
            </div>
        </dl>
    );
}

/** Present in every state: the AI assists judgement, it does not replace it. */
function Disclaimer() {
    return (
        <footer className="flex items-start gap-3 border-t bg-muted/20 px-5 py-4 sm:px-8">
            <Info size={16} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">AI-assisted verification.</span>{" "}
                This assessment was generated using AI and supporting sources. Review the cited evidence
                and consider additional credible sources before reaching a conclusion.
            </p>
        </footer>
    );
}

export default AiVerificationCard;
