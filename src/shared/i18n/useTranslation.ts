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