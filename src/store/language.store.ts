import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    DEFAULT_LANGUAGE,
    normalizeLanguage,
    type LanguageCode,
} from '@/shared/i18n/languages';

interface LanguageState {
    /** Currently selected display/content language. */
    language: LanguageCode;
    /** Set the active language (persisted across sessions). */
    setLanguage: (lang: LanguageCode) => void;
}

/**
 * Persisted store for the user's selected language. Survives reloads via
 * localStorage and is the single client-side source of truth that the API
 * layer reads to scope all content requests to one language.
 */
export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: DEFAULT_LANGUAGE,
            setLanguage: (lang) => {
                const normalized = normalizeLanguage(lang);
                if (typeof document !== 'undefined') {
                    document.documentElement.lang = normalized;
                }
                set({ language: normalized });
            },
        }),
        {
            name: 'horizon-language',
            partialize: (state) => ({ language: state.language }),
        },
    ),
);

/** Non-reactive accessor for use outside React (e.g. axios interceptors). */
export const getCurrentLanguage = (): LanguageCode =>
    normalizeLanguage(useLanguageStore.getState().language);
