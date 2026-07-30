import { useEffect, useState, useRef, useCallback, useMemo, Fragment } from 'react';
import type { Scenario } from '@/services/engine.service';
import { engineService } from '@/services/engine.service';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Play, Loader2, Info, Trophy, Lock, Star, ChevronUp, Compass, Sparkles, BookMarked } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ScenarioSkeleton } from './play/ImmersiveSkeleton';
import { masteryFor, nextMasteryGoal } from '@/modules/gamification/mastery';
import { recommendScenario } from '@/modules/gamification/recommendation';
import { campaignTitle, campaignWorldState } from '@/modules/gamification/campaigns';
import type { CampaignWorldState } from '@/modules/gamification/campaigns';

export function ScenarioList({ onStartGame }: { onStartGame?: (scenario: Scenario) => void, guestMode?: boolean }) {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);
    const [loadingScenarioId, setLoadingScenarioId] = useState<string | null>(null);
    const gameStore = useGameStore();
    const skillBook = useGameStore(s => s.skillBook);
    const observer = useRef<IntersectionObserver | null>(null);

    // Adaptive pick (Phase 9): trains the weakest skill / covers new ground.
    // Guest mode has no skill history, so recommendations stay generic there.
    const recommendation = useMemo(
        () => recommendScenario(scenarios, skillBook),
        [scenarios, skillBook]
    );

    // Campaign arcs (Phase 3): chapter numbering + world state per campaignTag.
    const campaignMeta = useMemo(() => {
        const byTag = new Map<string, Scenario[]>();
        for (const s of scenarios) {
            if (s.campaignTag) byTag.set(s.campaignTag, [...(byTag.get(s.campaignTag) ?? []), s]);
        }
        const meta = new Map<string, { title: string; chapter: number; total: number; isArcStart: boolean; state: CampaignWorldState }>();
        const seen = new Map<string, number>();
        for (const s of scenarios) {
            if (!s.campaignTag) continue;
            const chapter = (seen.get(s.campaignTag) ?? 0) + 1;
            seen.set(s.campaignTag, chapter);
            meta.set(s.id, {
                title: campaignTitle(s.campaignTag),
                chapter,
                total: byTag.get(s.campaignTag)!.length,
                isArcStart: chapter === 1,
                state: campaignWorldState(byTag.get(s.campaignTag)!),
            });
        }
        return meta;
    }, [scenarios]);

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loadingMore || !hasMore) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loadingMore, hasMore]);

    const fetchScenarios = useCallback(async (pageNum: number) => {
        if (pageNum > 1) setLoadingMore(true);
        try {
            const response = await engineService.getScenarios({
                isActive: true,
                page: pageNum,
                limit: 10
            } as any);

            const newData = Array.isArray(response) ? response : (response.data || []);
            const totalCount = response.total || newData.length;

            setScenarios(prev => {
                const combined = [...prev, ...newData];
                // De-duplicate just in case
                const deduped = Array.from(new Map(combined.map(item => [item.id, item])).values());
                setHasMore(deduped.length < totalCount);
                return deduped;
            });
        } catch (err) {
            console.error('Failed to fetch scenarios', err);
            setHasMore(false);
        } finally {
            if (pageNum === 1) {
                setLocalLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchScenarios(page);
    }, [page]);

    const handleStartGame = async (scenario: Scenario) => {
        setLoadingScenarioId(scenario.id);
        try {
            if (onStartGame) {
                await onStartGame(scenario);
            } else {
                await gameStore.startGame(scenario.id);
            }
        } finally {
            setLoadingScenarioId(null);
        }
    };

    if (localLoading && page === 1) {
        return (
            <div className="flex flex-col gap-6">
                <div className="space-y-2 opacity-40">
                    <h2 className="text-3xl font-extrabold tracking-tight">Learning Path</h2>
                    <p className="text-lg">Loading your missions...</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ScenarioSkeleton />
                    <ScenarioSkeleton />
                    <ScenarioSkeleton />
                </div>
            </div>
        );
    }

    if (scenarios.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center text-muted-foreground mb-2">
                    <Info size={40} aria-hidden />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">No missions yet</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        New missions are on the way. Check back soon — misinformation never sleeps, and neither do we.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 overflow-x-hidden">
            <div className="space-y-2 mb-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Learning Path</h2>
                <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                    Each mission teaches you a new way misinformation works — and how to beat it.
                </p>
            </div>

            {/* Adaptive recommendation (Phase 9) */}
            {recommendation && (
                <section
                    aria-label="Recommended mission"
                    className="max-w-3xl mx-auto w-full rounded-3xl border border-primary/25 bg-primary/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500"
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <Compass size={22} aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                            {recommendation.resume ? 'Continue your mission' : 'Recommended next'}
                        </p>
                        <h3 className="font-black tracking-tight leading-snug truncate">{recommendation.scenario.title}</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {recommendation.reasons.slice(0, 3).map((reason, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-card border border-border text-[11px] font-semibold text-muted-foreground">
                                    <Sparkles size={10} className="text-primary shrink-0" aria-hidden />
                                    {reason}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            if (recommendation.scenario.activeProgressId) {
                                gameStore.loadProgress(recommendation.scenario.activeProgressId);
                            } else {
                                handleStartGame(recommendation.scenario);
                            }
                        }}
                        disabled={loadingScenarioId !== null}
                        className="h-11 px-6 rounded-xl font-bold shrink-0 bg-primary text-white shadow-lg shadow-primary/25 active:scale-95 transition-all"
                    >
                        {loadingScenarioId === recommendation.scenario.id
                            ? <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden />
                            : <Play size={16} className="mr-2" aria-hidden />}
                        {recommendation.resume ? 'Resume' : 'Start'}
                    </Button>
                </section>
            )}

            <div className="relative max-w-3xl mx-auto w-full py-8 text-left">
                {/* Continuous Central connecting line on the left (Desktop only) */}
                <div className="absolute left-[3rem] top-12 bottom-[120px] w-2 bg-foreground/10 rounded-full hidden sm:block overflow-hidden z-0">
                </div>

                <div className="flex flex-col gap-10 relative z-10 w-full">
                    {scenarios.map((scenario, index) => {
                        const isLocked = scenario.lockStatus === 'LOCKED';
                        const accuracy = scenario.userRecord?.bestAccuracyRate ?? 0;
                        const hasPlayed = (scenario.userRecord?.attempts || 0) > 0;
                        const prereqScenario = scenario.unlockScenarioId ? scenarios.find(s => s.id === scenario.unlockScenarioId) : null;
                        const masteryRecord = scenario.userRecord
                            ? { ...scenario.userRecord, totalPossibleScore: scenario.totalPossibleScore }
                            : null;
                        const mastery = masteryFor(masteryRecord);
                        const masteryGoal = !isLocked && hasPlayed ? nextMasteryGoal(masteryRecord) : null;

                        const isLast = index === scenarios.length - 1;
                        const arc = campaignMeta.get(scenario.id);

                        return (
                            <Fragment key={scenario.id}>
                            {arc?.isArcStart && <CampaignHeader title={arc.title} state={arc.state} />}
                            <div
                                ref={isLast ? lastElementRef : null}
                                className="relative flex flex-col sm:flex-row items-center sm:items-stretch gap-6 w-full"
                            >

                                {/* Node Container - Left aligned on desktop */}
                                <div className="relative w-20 sm:w-24 shrink-0 flex items-center justify-center z-20">
                                    {/* Connecting Line Segment for mobile */}
                                    {!isLast && (
                                        <div className="absolute top-[90px] bottom-[-2.5rem] left-1/2 w-2 bg-foreground/10 -translate-x-1/2 sm:hidden rounded-full z-0" />
                                    )}

                                    <div className="relative group rounded-full p-2">
                                        {/* SVG Progress Ring */}
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                                            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className={isLocked ? "text-foreground/5" : "text-foreground/10"} />
                                            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8"
                                                strokeDasharray={`${accuracy * 2.89} 289`}
                                                className={cn(
                                                    "transition-all duration-1000 ease-out",
                                                    isLocked ? "text-transparent" :
                                                        accuracy === 100 ? "text-emerald-500 shadow-emerald-500" :
                                                            accuracy > 0 ? "text-primary shadow-primary" : "text-transparent"
                                                )}
                                                strokeLinecap="round" />
                                        </svg>

                                        {/* Central Filled Button (The "Coin") */}
                                        <div className={cn(
                                            "w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 relative border-[3px]",
                                            isLocked ? "bg-gray-800 border-gray-700 text-gray-500 shadow-[0_6px_0_rgb(55,65,81)]" :
                                                accuracy === 100 ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_6px_0_rgb(4,120,87)]" :
                                                    "bg-[#58cc02] border-[#79e028] text-white shadow-[0_6px_0_rgb(88,167,0)]"
                                        )}>
                                            {!isLocked && <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-white/30 rounded-full blur-[1px]" />}
                                            {isLocked ? <Lock size={28} className="mt-1" fill="currentColor" /> :
                                                accuracy === 100 ? <Star size={32} className="mt-1 fill-white" /> :
                                                    <Play size={28} className="mt-1 ml-1 fill-white" />}
                                        </div>

                                        {/* Crown floating tag if completed */}
                                        {accuracy === 100 && (
                                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg animate-bounce duration-[2000ms]">
                                                <Trophy size={14} className="fill-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description Card - Right aside on desktop */}
                                <div className={cn(
                                    "flex-1 p-6 rounded-3xl border bg-card transition-all duration-300 shadow-sm",
                                    isLocked ? "opacity-60 border-border" :
                                        accuracy === 100 ? "border-emerald-500/30 bg-emerald-500/5" :
                                            "border-border hover:border-primary/30 hover:shadow-md"
                                )}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-3">
                                        <div>
                                            <h3 className={cn("text-xl font-bold", isLocked ? "text-muted-foreground" : accuracy === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                                                {scenario.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {recommendation?.scenario.id === scenario.id && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/15 text-primary border border-primary/25">
                                                        <Compass size={10} aria-hidden /> Recommended
                                                    </span>
                                                )}
                                                {arc && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                                                        <BookMarked size={10} aria-hidden /> Chapter {arc.chapter} of {arc.total}
                                                    </span>
                                                )}
                                                <span className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    scenario.difficulty === 'EASY' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                                                        scenario.difficulty === 'MEDIUM' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-red-500/10 text-red-500"
                                                )}>
                                                    {scenario.difficulty}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-0.5 rounded-full">
                                                    Lvl {scenario.gameLevel?.level || 0}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-0.5 rounded-full">
                                                    Target: {scenario.minimumScore}%
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-0.5 rounded-full">
                                                    {scenario.scenarioType}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        {!isLocked && hasPlayed && (
                                            <div className="flex items-center gap-3 shrink-0">
                                                {mastery && (
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider",
                                                        mastery.chip, mastery.color
                                                    )}>
                                                        <span aria-hidden>{mastery.emoji}</span> {mastery.name}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-4 text-sm font-bold bg-muted px-4 py-2 rounded-xl border border-border">
                                                    <span className={accuracy === 100 ? "text-emerald-500" : "text-primary"}>
                                                        {accuracy}% Accuracy
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-4">
                                        {scenario.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row justify-start items-stretch sm:items-center gap-3 sm:gap-4 mt-2">
                                        <Button
                                            onClick={() => {
                                                if (isLocked) return;
                                                if (scenario.activeProgressId) {
                                                    gameStore.loadProgress(scenario.activeProgressId);
                                                } else {
                                                    handleStartGame(scenario);
                                                }
                                            }}
                                            disabled={loadingScenarioId !== null || isLocked}
                                            className={cn(
                                                "px-8 h-10 rounded-xl font-bold transition-all active:scale-95 text-sm",
                                                isLocked ? "bg-gray-500/10 text-gray-500" :
                                                    scenario.activeProgressId ? "bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_0_rgb(180,83,9)] active:translate-y-1 active:shadow-none" :
                                                        accuracy === 100 ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_0_rgb(4,120,87)] active:translate-y-1 active:shadow-none" :
                                                            "bg-primary text-white shadow-[0_4px_0_rgba(var(--primary),0.8)] active:translate-y-1 active:shadow-none"
                                            )}
                                        >
                                            {loadingScenarioId === scenario.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            {isLocked ? <Lock size={16} className="mr-2" /> : null}
                                            {isLocked ? 'Locked' : scenario.activeProgressId ? 'Resume Mission' : accuracy === 100 ? 'Replay Mission' : hasPlayed ? 'Improve Score' : 'Start Mission'}
                                        </Button>

                                        {/* Replay motivation: next mastery tier */}
                                        {masteryGoal && (
                                            <div className={cn(
                                                "flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border",
                                                masteryGoal.tier.chip, masteryGoal.tier.color
                                            )}>
                                                <ChevronUp size={14} aria-hidden />
                                                <span>
                                                    Next: {masteryGoal.tier.emoji} {masteryGoal.tier.name} — {masteryGoal.requirement}
                                                </span>
                                            </div>
                                        )}

                                        {/* Display Unlock Requirement if Locked */}
                                        {isLocked && prereqScenario && (
                                            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                                                <Info size={14} />
                                                <span>Requires {prereqScenario.minimumScore}% on "{prereqScenario.title}"</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Infinite Scroll Loader */}
            {hasMore && (
                <div className="flex justify-center py-10">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading more missions...</p>
                    </div>
                </div>
            )}
            
            {!hasMore && scenarios.length > 10 && (
                <div className="text-center py-10 opacity-40">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">You've reached the end — more missions coming soon</p>
                </div>
            )}
        </div>
    );
}

const WORLD_STATE_STYLES: Record<CampaignWorldState['tone'], { chip: string; bar: string }> = {
    neutral: { chip: 'text-muted-foreground', bar: 'bg-muted-foreground/40' },
    thriving: { chip: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
    contested: { chip: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
    crisis: { chip: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' },
};

/** Story-arc divider: campaign name, arc progress, and the community's state. */
function CampaignHeader({ title, state }: { title: string; state: CampaignWorldState }) {
    const styles = WORLD_STATE_STYLES[state.tone];
    return (
        <section
            aria-label={`Campaign: ${title}`}
            className="w-full rounded-3xl border border-border bg-gradient-to-br from-violet-500/10 to-primary/5 p-5 sm:p-6 space-y-3"
        >
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5 min-w-0">
                    <BookMarked size={16} className="text-violet-500 shrink-0" aria-hidden />
                    <h3 className="font-black tracking-tight truncate">
                        <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400 block">Story campaign</span>
                        {title}
                    </h3>
                </div>
                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                    {state.completed} of {state.total} chapters complete
                </span>
            </div>
            <div
                className="w-full h-2 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={state.pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${title} campaign progress`}
            >
                <div className={cn('h-full rounded-full transition-all duration-1000 ease-out', styles.bar)} style={{ width: `${state.pct}%` }} />
            </div>
            <p className={cn('text-xs font-semibold leading-relaxed italic', styles.chip)}>
                {state.narrative}
                {state.avgAccuracy !== null && (
                    <span className="not-italic text-muted-foreground font-medium"> · {state.avgAccuracy}% campaign accuracy</span>
                )}
            </p>
        </section>
    );
}
