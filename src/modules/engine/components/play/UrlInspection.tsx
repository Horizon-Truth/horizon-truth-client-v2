import React, { memo, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock, Unlock, ChevronDown, AlertTriangle, CheckCircle2, Search, Globe } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { cn } from '@/shared/lib/utils';
import { useGameStore } from '@/store/game.store';
import { telemetryService } from '@/services/telemetry.service';

/**
 * Phase 10 challenge — URL inspection.
 *
 * Renders a suspicious link as a fake browser window whose address bar can be
 * dissected: clicking the host reveals its anatomy (subdomain / domain / TLD),
 * and an investigator toolkit lists expandable clues. The scene's choices are
 * rendered by GameSession as usual, so this component is pure investigation.
 *
 * scene.content contract:
 * {
 *   url: string,                 // the link under investigation
 *   pageTitle?: string,          // what the landing page claims
 *   pageSnippet?: string,        // first lines of the landing page
 *   prompt?: string,             // investigator question shown at top
 *   clues?: { label: string; detail: string; suspicious?: boolean }[]