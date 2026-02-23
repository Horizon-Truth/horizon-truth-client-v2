import React, { memo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, ChevronDown, Scale, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { useGameStore } from '@/store/game.store';
import { telemetryService } from '@/services/telemetry.service';

/**
 * Phase 10 challenge — source comparison.
 *
 * The same event as reported by several sources, side by side. Each card can
 * be examined for credibility signals before the player answers via the
 * scene's normal choices (rendered by GameSession). Examinations are tracked
 * as verification telemetry.
 *
 * scene.content contract: