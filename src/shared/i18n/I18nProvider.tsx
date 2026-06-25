import { useEffect, type ReactNode } from 'react';
import { useLanguageStore } from '@/store/language.store';
import { useAuthStore } from '@/store/auth.store';
import { normalizeLanguage } from './languages';

/**
 * Lightweight i18n bootstrap. Keeps `<html lang>` in sync with the selected
 * language and, on login, seeds the language from the authenticated user's
 * persisted `preferredLanguage` preference (only when the user hasn't already
 * chosen one this session is implicit — we always honor the server preference
 * on auth so the choice persists across devices).
 */
export function I18nProvider({ children }: { children: ReactNode }) {
    const language = useLanguageStore((s) => s.language);
    const setLanguage = useLanguageStore((s) => s.setLanguage);
    const user = useAuthStore((s) => s.user);

    // Seed from the server-side user preference when available.
    useEffect(() => {
        const pref = (user as { preferredLanguage?: string } | null)
            ?.preferredLanguage;
        if (pref) {
            setLanguage(normalizeLanguage(pref));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    // Keep the document language attribute accurate for a11y / fonts.
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return <>{children}</>;
}
