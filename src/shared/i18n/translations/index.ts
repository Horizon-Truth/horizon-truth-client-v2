import type { LanguageCode } from '../languages';
import type { DeepPartial } from '../types';
import { en, type TranslationDict } from './en';
import { am } from './am';
import { om } from './om';

/**
 * Registry of all translation dictionaries keyed by language code.
 * English is complete; others are partial and fall back to English.
 */
export const translations: Record<LanguageCode, DeepPartial<TranslationDict>> = {
  en,
  am,
  om,
};

export { en };
export type { TranslationDict };
