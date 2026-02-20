import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { engineService } from '@/services/engine.service';
import { cn } from '@/shared/lib/utils';
import { ShieldAlert, Fingerprint, Activity, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface InvestigationRevealProps {
    progressId: string;
    onComplete: () => void;
}

interface SummaryChoice {
    action: string;
    consequence: string;
    trustDelta: number;
    outcomeType: string;
}

export const InvestigationReveal: React.FC<InvestigationRevealProps> = ({ progressId, onComplete }) => {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await engineService.getScenarioSummary(progressId);
                setSummary(data);
                setLoading(false);

                // Staggered reveals
                for (let i = 0; i <= data.choices.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setVisibleCount(i + 1);
                }
            } catch (err) {
                console.error('Failed to fetch summary:', err);
                setLoading(false);
            }
        };
        fetchSummary();
    }, [progressId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground font-mono animate-pulse uppercase tracking-[0.3em] text-xs">Decrypting Internal Logs...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-20 space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">
                    <Fingerprint size={14} />
                    Post-Action Investigation
                </div>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
                    Reality vs. Decision_
                </h2>
                <p className="text-muted-foreground font-medium italic">
                    Comparing internal protocol directives with observed network impact.
                </p>
            </motion.div>

            <div className="relative">
                {/* Vertical Timeline Line */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute left-1/2 top-0 -translate-x-1/2 w-px bg-gradient-to-b from-primary via-white/20 to-transparent z-0"
                />

                <div className="space-y-32 relative z-10 pb-32">
                    {summary.choices.map((choice: SummaryChoice, index: number) => (
                        <AnimatePresence key={index}>
                            {index < visibleCount && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="relative"
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-primary z-20 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                        {/* Left Side: Your Action */}
                                        <div className="text-right space-y-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Your Action</span>
                                            <div className={cn(
                                                "p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md transition-all duration-700",
                                                choice.trustDelta < 0 && "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20"
                                            )}>
                                                <p className="text-lg font-bold text-white mb-2">{choice.action}</p>
                                                <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase text-white/40">
                                                    <Activity size={12} />
                                                    Uplink Terminal 01
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Reality */}
                                        <div className="text-left space-y-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Reality Check</span>
                                            <div className={cn(
                                                "p-6 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group",
                                                choice.trustDelta < 0 ? "border-red-500/30" : "border-emerald-500/30"
                                            )}>
                                                {/* Mistake Highlight Overlay */}
                                                {choice.trustDelta < 0 && (
                                                    <motion.div
                                                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="absolute inset-0 bg-red-600/5 pointer-events-none"
                                                    />
                                                )}

                                                <div className="flex items-start gap-4">
                                                    <div className={cn(
                                                        "mt-1 p-2 rounded-xl",
                                                        choice.trustDelta < 0 ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500"
                                                    )}>
                                                        {choice.trustDelta < 0 ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm leading-relaxed text-white font-medium italic mb-3">
                                                            "{choice.consequence}"
                                                        </p>
                                                        <div className={cn(
                                                            "inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                            choice.trustDelta < 0 ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                                                        )}>
                                                            Trust Delta: {choice.trustDelta > 0 ? '+' : ''}{choice.trustDelta}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Link Line to Reality */}
                                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 w-12 h-[1px] bg-white/10 -translate-x-1/2 z-10" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ))}
                </div>
            </div>

            {/* Footer / Completion */}
            {visibleCount >= summary.choices.length && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center pt-20 border-t border-white/5 space-y-6"
                >
                    <div className="text-center space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Final Analysis Complete</p>
                        <p className="text-2xl font-black italic text-white uppercase italic tracking-tighter">Proceed to Briefing_</p>
                    </div>
                    <Button
                        size="lg"
                        onClick={onComplete}
                        className="h-16 px-12 rounded-2xl bg-white text-black font-black hover:bg-white/90 group"
                    >
                        Review Full Impact
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            )}
        </div>
    );
};
