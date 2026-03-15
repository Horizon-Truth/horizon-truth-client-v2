
import { useState } from 'react';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Trophy, LayoutDashboard, ShieldCheck, Activity, Target, TrendingDown, Shield, Globe } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { InvestigationReveal } from './play/InvestigationReveal';
import PlayerFeedbackModal from './play/PlayerFeedbackModal';
import { motion } from 'framer-motion';

const NARRATIVE_CONFIG: Record<string, {
    title: string;
    subtitle: string;
    gradient: string;
    border: string;
    icon: React.ReactNode;
    glow: string;
}> = {
    TRUTH_VICTORY: {
        title: 'Truth Victory',
        subtitle: 'You identified and contained the misinformation before it spread. The community trusts your judgment.',
        gradient: 'from-emerald-50 via-emerald-100 to-transparent',
        border: 'border-emerald-200',
        icon: <Shield size={40} className="text-emerald-500" />,
        glow: 'shadow-[0_0_80px_rgba(16,185,129,0.1)]',
    },
    CONTAINED_EARLY: {
        title: 'Contained Early',
        subtitle: 'Good work — you slowed the spread significantly, though some misinformation still reached the network.',
        gradient: 'from-blue-50 via-blue-100 to-transparent',
        border: 'border-blue-200',
        icon: <ShieldCheck size={40} className="text-blue-500" />,
        glow: 'shadow-[0_0_80px_rgba(59,130,246,0.1)]',
    },
    VIRAL_MISINFORMATION: {
        title: 'Viral Misinformation',
        subtitle: 'The false claim reached thousands before fact-checkers could intervene. The damage is significant.',
        gradient: 'from-orange-50 via-orange-100 to-transparent',
        border: 'border-orange-200',
        icon: <Globe size={40} className="text-orange-500" />,
        glow: 'shadow-[0_0_80px_rgba(249,115,22,0.1)]',
    },
    COMMUNITY_CRISIS: {
        title: 'Community Crisis',
        subtitle: 'Your decisions amplified the narrative. The community is divided and trust in institutions has fallen.',
        gradient: 'from-red-50 via-red-100 to-transparent',
        border: 'border-red-200',
        icon: <TrendingDown size={40} className="text-red-500" />,
        glow: 'shadow-[0_0_80px_rgba(239,68,68,0.1)]',
    },
};

