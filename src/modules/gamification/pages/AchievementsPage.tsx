import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Trophy, Users, Lock, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '@/store/game.store';
import { engineService } from '@/services/engine.service';
import type { Scenario } from '@/services/engine.service';
import { evaluateAll, ACHIEVEMENT_CATEGORIES } from '../achievements';
import type { AchievementCategory, EvaluatedAchievement } from '../achievements';
import { masteryFor } from '../mastery';
import type { MasteryTier } from '../mastery';
import { castState, DISPOSITIONS, OPINION_THRESHOLD } from '../characters';
import { SKILLS } from '../skills';
import { ensureToday } from '../daily';

/**
 * Phase 13 + 11 — the player's trophy case and the people who notice.
 * Everything shown is derived from tracked play data; nothing is minted here.
 */
export default function AchievementsPage() {
    const navigate = useNavigate();