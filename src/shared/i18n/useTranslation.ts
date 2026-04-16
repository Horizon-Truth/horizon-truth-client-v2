import { useCallback } from 'react';
import { useLanguageStore } from '@/store/language.store';
import {
    SUPPORTED_LANGUAGES,
    type LanguageCode,
} from './languages';
import { translations } from './translations';
import { en } from './translations/en';

/** Resolve a dot-path (e.g. "content.language") against a dictionary object. */