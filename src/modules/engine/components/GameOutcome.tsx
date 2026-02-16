import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Trophy, Star, ArrowLeft, LayoutDashboard, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function GameOutcome() {
    const { currentOutcome, resetGame } = useGameStore();

    if (!currentOutcome) return null;

    const isSuccess = currentOutcome.outcomeType === 'SUCCESS';

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-16 animate-in zoom-in-95 duration-700">
            {/* Header / Icon */}
            <div className="relative group">
                <div className={cn(
                    "w-40 h-40 rounded-[3rem] flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                    isSuccess ? "bg-emerald-500/20 text-emerald-500 shadow-2xl shadow-emerald-500/30" : "bg-primary/20 text-primary shadow-2xl shadow-primary/30"
                )}>
                    {isSuccess ? <Trophy size={80} className="animate-bounce" /> : <Star size={80} />}
                </div>
                {/* Glow Effects */}
                <div className={cn(
                    "absolute inset-0 blur-[80px] rounded-full opacity-40 animate-pulse",
                    isSuccess ? "bg-emerald-500" : "bg-primary"
                )} />
            </div>

            {/* Content */}
            <div className="max-w-2xl space-y-6">
                <div className="space-y-3">
                    <h2 className="text-6xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none">
                        {isSuccess ? "Protocol Verified" : "Uplink Complete"}
                    </h2>
                    <p className="text-primary font-black text-lg tracking-[0.4em] uppercase">{currentOutcome.scenario?.title || 'Unknown Protocol'}</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md italic">
                    <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                        "{currentOutcome.feedback}"
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                <div className="p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-2xl group hover:scale-[1.05] transition-all duration-300 hover:bg-emerald-500/10 shadow-xl">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-3">
                        <ShieldCheck size={16} />
                        Efficiency Rating
                    </p>
                    <p className="text-5xl font-black text-emerald-500">+{currentOutcome.score}</p>
                    <p className="text-xs text-emerald-500/60 font-black uppercase mt-3 tracking-widest">Trust Gain Secured</p>
                </div>
                <div className="p-10 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 backdrop-blur-2xl group hover:scale-[1.05] transition-all duration-300 hover:bg-amber-500/10 shadow-xl">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-3">
                        <Zap size={16} />
                        Network Experience
                    </p>
                    <p className="text-5xl font-black text-amber-500">+{currentOutcome.score * 5}</p>
                    <p className="text-xs text-amber-500/60 font-black uppercase mt-3 tracking-widest">XP Uplink Verified</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl pt-8">
                <Button
                    size="lg"
                    onClick={resetGame}
                    className="h-20 flex-1 rounded-[1.5rem] font-black text-xl bg-primary hover:bg-primary/90 hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-primary/40 group uppercase tracking-widest"
                >
                    <LayoutDashboard className="mr-4 group-hover:rotate-12 transition-transform" size={28} />
                    New Assignment
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    onClick={resetGame}
                    className="h-20 flex-1 rounded-[1.5rem] font-black text-xl border-white/10 hover:bg-white/5 hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest backdrop-blur-md"
                >
                    <ArrowLeft className="mr-4" size={28} />
                    Command Center
                </Button>
            </div>
        </div>
    );
}
