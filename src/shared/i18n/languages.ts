/**
 * Centralized language configuration for the frontend.
 *
 * Mirrors the backend `ContentLanguage` enum. This is the single source of
 * truth for the languages the UI knows about — switchers, dropdowns and badges
 * all read from `SUPPORTED_LANGUAGES`, so adding a language is a one-place
 * change here (plus a translation dictionary).