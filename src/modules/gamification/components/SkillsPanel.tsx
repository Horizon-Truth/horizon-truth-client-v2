import { memo } from 'react';
import { cn } from '@/shared/lib/utils';
import { Brain, Scale, Crosshair } from 'lucide-react';
import { SKILLS, skillLevel, skillLevelProgress, skillAccuracy, weakestSkill } from '../skills';
import type { SkillProgress } from '../skills';
import { calibrationInsight } from '../confidence';
import type { CalibrationLedger } from '../confidence';

interface SkillsPanelProps {
    skillBook: Record<string, SkillProgress>;
    calibration: CalibrationLedger;
}

/**
 * Phase 7 — the player's competency graph on the mission hub: per-skill level
 * and accuracy, a focus-area callout, and the calibration insight (Phase 15).
 */
export const SkillsPanel = memo(function SkillsPanel({ skillBook, calibration }: SkillsPanelProps) {
    const hasAnyProgress = SKILLS.some(s => (skillBook[s.key]?.total ?? 0) > 0);
    const focus = weakestSkill(skillBook);
    const insight = calibrationInsight(calibration);

    return (
        <section
            aria-label="Your skills"
            className="border border-border rounded-3xl p-6 bg-card shadow-sm space-y-5 animate-in fade-in slide-in-from-top-4 duration-700"
        >
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <Brain size={16} className="text-primary" aria-hidden />
                    <h2 className="font-black text-xs tracking-widest uppercase">Your skills</h2>
                </div>
                {focus && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                        <Crosshair size={11} aria-hidden />
                        Focus area: {focus.emoji} {focus.name}
                    </span>
                )}
            </div>

            {!hasAnyProgress ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Every decision you make trains a specific media-literacy skill — source verification,
                    emotional defense, media analysis and more. Play your first mission to start building your skill graph.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {SKILLS.map(skill => {
                        const progress = skillBook[skill.key] ?? { xp: 0, correct: 0, total: 0 };
                        const level = skillLevel(progress.xp);
                        const pct = skillLevelProgress(progress.xp);
                        const acc = skillAccuracy(progress);
                        const untouched = progress.total === 0;
                        return (
                            <div key={skill.key} className={cn('space-y-1.5', untouched && 'opacity-50')}>
                                <div className="flex items-center justify-between gap-2 text-xs">
                                    <span className="font-bold flex items-center gap-1.5 min-w-0">
                                        <span aria-hidden>{skill.emoji}</span>
                                        <span className="truncate">{skill.name}</span>
                                    </span>
                                    <span className="text-muted-foreground font-medium whitespace-nowrap">
                                        Lv {level}{acc !== null && <span className={cn('ml-2 font-bold', skill.color)}>{acc}%</span>}
                                    </span>
                                </div>
                                <div
                                    className="w-full h-2 bg-muted rounded-full overflow-hidden"
                                    role="progressbar"
                                    aria-valuenow={pct}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`${skill.name} level ${level}`}
                                >
                                    <div
                                        className={cn('h-full rounded-full transition-all duration-1000 ease-out', skill.bar)}
                                        style={{ width: `${untouched ? 0 : Math.max(4, pct)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {insight && (
                <div className={cn(
                    'flex items-start gap-3 rounded-2xl border px-4 py-3',
                    insight.tone === 'warn'
                        ? 'border-amber-500/25 bg-amber-500/5'
                        : 'border-emerald-500/25 bg-emerald-500/5'
                )}>
                    <Scale size={15} className={cn('mt-0.5 shrink-0', insight.tone === 'warn' ? 'text-amber-500' : 'text-emerald-500')} aria-hidden />
                    <p className="text-xs leading-relaxed text-foreground/80">
                        <span className="font-bold text-foreground">Confidence check. </span>
                        {insight.text}
                    </p>
                </div>
            )}
        </section>
    );
});
