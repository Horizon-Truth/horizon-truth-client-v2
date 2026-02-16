import { useEffect, useState } from 'react';
import type { Scenario } from '@/services/engine.service';
import { engineService } from '@/services/engine.service';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Play, Loader2, Gauge, Info } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function ScenarioList() {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const { startGame, isLoading } = useGameStore();
    const [localLoading, setLocalLoading] = useState(true);

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                const response = await engineService.getScenarios();
                setScenarios(response.data);
            } catch (err) {
                console.error('Failed to fetch scenarios', err);
            } finally {
                setLocalLoading(false);
            }
        };

        fetchScenarios();
    }, []);

    if (localLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Loading available missions...</p>
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
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500">
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

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{scenario.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {scenario.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground pt-2">
                                <div className="flex items-center gap-1.5">
                                    <Gauge size={14} className="text-primary" />
                                    <span>Lvl {scenario.gameLevel.level}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <span>{scenario.gameLevel.requiredXp} XP Reward</span>
                            </div>
                        </div>

                        <Button
                            onClick={() => startGame(scenario.id)}
                            disabled={isLoading}
                            className="mt-auto h-12 rounded-2xl font-bold group-hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play size={16} className="mr-2" />}
                            Initialize Protocol
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
