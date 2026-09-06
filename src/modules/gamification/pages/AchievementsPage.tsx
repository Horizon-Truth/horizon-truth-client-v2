import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Trophy, Users, Lock, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '@/store/game.store';
import { engineService } from '@/services/engine.service';
import type { Scenario } from '@/services/engine.service';
import { evaluateAll, ACHIEVEMENT_CATEGORIES } from '../achievements';
import type { AchievementCategory, EvaluatedAchievement } from '../achievements';
import { masteryFor } from '../mastery';
import type { MasteryTier } from '../mastery';
import { castState, DISPOSITIONS, OPINION_THRESHOLD } from '../characters';
import { SKILLS } from '../skills';
import { ensureToday } from '../daily';

/**
 * Phase 13 + 11 — the player's trophy case and the people who notice.
 * Everything shown is derived from tracked play data; nothing is minted here.
 */
export default function AchievementsPage() {
    const navigate = useNavigate();
    const { stats, currentStreak, skillBook, calibration, dailyLedger, lifetimeImpact } = useGameStore();
    const [tab, setTab] = useState<'achievements' | 'allies'>('achievements');
    const [masteryTiers, setMasteryTiers] = useState<MasteryTier[]>([]);

    // Mastery tiers come from the player's scenario records.
    useEffect(() => {
        let cancelled = false;
        engineService.getScenarios({ isActive: true, page: 1, limit: 100 })
            .then(response => {
                if (cancelled) return;
                const data: Scenario[] = Array.isArray(response) ? response : (response.data || []);
                const tiers = data
                    .map(s => masteryFor(s.userRecord ? { ...s.userRecord, totalPossibleScore: s.totalPossibleScore } : null))
                    .filter((t): t is MasteryTier => !!t);
                setMasteryTiers(tiers);
            })
            .catch(() => { /* achievements that need mastery simply stay locked */ });
        return () => { cancelled = true; };
    }, []);

    const totals = useMemo(() => {
        const decisions = SKILLS.reduce((sum, s) => sum + (skillBook[s.key]?.total ?? 0), 0);
        const correct = SKILLS.reduce((sum, s) => sum + (skillBook[s.key]?.correct ?? 0), 0);
        return { decisions, overall: decisions > 0 ? Math.round((correct / decisions) * 100) : null };
    }, [skillBook]);

    const evaluated = useMemo(() => evaluateAll({
        missionsCompleted: stats.missionsCompleted,
        xp: stats.experience,
        trustScore: stats.trustScore,
        accuracyRate: stats.accuracyRate,
        currentStreak,
        skillBook,
        calibration,
        daily: ensureToday(dailyLedger),
        masteryTiers,
        totalPreventedReach: lifetimeImpact?.preventedReach ?? 0,
        totalReached: lifetimeImpact?.reached ?? 0,
    }), [stats, currentStreak, skillBook, calibration, dailyLedger, masteryTiers, lifetimeImpact]);

    const unlocked = evaluated.filter(a => a.unlocked).length;
    const cast = useMemo(() => castState(skillBook, totals.overall, totals.decisions), [skillBook, totals]);

    const grouped = useMemo(() => {
        const map = new Map<AchievementCategory, EvaluatedAchievement[]>();
        for (const a of evaluated) {
            map.set(a.category, [...(map.get(a.category) ?? []), a]);
        }
        return map;
    }, [evaluated]);

    return (
        <div className="min-h-full bg-background text-foreground overflow-y-auto p-4 sm:p-8">
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16">
                <header className="flex items-center justify-between gap-4 flex-wrap">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard/game')}
                        className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={16} aria-hidden /> Back to missions
                    </Button>
                    <span className="text-xs font-bold text-muted-foreground">
                        {unlocked} / {evaluated.length} achievements earned
                    </span>
                </header>

                {/* Tabs */}
                <div className="flex gap-2" role="tablist" aria-label="Progress sections">
                    <TabButton active={tab === 'achievements'} onClick={() => setTab('achievements')} icon={<Trophy size={15} aria-hidden />} label="Achievements" />
                    <TabButton active={tab === 'allies'} onClick={() => setTab('allies')} icon={<Users size={15} aria-hidden />} label="People who notice" />
                </div>

                {tab === 'achievements' ? (
                    <div className="space-y-8">
                        {(Object.keys(ACHIEVEMENT_CATEGORIES) as AchievementCategory[]).map(category => {
                            const items = grouped.get(category) ?? [];
                            if (items.length === 0) return null;
                            const meta = ACHIEVEMENT_CATEGORIES[category];
                            return (
                                <section key={category} className="space-y-3" aria-label={meta.name}>
                                    <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest px-1">
                                        <span aria-hidden>{meta.emoji}</span> {meta.name}
                                        <span className="text-muted-foreground font-bold normal-case tracking-normal">
                                            {items.filter(i => i.unlocked).length}/{items.length}
                                        </span>
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {items.map(item => <AchievementCard key={item.key} achievement={item} />)}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed px-1">
                            These people watch how you handle information. Their opinion of you is calculated from your
                            real accuracy — improve in their area and they'll come around.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cast.map(state => {
                                const style = DISPOSITIONS[state.disposition];
                                const skill = state.character.skillKey ? SKILLS.find(s => s.key === state.character.skillKey) : null;
                                const undecided = state.decisions < OPINION_THRESHOLD;
                                return (
                                    <motion.article
                                        key={state.character.key}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm"
                                        aria-label={state.character.name}
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl shrink-0" aria-hidden>
                                                {state.character.emoji}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-black tracking-tight truncate">{state.character.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{state.character.role}</p>
                                            </div>
                                            <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold shrink-0', style.chip, style.color)}>
                                                <span aria-hidden>{style.emoji}</span> {style.label}
                                            </span>
                                        </div>

                                        <p className="text-xs text-muted-foreground leading-relaxed">{state.character.bio}</p>

                                        <blockquote className={cn('text-sm leading-relaxed italic border-l-2 pl-4 py-1', style.color, 'border-current')}>
                                            &ldquo;{state.line}&rdquo;
                                        </blockquote>

                                        <p className="text-[11px] text-muted-foreground font-medium">
                                            {undecided
                                                ? `Hasn't formed an opinion yet — needs ${OPINION_THRESHOLD - state.decisions} more decision${OPINION_THRESHOLD - state.decisions > 1 ? 's' : ''}${skill ? ` in ${skill.name}` : ''}.`
                                                : skill
                                                    ? `Watches your ${skill.name}: ${state.accuracy}% accurate over ${state.decisions} decisions.`
                                                    : `Watches your overall record: ${state.accuracy}% accurate over ${state.decisions} decisions.`}
                                        </p>
                                    </motion.article>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            role="tab"
            aria-selected={active}
            className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold transition-colors',
                active
                    ? 'bg-primary/15 border-primary/40 text-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            )}
        >
            {icon} {label}
        </button>
    );
}

function AchievementCard({ achievement }: { achievement: EvaluatedAchievement }) {
    const { unlocked, pct, current, target } = achievement;
    return (
        <div className={cn(
            'rounded-2xl border p-4 space-y-2.5 transition-colors',
            unlocked ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-card'
        )}>
            <div className="flex items-start gap-3">
                <span className={cn('text-2xl shrink-0', !unlocked && 'grayscale opacity-60')} aria-hidden>
                    {achievement.emoji}
                </span>
                <div className="min-w-0 flex-1">
                    <p className={cn('font-bold text-sm leading-snug', !unlocked && 'text-muted-foreground')}>
                        {achievement.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{achievement.description}</p>
                </div>
                {unlocked
                    ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" aria-label="Earned" />
                    : <Lock size={14} className="text-muted-foreground/60 shrink-0" aria-label="Locked" />}
            </div>
            {!unlocked && (
                <div className="space-y-1">
                    <div
                        className="w-full h-1.5 bg-muted rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${achievement.name} progress`}
                    >
                        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground tabular-nums text-right">
                        {current?.toLocaleString() ?? '—'} / {target?.toLocaleString() ?? '—'}
                    </p>
                </div>
            )}
        </div>
    );
}
