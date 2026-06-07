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