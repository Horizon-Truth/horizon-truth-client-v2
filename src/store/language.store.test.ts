import { describe, it, expect, beforeEach } from 'vitest';
import { useLanguageStore, getCurrentLanguage } from './language.store';
import { ContentLanguage, DEFAULT_LANGUAGE } from '@/shared/i18n/languages';

describe('LanguageStore', () => {
    beforeEach(() => {
        useLanguageStore.getState().setLanguage(DEFAULT_LANGUAGE);
    });

    it('defaults to English', () => {
        expect(useLanguageStore.getState().language).toBe(ContentLanguage.ENGLISH);
    });

    it('switches language and persists it to the store', () => {
        useLanguageStore.getState().setLanguage(ContentLanguage.AMHARIC);
        expect(useLanguageStore.getState().language).toBe(ContentLanguage.AMHARIC);
        expect(getCurrentLanguage()).toBe(ContentLanguage.AMHARIC);
    });

    it('normalizes unsupported languages back to the default', () => {
        // @ts-expect-error intentionally passing an invalid code
        useLanguageStore.getState().setLanguage('fr');
        expect(useLanguageStore.getState().language).toBe(DEFAULT_LANGUAGE);
    });

    it('reflects the choice on the document element', () => {
        useLanguageStore.getState().setLanguage(ContentLanguage.AFAAN_OROMO);
        expect(document.documentElement.lang).toBe(ContentLanguage.AFAAN_OROMO);
    });
});
