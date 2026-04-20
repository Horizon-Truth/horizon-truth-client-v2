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