import type { AiVerification, AiVerificationSource } from "@/services/ai-verification.service";

/**
 * Pure presentation rules for AI verification results.
 *
 * Kept out of the component so the trust-critical decisions — how a verdict is
 * labelled, what counts as a safe link, when a relevance score may be shown —
 * can be tested directly.
 */

export type VerdictTone = "positive" | "negative" | "caution" | "neutral";

export interface VerdictPresentation {
    /** Human label. Never "Truth" — the AI assesses, it does not adjudicate. */
    label: string;
    tone: VerdictTone;
    /** One line of plain-language meaning, so the tone is never the only signal. */
    meaning: string;
    /** Tailwind classes for the verdict block. */
    className: string;
    /** Classes for the small tone dot / icon wrapper. */
    accentClassName: string;
}

const TONE_STYLES: Record<VerdictTone, { className: string; accentClassName: string }> = {
    positive: {
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        accentClassName: "bg-emerald-500",
    },
    negative: {
        className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
        accentClassName: "bg-red-500",
    },
    caution: {
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        accentClassName: "bg-amber-500",
    },
    neutral: {
        className: "bg-muted text-muted-foreground border-border",
        accentClassName: "bg-muted-foreground",
    },
};

const KNOWN_VERDICTS: Record<string, { label: string; tone: VerdictTone; meaning: string }> = {
    TRUE: {
        label: "True",
        tone: "positive",
        meaning: "The AI found credible sources supporting this claim.",
    },
    FALSE: {
        label: "False",
        tone: "negative",
        meaning: "The AI found credible sources contradicting this claim.",
    },
    MIXED: {
        label: "Mixed",
        tone: "caution",
        meaning: "The AI found the claim partly supported and partly contradicted.",
    },
    UNVERIFIED: {
        label: "Unverified",
        tone: "neutral",
        meaning: "The AI did not find enough evidence to assess this claim.",
    },
};

/**
 * Maps a verdict onto its presentation. Unknown verdicts (the API may add
 * some) render neutrally with their own label rather than being forced into
 * TRUE/FALSE.
 */
export function getVerdictPresentation(verdict: string | undefined | null): VerdictPresentation {
    const key = (verdict ?? "").trim().toUpperCase();
    const known = KNOWN_VERDICTS[key];

    if (known) {
        return { ...known, ...TONE_STYLES[known.tone] };
    }

    if (!key) {
        return {
            ...KNOWN_VERDICTS.UNVERIFIED,
            ...TONE_STYLES.neutral,
        };
    }

    return {
        label: toTitleCase(key.replace(/_/g, " ")),
        tone: "neutral",
        meaning: "The AI returned an assessment outside the standard set. Review the evidence below.",
        ...TONE_STYLES.neutral,
    };
}

function toTitleCase(value: string): string {
    return value
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/** Confidence is a label from the API; never derive a percentage from it. */
export function getConfidenceLabel(confidence: string | undefined | null): string | null {
    const trimmed = (confidence ?? "").trim();
    if (!trimmed) return null;
    return toTitleCase(trimmed);
}

/**
 * Site name for a source link. Falls back to the raw value only when it cannot
 * be parsed, and never throws on malformed input.
 */
export function getSourceDomain(url: string | undefined | null): string {
    if (!url) return "";
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
}

/**
 * Guards every link we render: the AI response is untrusted input, so only
 * http(s) URLs become anchors — a javascript: or data: URL is dropped.
 */
export function isSafeExternalUrl(url: string | undefined | null): boolean {
    if (!url) return false;
    try {
        const { protocol } = new URL(url);
        return protocol === "http:" || protocol === "https:";
    } catch {
        return false;
    }
}

/** Relevance as a whole percentage, or null when the API gave no score. */
export function formatRelevance(score: number | undefined | null): string | null {
    if (typeof score !== "number" || !Number.isFinite(score)) return null;
    const clamped = Math.min(Math.max(score, 0), 1);
    return `${Math.round(clamped * 100)}%`;
}

/** Short excerpt for a source; the full `content` is never dumped into the UI. */
export function toExcerpt(content: string | undefined | null, maxLength = 180): string | null {
    const trimmed = (content ?? "").replace(/\s+/g, " ").trim();
    if (!trimmed) return null;
    if (trimmed.length <= maxLength) return trimmed;

    const clipped = trimmed.slice(0, maxLength);
    const lastSpace = clipped.lastIndexOf(" ");
    return `${(lastSpace > maxLength * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

/** Drops sources we cannot safely link to before anything renders them. */
export function getRenderableSources(verification: AiVerification | null | undefined): AiVerificationSource[] {
    if (!verification?.sources?.length) return [];
    return verification.sources.filter((source) => isSafeExternalUrl(source?.url));
}

/**
 * The five states the card renders. Derived in one place so the component never
 * has to guess what a missing record means.
 */
export type AiVerificationView = "none" | "loading" | "result" | "failed";

export function getVerificationView(verification: AiVerification | null | undefined): AiVerificationView {
    if (!verification) return "none";
    if (verification.status === "PENDING" || verification.status === "PROCESSING") return "loading";
    if (verification.status === "FAILED") return "failed";
    return "result";
}
