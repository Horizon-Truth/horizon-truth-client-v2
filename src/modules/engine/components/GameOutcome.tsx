
import { useState } from 'react';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Trophy, LayoutDashboard, Zap, ShieldCheck, Activity, MessageSquarePlus, Target, TrendingDown, Shield, Globe } from 'lucide-react';
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
        gradient: 'from-emerald-900/60 via-emerald-800/40 to-transparent',
        border: 'border-emerald-500/30',
        icon: <Shield size={40} className="text-emerald-400" />,
        glow: 'shadow-[0_0_80px_rgba(16,185,129,0.2)]',
    },
    CONTAINED_EARLY: {
        title: 'Contained Early',
        subtitle: 'Good work — you slowed the spread significantly, though some misinformation still reached the network.',
        gradient: 'from-blue-900/60 via-blue-800/40 to-transparent',
        border: 'border-blue-500/30',
        icon: <ShieldCheck size={40} className="text-blue-400" />,
        glow: 'shadow-[0_0_80px_rgba(59,130,246,0.2)]',
    },
    VIRAL_MISINFORMATION: {
        title: 'Viral Misinformation',
        subtitle: 'The false claim reached thousands before fact-checkers could intervene. The damage is significant.',
        gradient: 'from-orange-900/60 via-orange-800/40 to-transparent',
        border: 'border-orange-500/30',
        icon: <Globe size={40} className="text-orange-400" />,
        glow: 'shadow-[0_0_80px_rgba(249,115,22,0.2)]',
    },
    COMMUNITY_CRISIS: {
        title: 'Community Crisis',
        subtitle: 'Your decisions amplified the narrative. The community is divided and trust in institutions has fallen.',
        gradient: 'from-red-900/60 via-red-800/40 to-transparent',
        border: 'border-red-500/30',
        icon: <TrendingDown size={40} className="text-red-400" />,
        glow: 'shadow-[0_0_80px_rgba(239,68,68,0.2)]',
    },
};

export function GameOutcome() {
    const { currentOutcome, resetGame } = useGameStore();
    const [view, setView] = useState<'reveal' | 'summary'>('reveal');
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    if (!currentOutcome) return null;

    // Debug log to check outcome data
    console.log('[GameOutcome] currentOutcome:', currentOutcome);

    const isSuccess = currentOutcome.passed ?? (currentOutcome.outcomeType === 'SUCCESS' || (currentOutcome.score !== undefined && currentOutcome.score > 0));
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

                    {currentOutcome.passed && (
                        <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-1.5">
                            <Trophy size={14} /> KNOWLEDGE INCREASED!
                        </div>
                    )}
                    {!currentOutcome.passed && (
                        <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center gap-1.5">
                            <Activity size={14} /> MISSION FAILED
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center"
                        >
                            {narrativeCfg.icon}
                        </motion.div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Mission Outcome</p>
                            <h1 className="text-4xl font-black tracking-tighter uppercase">{narrativeCfg.title}</h1>
                        </div>
                        <p className="text-sm text-white/60 max-w-md leading-relaxed">{narrativeCfg.subtitle}</p>
                    </div>
                </motion.div>

                {/* Feedback Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-2xl p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md italic"
                >
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                        &ldquo;{currentOutcome.feedback}&rdquo;
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 backdrop-blur-2xl group hover:scale-[1.05] transition-all duration-300 hover:bg-amber-500/10">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
                            <Zap size={14} />
                            Influence
                        </p>
                        <p className="text-4xl font-black text-amber-500">{currentOutcome.influenceScore ?? 0}</p>
                        <p className="text-[10px] text-amber-500/60 font-black uppercase mt-2 tracking-widest">Network Nodes</p>
                    </div>
                    {currentOutcome.accuracyRate !== null && currentOutcome.accuracyRate !== undefined ? (
                        <div className="p-8 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 backdrop-blur-2xl group hover:scale-[1.05] transition-all duration-300 hover:bg-blue-500/10">
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
                                <Target size={14} />
                                Accuracy Rate
                            </p>
                            <p className="text-4xl font-black text-blue-500">{currentOutcome.accuracyRate}%</p>
                            <p className="text-[10px] text-blue-500/60 font-black uppercase mt-2 tracking-widest">Correct Decisions</p>
                        </div>
                    ) : (
                        <div className="p-8 rounded-[2rem] bg-purple-500/5 border border-purple-500/10 backdrop-blur-2xl group hover:scale-[1.05] transition-all duration-300 hover:bg-purple-500/10">
                            <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
                                <Trophy size={14} />
                                Mission Score
                            </p>
                            <p className="text-4xl font-black text-purple-500">{currentOutcome.score}</p>
                            <p className="text-[10px] text-purple-500/60 font-black uppercase mt-2 tracking-widest">Final Rating</p>
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
                        className="h-16 flex-1 rounded-[1.5rem] font-black text-lg border-white/10 hover:bg-white/5 hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest backdrop-blur-md"
                    >
                        <Activity className="mr-3" size={22} />
                        Reality Check
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setIsFeedbackOpen(true)}
                        className="h-16 flex-1 rounded-[1.5rem] font-black text-lg border-white/10 hover:bg-white/5 hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest backdrop-blur-md"
                    >
                        <MessageSquarePlus className="mr-3" size={22} />
                        Feedback
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
