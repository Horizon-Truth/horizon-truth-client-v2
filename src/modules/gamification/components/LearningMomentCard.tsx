import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { CheckCircle2, XCircle, Info, Lightbulb, AlertTriangle, ChevronDown, X, BookOpen, Scale } from 'lucide-react';
import { matchTechnique, tipForSeed } from '../learning-content';
import { articleForTechnique } from '../encyclopedia';
import { calibrationMoment } from '../confidence';
import type { ConfidenceLevel } from '../confidence';

interface LearningMomentCardProps {
    /** true = good choice, false = bad choice, null = neutral/unknown */
    correct: boolean | null;
    /** Scenario-authored feedback for the chosen option */
    feedback: string;
    /** The label of the choice the player made */
    choiceLabel?: string | null;
    /** Scenario-authored psychological trap for the chosen option */
    trap?: string | null;
    trustDelta?: number;
    /** Confidence the player stated before this decision (Phase 15). */
    confidence?: ConfidenceLevel | null;
    /** Seed for deterministic tip rotation (e.g. scene id) */
    tipSeed?: string;
    onDismiss?: () => void;
}

/**
 * Structured post-choice feedback: verdict → why → manipulation technique →
 * verification habit. Turns every interaction into a small lesson.
 */
export const LearningMomentCard = memo(function LearningMomentCard({
    correct,
    feedback,
    choiceLabel,
    trap,
    trustDelta = 0,
    confidence,
    tipSeed = '',
    onDismiss,
}: LearningMomentCardProps) {
    const [showTechnique, setShowTechnique] = useState(false);
    const technique = matchTechnique(trap);
    const manualArticle = articleForTechnique(technique?.key);
    const tip = tipForSeed(tipSeed || feedback);
    const calibration = confidence && correct !== null ? calibrationMoment(confidence, correct) : null;

    const verdict = correct === null
        ? { icon: <Info size={20} aria-hidden />, label: 'Noted', style: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' }
        : correct
            ? { icon: <CheckCircle2 size={20} aria-hidden />, label: 'Good call', style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' }
            : { icon: <XCircle size={20} aria-hidden />, label: 'Not quite', style: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' };

    return (
        <motion.section
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            aria-live="polite"
            aria-label="Learning moment"
            className="w-full rounded-2xl border border-border bg-card shadow-lg overflow-hidden"
        >
            {/* Verdict header */}
            <div className={cn('flex items-center gap-3 px-5 py-3 border-b', verdict.style)}>
                {verdict.icon}
                <span className="font-bold text-sm">{verdict.label}</span>
                {trustDelta !== 0 && (
                    <span className={cn(
                        'ml-auto text-xs font-black tabular-nums px-2 py-0.5 rounded-full',
                        trustDelta > 0 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/15 text-red-600 dark:text-red-400'
                    )}>
                        {trustDelta > 0 ? '+' : ''}{trustDelta} trust
                    </span>
                )}
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        aria-label="Dismiss learning moment"
                        className={cn('p-1 rounded-md hover:bg-foreground/10 transition-colors', trustDelta === 0 && 'ml-auto')}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <div className="p-5 space-y-4">
                {choiceLabel && (
                    <p className="text-xs text-muted-foreground">
                        You chose: <span className="font-semibold text-foreground">{choiceLabel}</span>
                    </p>
                )}

                {/* Why */}
                <p className="text-sm leading-relaxed text-foreground">{feedback}</p>

                {/* Manipulation technique involved */}
                {technique && (
                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 overflow-hidden">
                        <button
                            onClick={() => setShowTechnique(v => !v)}
                            aria-expanded={showTechnique}
                            className="w-full flex items-center gap-2 px-4 py-3 text-left"
                        >
                            <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" aria-hidden />
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                                Technique spotted: {technique.title}
                            </span>
                            <ChevronDown size={14} className={cn('ml-auto text-amber-600 transition-transform', showTechnique && 'rotate-180')} aria-hidden />
                        </button>
                        {showTechnique && (
                            <div className="px-4 pb-4 space-y-2 text-xs leading-relaxed text-foreground/80">
                                <p>{technique.description}</p>
                                <p><span className="font-bold">How to spot it:</span> {technique.howToSpot}</p>
                                <p className="text-muted-foreground italic">Example: {technique.example}</p>
                                {manualArticle && (
                                    <Link
                                        to={`/dashboard/manual?article=${manualArticle.id}`}
                                        className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
                                    >
                                        <BookOpen size={12} aria-hidden />
                                        Read more in the Field Manual: {manualArticle.title}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Confidence calibration coaching */}
                {calibration && (
                    <div className={cn(
                        'flex items-start gap-3 rounded-xl border px-4 py-3',
                        correct === false
                            ? 'border-red-500/25 bg-red-500/5'
                            : 'border-emerald-500/25 bg-emerald-500/5'
                    )}>
                        <Scale size={15} className={cn('mt-0.5 shrink-0', correct === false ? 'text-red-500' : 'text-emerald-500')} aria-hidden />
                        <p className="text-xs leading-relaxed text-foreground/80">
                            <span className="font-bold text-foreground">Calibration. </span>
                            {calibration}
                        </p>
                    </div>
                )}

                {/* Verification habit */}
                <div className="flex items-start gap-3 rounded-xl bg-muted/60 px-4 py-3">
                    <Lightbulb size={15} className="text-primary mt-0.5 shrink-0" aria-hidden />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        <span className="font-bold text-foreground">{tip.title}. </span>
                        {tip.tip}
                    </p>
                </div>
            </div>
        </motion.section>
    );
});
