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
        <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Mission Progress Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                        <p className="text-primary font-black text-xs uppercase tracking-[0.3em] leading-none">Connection Active</p>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{activeProgress.scenarioTitle}</h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Protocol Phase</span>
                    <div className="px-6 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-lg font-black font-mono text-primary">
                        {currentScene.order < 10 ? `0${currentScene.order}` : currentScene.order}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Scene Content */}
                <div className="flex flex-col gap-8">
                    <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                            <BrainCircuit size={200} />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <h4 className="text-2xl font-black text-primary flex items-center gap-3 italic uppercase tracking-tight">
                                <Cpu size={24} className="text-primary animate-pulse" />
                                {currentScene.title}
                            </h4>
                            <div className="p-8 rounded-3xl bg-black/40 border border-white/5 space-y-6 shadow-inner">
                                <p className="text-2xl font-medium leading-relaxed italic text-white/90 border-l-4 border-primary/60 pl-8 py-2">
                                    "{currentScene.description}"
                                </p>
                            </div>
                        </div>

                        {/* Additional content could go here (chat messages, feed items) */}
                        {(currentScene.chatMessages?.length > 0 || currentScene.feedItems?.length > 0) && (
                            <div className="space-y-4 pt-8 border-t border-white/5">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    Environmental Intel
                                </p>
                                <div className="text-sm text-muted-foreground italic bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                                    Secondary data streams intercepted. Analyze carefully.
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-6 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-4 animate-in shake-in">
                            <AlertCircle size={24} />
                            {error}
                        </div>
                    )}
                </div>

                {/* Choices */}
                <div className="flex flex-col gap-6">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] pl-2">Available Decision Nodes</p>
                    <div className="grid grid-cols-1 gap-4">
                        {currentScene.availableChoices.map((choice) => (
                            <button
                                key={choice}
                                disabled={isLoading}
                                onClick={() => handleChoice(choice)}
                                className={cn(
                                    "p-8 text-left rounded-[2rem] border transition-all duration-500 group relative overflow-hidden",
                                    "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(var(--primary),0.15)]",
                                    isLoading && "opacity-50 cursor-not-allowed grayscale"
                                )}
                            >
                                <div className="absolute inset-y-0 left-0 w-1.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                                <div className="flex items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <span className="font-black text-xl uppercase tracking-tighter group-hover:text-primary transition-colors">{choice}</span>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">Protocol Override {choice.charAt(0)}</p>
                                    </div>
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    ) : (
                                        <ShieldCheck size={28} className="text-muted-foreground group-hover:text-primary group-hover:scale-125 transition-all duration-300" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-8 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center gap-8 shadow-lg">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
                            <BrainCircuit size={32} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black uppercase tracking-widest">Strategic Analysis</p>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                Your decisions are being logged. Accuracy impacts global protocol trust and status rankings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
