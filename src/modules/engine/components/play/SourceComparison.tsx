import React, { memo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, ChevronDown, Scale, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { useGameStore } from '@/store/game.store';
import { telemetryService } from '@/services/telemetry.service';

/**
 * Phase 10 challenge — source comparison.
 *
 * The same event as reported by several sources, side by side. Each card can
 * be examined for credibility signals before the player answers via the
 * scene's normal choices (rendered by GameSession). Examinations are tracked
 * as verification telemetry.
 *
 * scene.content contract:
 * {
 *   prompt?: string,
 *   sources: [{
 *     name: string, handle?: string, avatarUrl?: string,
 *     verified?: boolean, timestamp?: string,
 *     headline: string, excerpt?: string,
 *     signals?: { label: string; detail: string; suspicious?: boolean }[]
 *   }]
 * }
 */

interface SourceComparisonProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

interface SourceCard {
    name: string;
    handle?: string;
    avatarUrl?: string;
    verified?: boolean;
    timestamp?: string;
    headline: string;
    excerpt?: string;
    signals?: { label: string; detail: string; suspicious?: boolean }[];
}

export const SourceComparison: React.FC<SourceComparisonProps> = memo(({ scene }) => {
    const shouldReduceMotion = useReducedMotion();
    const { activeProgress } = useGameStore();
    const content = scene.content ?? {};
    const sources: SourceCard[] = Array.isArray(content.sources) ? content.sources : [];
    const [examined, setExamined] = useState<Set<number>>(new Set());
    const clicks = useRef(0);

    const toggleExamine = (i: number) => {
        setExamined(prev => {
            const next = new Set(prev);
            if (next.has(i)) {
                next.delete(i);
            } else {
                next.add(i);
                clicks.current += 1;
                if (activeProgress?.id && scene.id) {
                    telemetryService.trackVerification(activeProgress.id, scene.id, {
                        source_button_clicked_count: clicks.current,
                        profile_checked: true,
                    });
                }
            }
            return next;
        });
    };

    if (sources.length === 0) {
        return (
            <div className="p-8 rounded-3xl bg-card border border-border">
                <p className="text-sm text-muted-foreground italic">{scene.description}</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.5 }}
            className="w-full space-y-4"
        >
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15">
                <Scale size={16} className="text-primary mt-0.5 shrink-0" aria-hidden />
                <p className="text-sm font-semibold leading-relaxed">
                    {content.prompt || 'Several sources are covering the same story. Examine each before you decide who to trust.'}
                </p>
            </div>

            <div className={cn('grid grid-cols-1 gap-4', sources.length > 1 && 'md:grid-cols-2')}>
                {sources.map((source, i) => {
                    const open = examined.has(i);
                    return (
                        <motion.article
                            key={i}
                            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: shouldReduceMotion ? 0 : 0.15 + i * 0.12 }}
                            className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col"
                            aria-label={`Source: ${source.name}`}
                        >
                            {/* Source identity */}
                            <div className="flex items-center gap-3 px-5 pt-4">
                                <Avatar className="w-10 h-10 border border-border shrink-0">
                                    {source.avatarUrl && <AvatarImage src={source.avatarUrl} alt="" />}
                                    <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                                        {source.name?.[0]?.toUpperCase() ?? '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="font-bold text-sm flex items-center gap-1.5 truncate">
                                        {source.name}
                                        {source.verified && <BadgeCheck size={14} className="text-sky-500 shrink-0" aria-label="Verified account" />}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                                        {source.handle && <span className="truncate">{source.handle}</span>}
                                        {source.timestamp && (
                                            <span className="flex items-center gap-1 shrink-0"><Clock size={10} aria-hidden />{source.timestamp}</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Reporting */}
                            <div className="px-5 py-4 space-y-2 flex-1">
                                <h3 className="font-black leading-snug">{source.headline}</h3>
                                {source.excerpt && (
                                    <p className="text-sm text-muted-foreground leading-relaxed">{source.excerpt}</p>
                                )}
                            </div>

                            {/* Examination */}
                            {source.signals && source.signals.length > 0 && (
                                <div className="border-t border-border">
                                    <button
                                        onClick={() => toggleExamine(i)}
                                        aria-expanded={open}
                                        className="w-full flex items-center gap-2 px-5 py-3 text-left text-xs font-bold text-primary hover:bg-primary/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                                    >
                                        <Scale size={13} aria-hidden />
                                        {open ? 'Hide credibility check' : 'Examine this source'}
                                        <ChevronDown size={13} className={cn('ml-auto transition-transform', open && 'rotate-180')} aria-hidden />
                                    </button>
                                    {open && (
                                        <ul className="px-5 pb-4 space-y-2.5">
                                            {source.signals.map((signal, j) => (
                                                <li key={j} className="flex items-start gap-2.5 text-xs leading-relaxed">
                                                    {signal.suspicious
                                                        ? <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" aria-hidden />
                                                        : <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" aria-hidden />}
                                                    <span>
                                                        <span className="font-bold">{signal.label}.</span>{' '}
                                                        <span className="text-muted-foreground">{signal.detail}</span>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </motion.article>
                    );
                })}
            </div>
        </motion.div>
    );
});

SourceComparison.displayName = 'SourceComparison';
