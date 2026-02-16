import { useGameStore } from '@/store/game.store';
import { cn } from '@/shared/lib/utils';
import {
    Loader2,
    ShieldCheck,
    AlertCircle,
    BrainCircuit,
    Cpu
} from 'lucide-react';

export function GameSession() {
    const { activeProgress, submitChoice, isLoading, error } = useGameStore();

    if (!activeProgress) return null;

    const { currentScene } = activeProgress;

    const handleChoice = (choiceKey: string) => {
        submitChoice(currentScene.id, choiceKey);
    };

    return (
        <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Mission Progress Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-primary font-bold text-xs uppercase tracking-widest leading-none">Connection Active</p>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{activeProgress.scenarioTitle}</h3>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protocol Phase</span>
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black font-mono">
                        {currentScene.order < 10 ? `0${currentScene.order}` : currentScene.order}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Scene Content */}
                <div className="flex flex-col gap-6">
                    <div className="p-8 rounded-[2rem] bg-card/30 border border-white/5 space-y-6 relative overflow-hidden backdrop-blur-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                            <BrainCircuit size={160} />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                                <Cpu size={20} />
                                {currentScene.title}
                            </h4>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                <p className="text-lg font-medium leading-relaxed italic border-l-4 border-primary/40 pl-6 py-2">
                                    "{currentScene.description}"
                                </p>
                            </div>
                        </div>

                        {/* Additional content could go here (chat messages, feed items) */}
                        {(currentScene.chatMessages?.length > 0 || currentScene.feedItems?.length > 0) && (
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <AlertCircle size={12} />
                                    Environmental Intel
                                </p>
                                {/* Implement simplified view for messages/feeds if needed */}
                                <div className="text-xs text-muted-foreground italic bg-white/5 p-4 rounded-xl border border-white/5">
                                    Secondary data streams intercepted. Analyze carefully.
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-3">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}
                </div>

                {/* Choices */}
                <div className="flex flex-col gap-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2 mb-2">Available Decision Nodes</p>
                    <div className="grid grid-cols-1 gap-3">
                        {currentScene.availableChoices.map((choice) => (
                            <button
                                key={choice}
                                disabled={isLoading}
                                onClick={() => handleChoice(choice)}
                                className={cn(
                                    "p-6 text-left rounded-[1.5rem] border transition-all duration-300 group relative overflow-hidden",
                                    "bg-card/40 border-white/10 hover:border-primary/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10",
                                    isLoading && "opacity-50 cursor-not-allowed grayscale"
                                )}
                            >
                                <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <span className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{choice}</span>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Protocol Override {choice.charAt(0)}</p>
                                    </div>
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    ) : (
                                        <ShieldCheck size={20} className="text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <BrainCircuit size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold">Strategic Analysis</p>
                            <p className="text-[10px] text-muted-foreground leading-snug">
                                Your decisions are being logged. Accuracy impacts global protocol trust and status rankings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
