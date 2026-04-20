import { useEffect, type ReactNode } from 'react';
import { useLanguageStore } from '@/store/language.store';
import { useAuthStore } from '@/store/auth.store';
import { normalizeLanguage } from './languages';

/**
 * Lightweight i18n bootstrap. Keeps `<html lang>` in sync with the selected