import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Trophy, LayoutDashboard, ShieldCheck, Activity, Target, TrendingDown, Shield, Globe, Sparkles, BookOpen, Brain, GraduationCap, Lightbulb } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { InvestigationReveal } from './play/InvestigationReveal';
import PlayerFeedbackModal from './play/PlayerFeedbackModal';
import { motion } from 'framer-motion';
import { engineService } from '@/services/engine.service';
import type { Scenario } from '@/services/engine.service';
import { getRank, getNextRank, rankProgress, xpToNextRank } from '@/modules/gamification/progression';
import { Confetti } from '@/modules/gamification/components/Confetti';
import { tipForSeed } from '@/modules/gamification/learning-content';

const NARRATIVE_CONFIG: Record<string, {
    title: string;
    subtitle: string;
    surface: string;
    icon: React.ReactNode;
}> = {
    TRUTH_VICTORY: {
        title: 'Truth Victory',
        subtitle: 'You identified and contained the misinformation before it spread. The community trusts your judgment.',
        surface: 'bg-emerald-500/10 border-emerald-500/25',
        icon: <Shield size={40} className="text-emerald-500" aria-hidden />,
    },
    CONTAINED_EARLY: {
        title: 'Contained Early',
        subtitle: 'Good work — you slowed the spread significantly, though some misinformation still reached the network.',
        surface: 'bg-blue-500/10 border-blue-500/25',
        icon: <ShieldCheck size={40} className="text-blue-500" aria-hidden />,
    },
    VIRAL_MISINFORMATION: {
        title: 'Viral Misinformation',
        subtitle: 'The false claim reached thousands before fact-checkers could intervene. The damage is significant.',
        surface: 'bg-orange-500/10 border-orange-500/25',
        icon: <Globe size={40} className="text-orange-500" aria-hidden />,
    },
    COMMUNITY_CRISIS: {
        title: 'Community Crisis',
        subtitle: 'Your decisions amplified the narrative. The community is divided and trust in institutions has fallen.',
        surface: 'bg-red-500/10 border-red-500/25',
        icon: <TrendingDown size={40} className="text-red-500" aria-hidden />,
    },
};