export function GameOutcome() {
    const { currentOutcome, resetGame } = useGameStore();
    const [view, setView] = useState<'reveal' | 'summary'>('reveal');
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    if (!currentOutcome) return null;

    // Debug log to check outcome data
    console.log('[GameOutcome] currentOutcome:', currentOutcome);

    const isSuccess = currentOutcome.passed ?? (currentOutcome.outcomeType === 'SUCCESS' || currentOutcome.outcomeType === 'PASS' || currentOutcome.outcomeType === 'PERFECT_PASS' || (currentOutcome.accuracyRate !== undefined && currentOutcome.accuracyRate !== null && currentOutcome.accuracyRate >= 70));
    const narrativeKey = currentOutcome.narrativeEnding || (isSuccess ? 'CONTAINED_EARLY' : 'COMMUNITY_CRISIS');
    const narrativeCfg = NARRATIVE_CONFIG[narrativeKey] || NARRATIVE_CONFIG['COMMUNITY_CRISIS'];

    if (view === 'reveal' && currentOutcome.progressId) {
        return (
            <InvestigationReveal
                progressId={currentOutcome.progressId}
                onComplete={() => setView('summary')}
            />
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 flex flex-col items-center">
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-10 animate-in zoom-in-95 duration-700 w-full max-w-4xl">
                {/* Narrative Ending Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={cn(
                        'w-full max-w-2xl rounded-3xl border bg-gradient-to-b p-8 relative overflow-hidden',
                        narrativeCfg.gradient,
                        narrativeCfg.border,
                        narrativeCfg.glow
                    )}
                >
                    {/* Pulse glow */}
                    <div className="absolute inset-0 opacity-10 animate-pulse bg-gradient-to-t from-white/10 to-transparent rounded-3xl pointer-events-none" />

                    {isSuccess && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-emerald-100 border border-emerald-500/50 text-emerald-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] uppercase font-black tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-1.5">
                            <Trophy size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">KNOWLEDGE INCREASED!</span><span className="xs:hidden">VICTORY</span>
                        </div>
                    )}
                    {!isSuccess && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-red-100 border border-red-500/50 text-red-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] uppercase font-black tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center gap-1.5">
                            <Activity size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">MISSION FAILED</span><span className="xs:hidden">FAILED</span>
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0"
                        >
                            {narrativeCfg.icon}
                        </motion.div>
                        <div>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Mission Outcome</p>
                            <h1 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase text-slate-900">{narrativeCfg.title}</h1>
                        </div>
                        <p className="text-sm text-slate-600 max-w-md leading-relaxed font-medium">{narrativeCfg.subtitle}</p>
                    </div>
                </motion.div>

                {/* Feedback Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-2xl p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm italic"
                >
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                        &ldquo;{currentOutcome.feedback}&rdquo;
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-2xl mx-auto">
                    {/* <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 backdrop-blur-2xl group hover:scale-[1.05] transition-all duration-300 hover:bg-amber-500/10">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
                            <Zap size={14} />
                            Influence
                        </p>
                        <p className="text-4xl font-black text-amber-500">{currentOutcome.influenceScore ?? 0}</p>
                        <p className="text-[10px] text-amber-500/60 font-black uppercase mt-2 tracking-widest">Network Nodes</p>
                    </div> */}
                    {currentOutcome.accuracyRate !== null && currentOutcome.accuracyRate !== undefined ? (
                        <div className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-indigo-50 border border-indigo-100 group hover:scale-[1.05] transition-all duration-300 hover:bg-indigo-100/50 shadow-sm flex-1 min-w-[140px] max-w-xs text-center">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
                                <Target size={14} />
                                Accuracy
                            </p>
                            <p className="text-3xl sm:text-4xl font-black text-indigo-700">{currentOutcome.accuracyRate}%</p>
                            <p className="text-[9px] sm:text-[10px] text-indigo-600/60 font-black uppercase mt-2 tracking-widest leading-none">Correct Decisions</p>
                        </div>
                    ) : (
                        <div className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-purple-50 border border-purple-100 group hover:scale-[1.05] transition-all duration-300 hover:bg-purple-100/50 shadow-sm flex-1 min-w-[140px] max-w-xs text-center">
                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
                                <Trophy size={14} />
                                Score
                            </p>
                            <p className="text-3xl sm:text-4xl font-black text-purple-700">{currentOutcome.score}</p>
                            <p className="text-[9px] sm:text-[10px] text-purple-600/60 font-black uppercase mt-2 tracking-widest leading-none">Final Rating</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl pt-4">
                    <Button
                        size="lg"
                        onClick={resetGame}
                        className="h-16 flex-1 rounded-[1.5rem] font-black text-lg bg-primary hover:bg-primary/90 hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-primary/40 group uppercase tracking-widest"
                    >
                        <LayoutDashboard className="mr-3 group-hover:rotate-12 transition-transform" size={22} />
                        New Assignment
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setView('reveal')}
                        className="h-16 flex-1 rounded-[1.5rem] font-black text-lg border-slate-200 text-slate-900 transition-all uppercase hover:bg-slate-50"
                    >
                        <Activity className="mr-3" size={22} />
                        Reality Check
                    </Button>
                </div>

                {isFeedbackOpen && currentOutcome?.scenario?.id && (
                    <PlayerFeedbackModal
                        scenarioId={currentOutcome.scenario.id}
                        onSuccess={() => setIsFeedbackOpen(false)}
                        onCancel={() => setIsFeedbackOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
