import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { engineService } from '@/services/engine.service';
import { cn } from '@/shared/lib/utils';
import { ShieldAlert, Fingerprint, Activity, ArrowRight, Loader2, CheckCircle2, Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { telemetryService } from '@/services/telemetry.service';

interface InvestigationRevealProps {
    progressId: string;
    onComplete: () => void;
}

interface SummaryChoice {
    sceneTitle: string;
    userAction: string;
    userConsequence: string;
    userTrustDelta: number;
    isPerfect: boolean;
    bestAction: string;
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
                for (let i = 0; i < data.choices.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setVisibleCount(i + 1);
                }
            } catch (err) {
                console.error('Failed to fetch summary:', err);
                setLoading(false);
            }
        };
        fetchSummary();

        // Start verification timer
        telemetryService.trackVerification(progressId, 'investigation_reveal', {
            verification_start_timestamp: new Date().toISOString()
        });
    }, [progressId]);

    const handleLearnMore = () => {
        telemetryService.trackVerification(progressId, 'investigation_reveal', {
            learn_more_opened: true,
            source_button_clicked_count: 1
        });
        // In a real app, open a modal with more info
        alert('Opening detailed verification logs...');
    };

    const handleComplete = () => {
        telemetryService.trackVerification(progressId, 'investigation_reveal', {
            verification_end_timestamp: new Date().toISOString()
        });
        telemetryService.flush(progressId, 'investigation_reveal');
        onComplete();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <p className="text-slate-900 font-mono animate-pulse uppercase tracking-[0.3em] text-xs">Decrypting Internal Logs...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar w-full h-full pb-20 bg-white">
            <div className="w-full max-w-4xl mx-auto py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">
                        <Fingerprint size={14} />
                        Post-Action Investigation
                    </div>
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">
                        Reality vs. Decision_
                    </h2>
                    <p className="text-slate-500 font-medium italic">
                        Comparing internal protocol directives with observed network impact.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Vertical Timeline Line */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute left-1/2 top-0 -translate-x-1/2 w-px bg-gradient-to-b from-primary via-slate-200 to-transparent z-0"
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
                                        {/* Scene Title Center Node */}
                                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-8 z-30">
                                            <div className="px-4 py-1 rounded-full bg-slate-50 border border-slate-200 text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
                                                Phase {index + 1}: {choice.sceneTitle}
                                            </div>
                                        </div>

                                        {/* Timeline Node Icon */}
                                        <div className={cn(
                                            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white border-2 z-20 flex items-center justify-center transition-all duration-500",
                                            choice.isPerfect
                                                ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                : "border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                                        )}>
                                            {choice.isPerfect ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Activity size={16} className="text-primary" />}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                            {/* Left Side: Your Action */}
                                            <div className="text-right space-y-4">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Action</span>
                                                <div className={cn(
                                                    "p-6 rounded-3xl bg-slate-50 border transition-all duration-700",
                                                    choice.isPerfect ? "border-emerald-200" : "border-slate-200",
                                                    choice.userTrustDelta < 0 && "border-red-200 shadow-[0_0_30px_rgba(239,68,68,0.05)] ring-1 ring-red-100"
                                                )}>
                                                    <p className="text-lg font-bold text-slate-900 mb-2">{choice.userAction}</p>
                                                    <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase text-slate-400">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full font-bold",
                                                            choice.userTrustDelta >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                                        )}>
                                                            {choice.userTrustDelta > 0 ? '+' : ''}{choice.userTrustDelta} Trust
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: Reality & Recommended */}
                                            <div className="text-left space-y-4">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Protocol Analysis</span>
                                                <div className={cn(
                                                    "p-6 rounded-3xl bg-slate-50 border transition-all duration-300 relative overflow-hidden group",
                                                    choice.isPerfect ? "border-emerald-200" : "border-slate-200"
                                                )}>
                                                    <div className="space-y-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className={cn(
                                                                "mt-1 p-2 rounded-xl",
                                                                choice.userTrustDelta < 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                                                            )}>
                                                                {choice.userTrustDelta < 0 ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm leading-relaxed text-slate-900 font-medium italic">
                                                                    "{choice.userConsequence}"
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {!choice.isPerfect && (
                                                            <div className="pt-4 border-t border-slate-200 space-y-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                                                                        <ArrowRight size={12} />
                                                                        Recommended Protocol
                                                                    </div>
                                                                    <p className="text-sm font-bold text-slate-700 pl-4 border-l-2 border-primary/30">
                                                                        {choice.bestAction}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Link Line to Reality */}
                                        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 w-12 h-[1px] bg-slate-100 -translate-x-1/2 z-10" />
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
                        className="flex flex-col items-center pt-20 border-t border-slate-200 space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Final Analysis Complete</p>
                            <p className="text-2xl font-black italic text-slate-900 uppercase italic tracking-tighter">Proceed to Briefing_</p>
                        </div>
                        <Button
                            size="lg"
                            onClick={handleComplete}
                            className="h-16 px-12 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 group shadow-lg shadow-primary/20"
                        >
                            Review Full Impact
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
