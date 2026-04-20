import { forwardRef } from "react";
import { SUPPORTED_LANGUAGES } from "../languages";
import { cn } from "@/shared/lib/utils";

/**
 * Native <select> of supported content languages for use inside content
 * creation/editing forms. Renders the full supported-language list so the set
 * stays in sync everywhere. The empty option keeps "no selection" invalid so
 * validation can force an explicit choice.
 */
export const LanguageSelect = forwardRef<
    HTMLSelectElement,
    React.SelectHTMLAttributes<HTMLSelectElement> & { includeEmpty?: boolean }
>(({ className, includeEmpty = true, ...props }, ref) => {
    return (
        <select
            ref={ref}
            className={cn(
                "w-full h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary px-3 text-sm appearance-none",
                className,
            )}
            {...props}
        >
            {includeEmpty && <option value="">Select a language…</option>}
            {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.englishName} ({lang.nativeName})
                </option>
            ))}
        </select>
    );
});

LanguageSelect.displayName = "LanguageSelect";
