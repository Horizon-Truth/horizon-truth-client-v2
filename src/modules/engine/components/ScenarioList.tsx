import { useEffect, useState } from 'react';
import type { Scenario } from '@/services/engine.service';
import { engineService } from '@/services/engine.service';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Play, Loader2, Gauge, Info, ShieldCheck, Trophy, Lock, Star, Activity } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ScenarioSkeleton } from './play/ImmersiveSkeleton';

export function ScenarioList({ onStartGame, guestMode }: { onStartGame?: (scenario: Scenario) => void, guestMode?: boolean }) {
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
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight">Active Operations</h2>
                <p className="text-muted-foreground text-lg">
                    Select a mission to begin your protocol training. Each choice shapes your influence in the network.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenarios.map((scenario) => {
                    const isCompleted = scenario.userRecord?.isCompleted || scenario.lockStatus === 'VERIFIED' || false;
                    const isLocked = scenario.lockStatus === 'LOCKED';
                    const bestScore = scenario.userRecord?.bestScore ?? null;
                    const hasPlayed = (scenario.userRecord?.attempts || 0) > 0;

                    return (
                        <div
                            key={scenario.id}
                            className={cn(
                                "group flex flex-col gap-6 p-8 bg-card/30 border border-white/5 rounded-3xl relative overflow-hidden backdrop-blur-xl transition-all duration-300",
                                isLocked ? "opacity-60 cursor-not-allowed border-white/5" :
                                    isCompleted ? "border-emerald-500/20 hover:border-emerald-500/40" : "hover:border-primary/30"
                            )}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <Play size={120} />
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            scenario.difficulty === 'EASY' ? "bg-emerald-500/10 text-emerald-500" :
                                                scenario.difficulty === 'MEDIUM' ? "bg-amber-500/10 text-amber-500" :
                                                    "bg-red-500/10 text-red-500"
                                        )}>
                                            {scenario.difficulty}
                                        </span>
                                        {isLocked && (
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-500/10 text-gray-400 border border-gray-500/20 flex items-center gap-1">
                                                <Lock size={10} /> Locked
                                            </span>
                                        )}
                                        {isCompleted && !isLocked && (
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1">
                                                <Star size={10} /> Verified
                                            </span>
                                        )}
                                        {!isCompleted && !isLocked && hasPlayed && (
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                                                <ShieldCheck size={10} /> In Progress
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                                        {scenario.scenarioType}
                                    </span>
                                </div>

                                {!guestMode && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100/10 text-indigo-400 border border-indigo-400/20">
                                            Lvl {scenario.gameLevel?.level || 0}
                                        </span>
                                        {bestScore !== null ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 gap-1.5 w-fit">
                                                    <Trophy size={10} />
                                                    Points: {bestScore}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 gap-1.5 w-fit">
                                                    <Activity size={10} />
                                                    Accuracy: {scenario.userRecord?.bestAccuracyRate ?? 0}%
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100/10 text-emerald-400 border border-emerald-400/20">
                                                +{scenario.gameLevel?.requiredXp || 0} Trust
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{scenario.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                        {scenario.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Gauge size={14} className="text-primary" />
                                        <span>Lvl {scenario.gameLevel?.level || 0}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                    <span>{scenario.gameLevel?.requiredXp || 0} XP Reward</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => !isLocked && handleStartGame(scenario)}
                                disabled={gameStore.isLoading || isLocked}
                                className={cn(
                                    "mt-auto h-12 rounded-2xl font-bold transition-all active:scale-95",
                                    isLocked
                                        ? "bg-gray-500/10 text-gray-500 border border-gray-500/20 cursor-not-allowed"
                                        : isCompleted
                                            ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20"
                                            : "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02]"
                                )}
                                title={isLocked ? 'Complete the prerequisite scenario to unlock this mission' : undefined}
                            >
                                {gameStore.isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> :
                                    isLocked ? <Lock size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                                {isLocked ? 'Locked — Complete Prior Mission' : isCompleted ? 'Improve Score' : hasPlayed ? 'Try Again' : 'Initialize Protocol'}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}
