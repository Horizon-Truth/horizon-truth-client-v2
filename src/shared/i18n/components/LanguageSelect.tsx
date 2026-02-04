import { forwardRef } from "react";
import { SUPPORTED_LANGUAGES } from "../languages";
import { cn } from "@/shared/lib/utils";

/**
 * Native <select> of supported content languages for use inside content
 * creation/editing forms. Renders the full supported-language list so the set