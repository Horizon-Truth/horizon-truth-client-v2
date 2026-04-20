import { Languages } from "lucide-react";
import {
    getLanguageDescriptor,
    normalizeLanguage,
    type LanguageCode,
} from "../languages";
import { cn } from "@/shared/lib/utils";

/**
 * Compact, read-only indicator of a content item's language. Used in admin
 * tables and management cards so the language of every row is always visible.
 */
export function LanguageBadge({
    language,
    className,
    showIcon = true,
}: {
    language: string | LanguageCode | null | undefined;
    className?: string;
    showIcon?: boolean;
}) {
    const descriptor = getLanguageDescriptor(normalizeLanguage(language));

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary",
                className,
            )}
            title={descriptor.englishName}
        >
            {showIcon && <Languages size={10} />}
            {descriptor.short}
        </span>
    );
}
