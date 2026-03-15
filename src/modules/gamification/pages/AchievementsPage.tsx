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
    const { stats, currentStreak, skillBook, calibration, dailyLedger, lifetimeImpact } = useGameStore();
    const [tab, setTab] = useState<'achievements' | 'allies'>('achievements');
    const [masteryTiers, setMasteryTiers] = useState<MasteryTier[]>([]);

    // Mastery tiers come from the player's scenario records.
    useEffect(() => {
        let cancelled = false;
        engineService.getScenarios({ isActive: true, page: 1, limit: 100 })
            .then(response => {
                if (cancelled) return;
                const data: Scenario[] = Array.isArray(response) ? response : (response.data || []);
                const tiers = data
                    .map(s => masteryFor(s.userRecord ? { ...s.userRecord, totalPossibleScore: s.totalPossibleScore } : null))
                    .filter((t): t is MasteryTier => !!t);
                setMasteryTiers(tiers);
            })
            .catch(() => { /* achievements that need mastery simply stay locked */ });
        return () => { cancelled = true; };
    }, []);

    const totals = useMemo(() => {
        const decisions = SKILLS.reduce((sum, s) => sum + (skillBook[s.key]?.total ?? 0), 0);
        const correct = SKILLS.reduce((sum, s) => sum + (skillBook[s.key]?.correct ?? 0), 0);
        return { decisions, overall: decisions > 0 ? Math.round((correct / decisions) * 100) : null };