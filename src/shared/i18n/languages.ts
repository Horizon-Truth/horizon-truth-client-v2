/**
 * Centralized language configuration for the frontend.
 *
 * Mirrors the backend `ContentLanguage` enum. This is the single source of
 * truth for the languages the UI knows about — switchers, dropdowns and badges
 * all read from `SUPPORTED_LANGUAGES`, so adding a language is a one-place
 * change here (plus a translation dictionary).
 */
export const ContentLanguage = {
  ENGLISH: 'en',
  AMHARIC: 'am',
  AFAAN_OROMO: 'om',
} as const;

export type LanguageCode =
  (typeof ContentLanguage)[keyof typeof ContentLanguage];

export const DEFAULT_LANGUAGE: LanguageCode = ContentLanguage.ENGLISH;

export interface LanguageDescriptor {
  code: LanguageCode;
  /** Display name in English (admin tooling / fallbacks). */
  englishName: string;
  /** Display name in its own script (public switcher). */
  nativeName: string;
  /** Short 2-letter label for compact badges. */
  short: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageDescriptor[] = [
  {
    code: ContentLanguage.ENGLISH,
    englishName: 'English',
    nativeName: 'English',
    short: 'EN',
  },
  {
    code: ContentLanguage.AMHARIC,
    englishName: 'Amharic',
    nativeName: 'አማርኛ',
    short: 'አማ',
  },
  {
    code: ContentLanguage.AFAAN_OROMO,
    englishName: 'Afaan Oromo',
    nativeName: 'Afaan Oromoo',
    short: 'OM',
  },
] as const;

export const SUPPORTED_LANGUAGE_CODES: readonly LanguageCode[] =
  SUPPORTED_LANGUAGES.map((l) => l.code);

export function isSupportedLanguage(value: unknown): value is LanguageCode {
  return (
    typeof value === 'string' &&
    SUPPORTED_LANGUAGE_CODES.includes(value as LanguageCode)
  );
}

export function normalizeLanguage(value: unknown): LanguageCode {
  return isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE;
}

export function getLanguageDescriptor(code: LanguageCode): LanguageDescriptor {
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[0]
  );
}
