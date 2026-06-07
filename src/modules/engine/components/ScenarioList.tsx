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