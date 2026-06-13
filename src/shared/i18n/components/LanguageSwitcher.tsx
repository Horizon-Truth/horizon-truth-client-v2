import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "../useTranslation";
import type { LanguageCode } from "../languages";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import { cn } from "@/shared/lib/utils";

interface LanguageSwitcherProps {
    /** "menu" = full labelled list (settings); "compact" = inline buttons (navbar). */
    variant?: "menu" | "compact";
    className?: string;
}

/**
 * Language switcher used in settings and the navbar. Updates the persisted
 * client store immediately and, for authenticated users, persists the choice
 * to the server-side `preferredLanguage` so it follows the user across devices.
 */
export function LanguageSwitcher({
    variant = "menu",
    className,
}: LanguageSwitcherProps) {
    const { t, language, setLanguage, languages } = useTranslation();
    const { isAuthenticated, updateUser } = useAuthStore();
    const [saving, setSaving] = useState<LanguageCode | null>(null);

    const handleSelect = async (code: LanguageCode) => {
        if (code === language) return;
        setLanguage(code);

        if (isAuthenticated) {
            setSaving(code);
            try {
                await userService.updateProfile({ preferredLanguage: code });
                updateUser({ preferredLanguage: code } as any);
                toast.success(t("language.saved"));
            } catch {
                toast.error(t("common.save") + " — " + t("language.label"));
            } finally {
                setSaving(null);
            }
        }
    };

    if (variant === "compact") {
        return (
            <div className={cn("inline-flex items-center gap-1", className)}>
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelect(lang.code)}
                        aria-pressed={language === lang.code}
                        className={cn(
                            "rounded-md px-2 py-1 text-[11px] font-black uppercase tracking-widest transition-colors",
                            language === lang.code
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted",
                        )}
                        title={lang.englishName}
                    >
                        {lang.short}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Globe size={12} /> {t("language.switcher")}
            </div>
            <div className="grid gap-2">
                {languages.map((lang) => {
                    const active = language === lang.code;
                    return (
                        <button
                            key={lang.code}
                            type="button"
                            disabled={saving !== null}
                            onClick={() => handleSelect(lang.code)}
                            className={cn(
                                "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                                active
                                    ? "border-primary bg-primary/5"
                                    : "border-border/50 hover:border-primary/40 hover:bg-muted/30",
                            )}
                        >
                            <span className="flex flex-col">
                                <span className="text-sm font-bold">
                                    {lang.nativeName}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    {lang.englishName}
                                </span>
                            </span>
                            {active && <Check size={16} className="text-primary" />}
                            {saving === lang.code && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                            )}
                        </button>
                    );
                })}
            </div>
            <p className="text-[11px] text-muted-foreground">
                {t("settings.languageHint")}
            </p>
        </div>
    );
}
