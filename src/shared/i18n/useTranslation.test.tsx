import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation } from './useTranslation';
import { useLanguageStore } from '@/store/language.store';
import { ContentLanguage, DEFAULT_LANGUAGE } from './languages';