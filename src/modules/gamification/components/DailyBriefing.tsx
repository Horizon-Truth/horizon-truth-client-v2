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
        engineService.getScenarios({ isActive: true, page: 1, limit: 50 })
            .then(response => {
                if (cancelled) return;
                const data = Array.isArray(response) ? response : (response.data || []);
                setScenarios(data);
            })
            .catch(() => { /* briefing degrades to quests only */ });
        return () => { cancelled = true; };
    }, []);

    const ledger = ensureToday(dailyLedger);
    const featured = useMemo(() => dailyScenario(scenarios, todayKey()), [scenarios]);
    const swept = allQuestsDone(ledger);

    const handlePlay = async () => {
        if (!featured) return;
        setStarting(true);
        try {
            if (featured.activeProgressId) {
                await loadProgress(featured.activeProgressId);
            } else {
                await startGame(featured.id);
            }
        } finally {
            setStarting(false);
        }
    };

    return (
        <section
            aria-label="Today's briefing"
            className="border border-border rounded-3xl p-6 bg-card shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-700"
        >
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-primary" aria-hidden />
                    <h2 className="font-black text-xs tracking-widest uppercase">Today's briefing</h2>
                </div>
                {currentStreak > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-bold">
                        <Flame size={11} aria-hidden /> {currentStreak}-day streak
                    </span>
                )}
            </div>

            {/* Mission of the day */}
            {featured && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-border bg-muted/40 p-4">
                    <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mission of the day</p>
                        <p className="font-bold text-sm leading-snug truncate">{featured.title}</p>
                    </div>
                    <Button
                        onClick={handlePlay}
                        disabled={starting}
                        size="sm"
                        className="h-10 px-5 rounded-xl font-bold shrink-0 active:scale-95 transition-all"
                    >
                        {starting
                            ? <Loader2 size={14} className="animate-spin mr-2" aria-hidden />
                            : <Play size={14} className="mr-2" aria-hidden />}
                        {featured.activeProgressId ? 'Resume' : 'Play'}
                    </Button>
                </div>
            )}

            {/* Daily quests */}
            <ul className="space-y-2.5" aria-label="Daily quests">
                {DAILY_QUESTS.map(quest => {
                    const done = questDone(quest, ledger);
                    const progress = Math.min(quest.target, quest.progress(ledger));
                    return (
                        <li key={quest.key} className="flex items-center gap-3">
                            {done
                                ? <CheckCircle2 size={17} className="text-emerald-500 shrink-0" aria-hidden />
                                : <Circle size={17} className="text-muted-foreground/50 shrink-0" aria-hidden />}
                            <span className={cn('text-sm font-semibold flex-1 min-w-0', done && 'text-muted-foreground line-through decoration-emerald-500/50')}>
                                {quest.label}
                            </span>
                            <span className={cn('text-xs font-black tabular-nums', done ? 'text-emerald-500' : 'text-muted-foreground')}>
                                {progress}/{quest.target}
                            </span>
                        </li>
                    );
                })}
            </ul>

            {swept && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3" role="status">
                    <PartyPopper size={16} className="text-emerald-500 shrink-0" aria-hidden />
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        Daily sweep — every quest cleared. Come back tomorrow to keep the streak alive.
                    </p>
                </div>
            )}
        </section>
    );
});
