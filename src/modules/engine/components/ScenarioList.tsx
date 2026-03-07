import { useEffect, useState } from 'react';
import type { Scenario } from '@/services/engine.service';
import { engineService } from '@/services/engine.service';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Play, Loader2, Info, Trophy, Lock, Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ScenarioSkeleton } from './play/ImmersiveSkeleton';

export function ScenarioList({ onStartGame }: { onStartGame?: (scenario: Scenario) => void, guestMode?: boolean }) {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const gameStore = useGameStore();
    const [localLoading, setLocalLoading] = useState(true);

    const handleStartGame = (scenario: Scenario) => {
        if (onStartGame) {
            onStartGame(scenario);
        } else {
            gameStore.startGame(scenario.id);
        }
    };

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                // In guest mode (and normally for players), we should only fetch active scenarios
                const response = await engineService.getScenarios({ isActive: true } as any);
                // Ensure we handle both potential response formats ({data: []} or just [])
                const data = Array.isArray(response) ? response : (response.data || []);
                setScenarios(data);
            } catch (err) {
                console.error('Failed to fetch scenarios', err);
            } finally {
                // Add a small delay for immersion
                setTimeout(() => setLocalLoading(false), 800);
            }
        };

        fetchScenarios();
    }, []);

    if (localLoading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="space-y-2 opacity-40">
                    <h2 className="text-3xl font-extrabold tracking-tight">Active Operations</h2>
                    <p className="text-lg">Scanning network for available protocols...</p>
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
                    <Info size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">No Operations Available</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        There are currently no active protocol training operations. Please check back later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 overflow-x-hidden">
            <div className="space-y-2 mb-4 text-center">
                <h2 className="text-4xl font-extrabold tracking-tight">Protocol Training</h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Complete missions to build your expertise.
                </p>
            </div>

            <div className="relative max-w-3xl mx-auto w-full py-8 text-left">
                {/* Continuous Central connecting line on the left (Desktop only) */}
                <div className="absolute left-[3rem] top-12 bottom-[120px] w-2 bg-white/10 rounded-full hidden sm:block overflow-hidden z-0">
                    {/* Fill line logic could go here based on completion % in future */}
                </div>

                <div className="flex flex-col gap-10 relative z-10 w-full">
                    {scenarios.map((scenario, index) => {
                        const isLocked = scenario.lockStatus === 'LOCKED';
                        const accuracy = scenario.userRecord?.bestAccuracyRate ?? 0;
                        const hasPlayed = (scenario.userRecord?.attempts || 0) > 0;
                        const prereqScenario = scenario.unlockScenarioId ? scenarios.find(s => s.id === scenario.unlockScenarioId) : null;

                        return (
                            <div key={scenario.id} className="relative flex flex-col sm:flex-row items-center sm:items-stretch gap-6 w-full">

                                {/* Node Container - Left aligned on desktop */}
                                <div className="relative w-24 flex-shrink-0 flex items-center justify-center z-20">
                                    {/* Connecting Line Segment for mobile */}
                                    {index !== scenarios.length - 1 && (
                                        <div className="absolute top-[90px] bottom-[-2.5rem] left-1/2 w-2 bg-white/10 -translate-x-1/2 sm:hidden rounded-full z-0" />
                                    )}

                                    <div className="relative group rounded-full p-2">
                                        {/* SVG Progress Ring */}
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                                            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className={isLocked ? "text-white/5" : "text-white/10"} />
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
                                    "flex-1 p-6 rounded-3xl border bg-card/40 backdrop-blur-md transition-all duration-300 shadow-xl",
                                    isLocked ? "opacity-60 border-white/5" :
                                        accuracy === 100 ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_10px_40px_rgba(16,185,129,0.05)]" :
                                            "border-white/10 hover:border-primary/30 hover:bg-card/60"
                                )}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                                        <div>
                                            <h3 className={cn("text-xl font-bold", isLocked ? "text-muted-foreground" : accuracy === 100 ? "text-emerald-400" : "text-foreground")}>
                                                {scenario.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    scenario.difficulty === 'EASY' ? "bg-emerald-500/10 text-emerald-500" :
                                                        scenario.difficulty === 'MEDIUM' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                                                )}>
                                                    {scenario.difficulty}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-2.5 py-0.5 rounded-full">
                                                    Lvl {scenario.gameLevel?.level || 0}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-2.5 py-0.5 rounded-full">
                                                    {scenario.scenarioType}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        {!isLocked && hasPlayed && (
                                            <div className="flex items-center gap-4 text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                                                <span className={accuracy === 100 ? "text-emerald-500" : "text-primary"}>
                                                    {accuracy}% Accuracy
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-4">
                                        {scenario.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 mt-2">
                                        <Button
                                            onClick={() => !isLocked && handleStartGame(scenario)}
                                            disabled={gameStore.isLoading || isLocked}
                                            className={cn(
                                                "px-8 h-10 rounded-xl font-bold transition-all active:scale-95 text-sm",
                                                isLocked ? "bg-gray-500/10 text-gray-500" :
                                                    accuracy === 100 ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_0_rgb(4,120,87)] active:translate-y-1 active:shadow-none" :
                                                        "bg-primary text-white shadow-[0_4px_0_rgba(var(--primary),0.8)] active:translate-y-1 active:shadow-none"
                                            )}
                                        >
                                            {gameStore.isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            {isLocked ? <Lock size={16} className="mr-2" /> : null}
                                            {isLocked ? 'Locked' : accuracy === 100 ? 'Replay Mission' : hasPlayed ? 'Improve Score' : 'Start Mission'}
                                        </Button>

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
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
