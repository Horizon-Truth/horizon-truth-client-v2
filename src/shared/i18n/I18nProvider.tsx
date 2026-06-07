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