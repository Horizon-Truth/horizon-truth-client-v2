import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation } from './useTranslation';
import { useLanguageStore } from '@/store/language.store';
import { ContentLanguage, DEFAULT_LANGUAGE } from './languages';

describe('useTranslation', () => {
    beforeEach(() => {
        useLanguageStore.getState().setLanguage(DEFAULT_LANGUAGE);
    });

    it('returns English strings by default', () => {
        const { result } = renderHook(() => useTranslation());
        expect(result.current.t('common.save')).toBe('Save');
        expect(result.current.language).toBe(ContentLanguage.ENGLISH);
    });

    it('returns translated strings after switching language', () => {
        const { result } = renderHook(() => useTranslation());
        act(() => result.current.setLanguage(ContentLanguage.AMHARIC));
        expect(result.current.t('common.save')).toBe('አስቀምጥ');
    });

    it('falls back to English for keys missing in the active language', () => {
        const { result } = renderHook(() => useTranslation());
        act(() => result.current.setLanguage(ContentLanguage.AFAAN_OROMO));
        // scenario.title exists in en; if a key were missing it should fall back.
        expect(result.current.t('scenario.title')).toBe('Mata-duree');
        // A key only present in English still resolves rather than echoing the key.
        expect(result.current.t('settings.title')).not.toBe('settings.title');
    });

    it('returns the key (or provided fallback) for unknown keys', () => {
        const { result } = renderHook(() => useTranslation());
        expect(result.current.t('does.not.exist')).toBe('does.not.exist');
        expect(result.current.t('does.not.exist', 'Fallback')).toBe('Fallback');
    });

    it('exposes all supported languages for switchers', () => {
        const { result } = renderHook(() => useTranslation());
        expect(result.current.languages.map((l) => l.code)).toEqual([
            'en',
            'am',
            'om',
        ]);
    });
});
