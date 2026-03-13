import { forwardRef } from "react";
import { SUPPORTED_LANGUAGES } from "../languages";
import { cn } from "@/shared/lib/utils";

/**
 * Native <select> of supported content languages for use inside content
 * creation/editing forms. Renders the full supported-language list so the set
 * stays in sync everywhere. The empty option keeps "no selection" invalid so
 * validation can force an explicit choice.
 */
export const LanguageSelect = forwardRef<