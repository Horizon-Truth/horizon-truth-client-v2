import { useEffect, useRef, useState } from "react";
import { Check, Globe, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "../useTranslation";
import type { LanguageCode } from "../languages";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import { cn } from "@/shared/lib/utils";

interface LanguageSwitcherProps {
    /** "menu" = full labelled list (settings); "compact" = inline buttons (navbar). */
    variant?: "menu" | "compact";
    className?: string;
}

/**
 * Language switcher used in settings and the navbar. Updates the persisted
 * client store immediately and, for authenticated users, persists the choice
 * to the server-side `preferredLanguage` so it follows the user across devices.