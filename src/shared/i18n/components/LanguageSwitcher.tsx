import { useEffect, useRef, useState } from "react";
import { Check, Globe, ChevronDown } from "lucide-react";
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
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const current =
        languages.find((l) => l.code === language) ?? languages[0];

    // Close the compact dropdown when clicking outside or pressing Escape.
    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const handleSelect = async (code: LanguageCode) => {
        setOpen(false);
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
            <div ref={menuRef} className={cn("relative", className)}>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    title={t("language.switcher")}
                    className={cn(
                        "inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 transition-colors cursor-pointer",
                        "hover:bg-black/5 dark:hover:bg-white/10",
                        open && "bg-black/5 dark:bg-white/10",
                    )}
                >
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                        {current.short}
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-3.5 w-3.5 text-muted-foreground transition-transform",
                            open && "rotate-180",
                        )}
                    />
                </button>

                {open && (
                    <div
                        role="listbox"
                        className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg"
                    >
                        {languages.map((lang) => {
                            const active = language === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    disabled={saving !== null}
                                    onClick={() => handleSelect(lang.code)}
                                    className={cn(
                                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                                        active
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "hover:bg-muted",
                                    )}
                                >
                                    <span className="flex flex-col">
                                        <span>{lang.nativeName}</span>
                                        <span className="text-[11px] text-muted-foreground">
                                            {lang.englishName}
                                        </span>
                                    </span>
                                    {saving === lang.code ? (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                                    ) : (
                                        active && (
                                            <Check
                                                size={16}
                                                className="text-primary shrink-0"
                                            />
                                        )
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
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
