import { memo, useEffect, useMemo, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { CalendarDays, CheckCircle2, Circle, Play, Loader2, Flame, PartyPopper } from 'lucide-react';
import { engineService } from '@/services/engine.service';
import type { Scenario } from '@/services/engine.service';
import { useGameStore } from '@/store/game.store';
import { ensureToday, DAILY_QUESTS, questDone, allQuestsDone, dailyScenario, todayKey } from '../daily';

/**
 * Phase 14 — "Today's briefing" on the mission hub: a date-seeded mission of
 * the day plus daily quests whose progress the game store tracks. Quests
 * reset at local midnight and reinforce the streak loop.
 */
export const DailyBriefing = memo(function DailyBriefing() {
    const dailyLedger = useGameStore(s => s.dailyLedger);
    const currentStreak = useGameStore(s => s.currentStreak);
    const startGame = useGameStore(s => s.startGame);
    const loadProgress = useGameStore(s => s.loadProgress);
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [starting, setStarting] = useState(false);

    // One lightweight fetch for the deterministic daily pick.
    useEffect(() => {
        let cancelled = false;