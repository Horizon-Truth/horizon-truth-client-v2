import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Trophy, Star, ArrowLeft, LayoutDashboard, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function GameOutcome() {
    const { currentOutcome, resetGame } = useGameStore();

    if (!currentOutcome) return null;

    const isSuccess = currentOutcome.outcomeType === 'SUCCESS';

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12 animate-in zoom-in-95 duration-500">
            {/* Header / Icon */}
            <div className="relative">
                <div className={cn(
                    "w-32 h-32 rounded-full flex items-center justify-center relative z-10",
                    isSuccess ? "bg-emerald-500/20 text-emerald-500 shadow-2xl shadow-emerald-500/20" : "bg-primary/20 text-primary shadow-2xl shadow-primary/20"
                )}>
                    {isSuccess ? <Trophy size={64} /> : <Star size={64} />}
                </div>
                {/* Glow Effects */}
                <div className={cn(
                    "absolute inset-0 blur-3xl rounded-full opacity-30 animate-pulse",
                    isSuccess ? "bg-emerald-500" : "bg-primary"
                )} />
            </div>

            {/* Content */}
            <div className="max-w-xl space-y-4">
                <div className="space-y-1">
                    <h2 className="text-5xl font-black tracking-tight uppercase italic">{isSuccess ? "Mission Accomplished" : "Protocol Complete"}</h2>
                    <p className="text-primary font-bold text-sm tracking-[0.2em] uppercase">{currentOutcome.scenario.title}</p>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                    {currentOutcome.feedback}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
                <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-xl group hover:scale-[1.02] transition-transform">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <ShieldCheck size={12} />
                        Efficiency Rating
                    </p>
                    <p className="text-4xl font-black text-emerald-500">+{currentOutcome.score}</p>
                    <p className="text-[10px] text-emerald-500/60 font-bold uppercase mt-1">Trust Gain Secured</p>
                </div>
                <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 backdrop-blur-xl group hover:scale-[1.02] transition-transform">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <Zap size={12} />
                        Network Experience
                    </p>
                    <p className="text-4xl font-black text-amber-500">+{currentOutcome.score * 5}</p>
                    <p className="text-[10px] text-amber-500/60 font-bold uppercase mt-1">XP Uplink Verified</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button
                    size="lg"
                    onClick={resetGame}
                    className="h-16 flex-1 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                    <LayoutDashboard className="mr-3" size={24} />
                    New Assignment
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    onClick={resetGame}
                    className="h-16 flex-1 rounded-2xl font-black text-lg border-white/10 hover:bg-white/5 hover:scale-105 active:scale-95 transition-all"
                >
                    <ArrowLeft className="mr-3" size={24} />
                    Command Center
                </Button>
            </div>
        </div>
    );
}
