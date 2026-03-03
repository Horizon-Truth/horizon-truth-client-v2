import { useEffect, useState } from 'react';
import type { Scenario } from '@/services/engine.service';
import { engineService } from '@/services/engine.service';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Play, Loader2, Gauge, Info } from 'lucide-react';
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
                {scenarios.map((scenario) => (
                    <div
                        key={scenario.id}
                        className="group flex flex-col gap-6 p-8 bg-card/30 border border-white/5 rounded-3xl relative overflow-hidden backdrop-blur-xl hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <Play size={120} />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    scenario.difficulty === 'EASY' ? "bg-emerald-500/10 text-emerald-500" :
                                        scenario.difficulty === 'MEDIUM' ? "bg-amber-500/10 text-amber-500" :
                                            "bg-red-500/10 text-red-500"
                                )}>
                                    {scenario.difficulty}
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                                    {scenario.scenarioType}
                                </span>
                            </div>

                            {!guestMode && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        Lvl {scenario.gameLevel?.level || 0}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        +{scenario.gameLevel?.requiredXp || 0} Trust
                                    </span>
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
                            onClick={() => handleStartGame(scenario)}
                            disabled={gameStore.isLoading}
                            className="mt-auto h-12 rounded-2xl font-bold group-hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            {gameStore.isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play size={16} className="mr-2" />}
                            Initialize Protocol
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
