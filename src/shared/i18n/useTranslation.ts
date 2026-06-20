import { useCallback } from 'react';
import { useLanguageStore } from '@/store/language.store';
import {
    SUPPORTED_LANGUAGES,
    type LanguageCode,
} from './languages';
import { translations } from './translations';
import { en } from './translations/en';

/** Resolve a dot-path (e.g. "content.language") against a dictionary object. */
function resolve(dict: unknown, path: string): string | undefined {
    return path.split('.').reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object' && key in acc) {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, dict) as string | undefined;
}

export type TranslateFn = (key: string, fallback?: string) => string;

/**
 * Primary localization hook. Returns the active language, a setter, the list of
 * supported languages, and a `t()` function that looks up a key in the active
 * language and falls back to English (then to the key itself).
 */
export function useTranslation() {
    const language = useLanguageStore((s) => s.language);
    const setLanguage = useLanguageStore((s) => s.setLanguage);

    const t = useCallback<TranslateFn>(
        (key, fallback) => {
            const active = resolve(translations[language as LanguageCode], key);
            if (active !== undefined) return active;
            const english = resolve(en, key);
            if (english !== undefined) return english;
            return fallback ?? key;
        },
        [language],
    );

    return {
        t,
        language: language as LanguageCode,
        setLanguage,
        languages: SUPPORTED_LANGUAGES,
    };
}