export function GameOutcome() {
    const { currentOutcome, resetGame, stats } = useGameStore();
    const [view, setView] = useState<'reveal' | 'summary'>('reveal');
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [scenario, setScenario] = useState<Scenario | null>(null);

    // Enrich the result screen with the scenario's educational content
    useEffect(() => {
        const scenarioId = currentOutcome?.scenario?.id;
        if (!scenarioId) return;
        engineService.getScenarioById(scenarioId)
            .then(setScenario)
            .catch(() => setScenario(null));
    }, [currentOutcome?.scenario?.id]);

    if (!currentOutcome) return null;

    const isSuccess = currentOutcome.passed ?? (currentOutcome.outcomeType === 'SUCCESS' || currentOutcome.outcomeType === 'PASS' || currentOutcome.outcomeType === 'PERFECT_PASS' || (currentOutcome.accuracyRate !== undefined && currentOutcome.accuracyRate !== null && currentOutcome.accuracyRate >= 70));
    const narrativeKey = currentOutcome.narrativeEnding || (isSuccess ? 'CONTAINED_EARLY' : 'COMMUNITY_CRISIS');
    const narrativeCfg = NARRATIVE_CONFIG[narrativeKey] || NARRATIVE_CONFIG['COMMUNITY_CRISIS'];

    // XP breakdown (the store already added the score to experience)
    const xpEarned = Math.max(0, currentOutcome.score ?? 0);
    const xpNow = stats.experience;
    const rank = getRank(xpNow);
    const nextRank = getNextRank(xpNow);
    const rankPct = rankProgress(xpNow);

    const lessons: { icon: React.ReactNode; label: string; text: string }[] = [];
    if (scenario?.learningObjective) lessons.push({ icon: <GraduationCap size={18} aria-hidden />, label: 'What this mission taught', text: scenario.learningObjective });
    if (scenario?.psychologicalTrigger) lessons.push({ icon: <Brain size={18} aria-hidden />, label: 'The manipulation at play', text: scenario.psychologicalTrigger });
    if (scenario?.preventionLesson) lessons.push({ icon: <ShieldCheck size={18} aria-hidden />, label: 'How to protect yourself', text: scenario.preventionLesson });
    if (lessons.length === 0) {
        const tip = tipForSeed(currentOutcome.scenario?.id || 'fallback');
        lessons.push({ icon: <Lightbulb size={18} aria-hidden />, label: tip.title, text: tip.tip });
    }

    if (view === 'reveal' && currentOutcome.progressId) {
        return (
            <InvestigationReveal
                progressId={currentOutcome.progressId}
                onComplete={() => setView('summary')}
            />
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 flex flex-col items-center bg-background text-foreground">
            {isSuccess && <Confetti />}

            <div className="flex flex-col items-center justify-center py-8 text-center space-y-8 animate-in zoom-in-95 duration-700 w-full max-w-3xl">
                {/* Narrative banner */}
                <motion.div
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={cn('w-full rounded-3xl border p-8 relative overflow-hidden', narrativeCfg.surface)}
                >
                    <div className={cn(
                        'absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 border',
                        isSuccess
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400'
                    )}>
                        {isSuccess ? <Trophy size={12} aria-hidden /> : <Activity size={12} aria-hidden />}
                        {isSuccess ? 'Mission passed' : 'Mission failed'}
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-card border border-border flex items-center justify-center shrink-0 shadow-sm"
                        >
                            {narrativeCfg.icon}
                        </motion.div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Mission outcome</p>
                            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{narrativeCfg.title}</h1>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md leading-relaxed font-medium">{narrativeCfg.subtitle}</p>
                    </div>
                </motion.div>

                {/* XP + rank progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 text-left shadow-sm"
                >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <Sparkles size={20} aria-hidden />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Experience earned</p>
                                <p className="text-2xl font-black tabular-nums">+{xpEarned} XP</p>
                            </div>
                        </div>
                        <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold', rank.chip, rank.color)}>
                            {rank.emoji} {rank.name}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-muted-foreground">{xpNow.toLocaleString()} XP total</span>
                            {nextRank ? (
                                <span className={nextRank.color}>{xpToNextRank(xpNow).toLocaleString()} XP to {nextRank.emoji} {nextRank.name}</span>
                            ) : (
                                <span className={rank.color}>Max rank!</span>
                            )}
                        </div>
                        <div
                            className="w-full h-3 bg-muted rounded-full overflow-hidden"
                            role="progressbar"
                            aria-valuenow={rankPct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={nextRank ? `Progress towards ${nextRank.name}` : 'Rank progress'}
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${rankPct}%` }}
                                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                            />
                        </div>
                    </div>

                    {/* Result stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="rounded-2xl bg-muted/60 p-4 text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-center gap-1.5">
                                <Target size={12} aria-hidden /> Accuracy
                            </p>
                            <p className="text-2xl font-black tabular-nums">
                                {currentOutcome.accuracyRate != null ? `${currentOutcome.accuracyRate}%` : '—'}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-muted/60 p-4 text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-center gap-1.5">
                                <Trophy size={12} aria-hidden /> Score
                            </p>
                            <p className="text-2xl font-black tabular-nums">{currentOutcome.score}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Debrief quote */}
                {currentOutcome.feedback && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-full p-6 rounded-3xl bg-muted/50 border border-border text-left"
                    >
                        <p className="text-muted-foreground leading-relaxed font-medium italic">
                            &ldquo;{currentOutcome.feedback}&rdquo;
                        </p>
                    </motion.div>
                )}

                {/* What you learned */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full space-y-3 text-left"
                >
                    <div className="flex items-center gap-2 px-1">
                        <BookOpen size={16} className="text-primary" aria-hidden />
                        <h2 className="text-sm font-black uppercase tracking-widest">What you learned</h2>
                    </div>
                    {lessons.map((lesson, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.15 }}
                            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                {lesson.icon}
                            </div>
                            <div className="space-y-1 min-w-0">
                                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">{lesson.label}</p>
                                <p className="text-sm leading-relaxed">{lesson.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full pt-2">
                    <Button
                        size="lg"
                        onClick={resetGame}
                        className="h-14 flex-1 rounded-2xl font-black text-base bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 group"
                    >
                        <LayoutDashboard className="mr-2 group-hover:rotate-12 transition-transform" size={20} aria-hidden />
                        Next mission
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setView('reveal')}
                        className="h-14 flex-1 rounded-2xl font-black text-base border-border transition-all hover:bg-muted"
                    >
                        <Activity className="mr-2" size={20} aria-hidden />
                        Review decisions
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
