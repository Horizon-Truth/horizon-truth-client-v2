import { useState } from 'react';
import type { Choice } from './data/trial-scenario';
import { useGameStore } from '@/store/game.store';
import { cn } from '@/shared/lib/utils';
import {
    ShieldCheck,
    Zap,
    Star,
    Users,
    Trophy,
    ArrowRight,
    Info,
    AlertCircle,
    LayoutDashboard,
    Play,
    History
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { TRIAL_SCENARIO } from './data/trial-scenario';

export default function GamePage() {
    const { stats, completeMission } = useGameStore();
    const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'SUMMARY'>('IDLE');
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [currentTrustImpact, setCurrentTrustImpact] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

    const currentScene = TRIAL_SCENARIO.scenes[currentSceneIndex];

    const startMission = () => {
        setGameState('PLAYING');
        setCurrentSceneIndex(0);
        setCurrentTrustImpact(0);
        setFeedback(null);
        setSelectedChoiceId(null);
    };

    const handleChoice = (choice: Choice) => {
        setSelectedChoiceId(choice.id);
        setFeedback(choice.feedback);
        setCurrentTrustImpact(prev => prev + choice.trustImpact);
    };

    const nextStep = () => {
        setFeedback(null);
        setSelectedChoiceId(null);
        if (currentSceneIndex < TRIAL_SCENARIO.scenes.length - 1) {
            setCurrentSceneIndex(prev => prev + 1);
        } else {
            completeMission(TRIAL_SCENARIO.id, currentTrustImpact);
            setGameState('SUMMARY');
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 p-6 overflow-hidden bg-background/50">
            {/* Stats Header */}
            <header className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <StatCard
                    label="Protocol Trust"
                    value={`${stats.trustScore}%`}
                    icon={<ShieldCheck className="text-emerald-500" />}
                    progress={stats.trustScore}
                    color="bg-emerald-500"
                />
                <StatCard
                    label="Level / EXP"
                    value={`Lvl ${stats.level}`}
                    subValue={`${stats.experience} / ${stats.level * 100} XP`}
                    icon={<Zap className="text-amber-500" />}
                    progress={(stats.experience / (stats.level * 100)) * 100}
                    color="bg-amber-500"
                />
                <StatCard
                    label="Influence"
                    value={stats.influence.toString()}
                    icon={<Users className="text-blue-500" />}
                />
                <StatCard
                    label="Missions"
                    value={stats.missionsCompleted.toString()}
                    icon={<Trophy className="text-purple-500" />}
                />
            </header>

            {/* Main Game Area */}
            <main className="flex-1 flex gap-6 overflow-hidden">
                {/* Simulation Panel */}
                <div className="flex-1 flex flex-col gap-6 bg-card/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <LayoutDashboard size={200} />
                    </div>

                    {gameState === 'IDLE' && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95">
                            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mb-2 shadow-2xl shadow-primary/20">
                                <Play size={40} fill="currentColor" />
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight">Active Operations</h2>
                            <p className="text-muted-foreground max-w-md mx-auto text-lg">
                                Select a mission to begin your protocol training. Each choice shapes your influence in the network.
                            </p>
                            <Button size="lg" onClick={startMission} className="h-14 px-10 rounded-2xl font-bold text-lg hover:scale-105 transition-transform">
                                Begin: {TRIAL_SCENARIO.title}
                            </Button>
                        </div>
                    )}

                    {gameState === 'PLAYING' && (
                        <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-primary font-bold text-xs uppercase tracking-widest">Ongoing Mission</p>
                                    <h3 className="text-2xl font-bold">{TRIAL_SCENARIO.title}</h3>
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold font-mono">
                                    STEP {currentSceneIndex + 1}/{TRIAL_SCENARIO.scenes.length}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                {currentScene.author[0]}
                                            </div>
                                            <span className="font-bold text-sm">{currentScene.author}</span>
                                            <span className="text-[10px] text-muted-foreground ml-auto">{currentScene.timestamp}</span>
                                        </div>
                                        <p className="text-lg font-medium leading-relaxed italic border-l-4 border-primary/30 pl-4 py-2">
                                            "{currentScene.content}"
                                        </p>
                                    </div>

                                    {feedback && (
                                        <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 animate-in slide-in-from-top-2">
                                            <div className="flex gap-4">
                                                <Info className="text-primary shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold uppercase tracking-wider text-primary">Protocol Guidance</p>
                                                    <p className="text-sm font-medium leading-relaxed">{feedback}</p>
                                                </div>
                                            </div>
                                            <Button onClick={nextStep} className="w-full mt-6 h-12 rounded-xl font-bold">
                                                Proceed to Next Phase <ArrowRight className="ml-2" size={18} />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Available Actions</p>
                                    {currentScene.choices.map((choice) => (
                                        <button
                                            key={choice.id}
                                            disabled={!!feedback}
                                            onClick={() => handleChoice(choice)}
                                            className={cn(
                                                "p-5 text-left rounded-2xl border transition-all duration-200 group relative overflow-hidden",
                                                selectedChoiceId === choice.id
                                                    ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20 translate-x-1"
                                                    : feedback
                                                        ? "opacity-40 border-white/5 grayscale"
                                                        : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10 hover:-translate-y-1"
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="font-bold text-sm">{choice.text}</span>
                                                <ArrowRight size={18} className={cn("shrink-0 transition-transform", selectedChoiceId === choice.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {gameState === 'SUMMARY' && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95">
                            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-2 relative">
                                <Trophy size={48} />
                                <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-extrabold tracking-tight">Mission Accomplished</h2>
                                <p className="text-muted-foreground text-lg">
                                    Your profile has been updated with the results of this operation.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Trust Gain</p>
                                    <p className="text-2xl font-black text-emerald-500">{currentTrustImpact > 0 ? `+${currentTrustImpact}` : currentTrustImpact}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">XP Earned</p>
                                    <p className="text-2xl font-black text-amber-500">+{Math.abs(currentTrustImpact) * 5 + 20}</p>
                                </div>
                            </div>

                            <Button size="lg" variant="outline" onClick={() => setGameState('IDLE')} className="h-14 px-10 rounded-2xl font-bold border-white/10">
                                Return to Command
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sidebar - Intel/History */}
                <div className="w-80 hidden xl:flex flex-col gap-6">
                    <div className="bg-card/30 border border-white/5 rounded-3xl p-6 flex-1 flex flex-col gap-6 overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <History className="text-muted-foreground" size={18} />
                            <h3 className="font-bold text-sm tracking-tight uppercase">History</h3>
                        </div>
                        <div className="space-y-4 overflow-y-auto">
                            {stats.missionsCompleted === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                                    <AlertCircle size={32} className="mb-2" />
                                    <p className="text-xs font-bold">No recent activities</p>
                                </div>
                            ) : (
                                Array.from({ length: stats.missionsCompleted }).map((_, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Trophy size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-xs">Mission {TRIAL_SCENARIO.id}</p>
                                            <p className="text-[10px] text-muted-foreground">Successful verification</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <Star className="text-primary" size={18} />
                            <h3 className="font-bold text-sm tracking-tight uppercase">Leaderboard Status</h3>
                        </div>
                        <div className="aspect-video bg-black/20 rounded-2xl border border-white/5 flex items-center justify-center">
                            <p className="text-xs text-muted-foreground italic">Global rankings coming soon</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, subValue, icon, progress, color }: { label: string, value: string, subValue?: string, icon: React.ReactNode, progress?: number, color?: string }) {
    return (
        <div className="bg-card/40 border border-white/10 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">{label}</span>
                <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <h4 className="text-3xl font-black tracking-tight">{value}</h4>
                {subValue && <p className="text-[10px] font-medium text-muted-foreground uppercase">{subValue}</p>}
            </div>
            {progress !== undefined && (
                <div className="mt-4 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full transition-all duration-1000", color)}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
