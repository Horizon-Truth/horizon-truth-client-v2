import { describe, it, expect, beforeEach } from 'vitest';
import { useLanguageStore, getCurrentLanguage } from './language.store';
import { ContentLanguage, DEFAULT_LANGUAGE } from '@/shared/i18n/languages';