import { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import { CONFIDENCE_OPTIONS } from '../confidence';
import type { ConfidenceLevel } from '../confidence';

interface ConfidenceCheckProps {
    /** The choice the player just picked, awaiting confirmation. */
    choiceLabel: string;
    onSelect: (level: ConfidenceLevel) => void;
    onCancel: () => void;
}

/**
 * Phase 15 — confidence elicitation. Shown after the player picks a choice
 * and before it is submitted, so every decision carries a self-assessment.
 * Keys 1–3 select, Escape cancels back to the choices.
 */
export const ConfidenceCheck = memo(function ConfidenceCheck({ choiceLabel, onSelect, onCancel }: ConfidenceCheckProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === 'Escape') {
                e.stopPropagation();
                onCancel();
                return;
            }
            const key = parseInt(e.key);
            if (key >= 1 && key <= CONFIDENCE_OPTIONS.length) {
                e.stopPropagation();
                onSelect(CONFIDENCE_OPTIONS[key - 1].level);
            }
        };
        // Capture phase so the game's own 1–9 choice hotkeys never see these keys.
        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [onSelect, onCancel]);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/85 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onCancel}
                aria-hidden
            />
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                role="dialog"
                aria-modal="true"
                aria-label="How confident are you?"
                className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl overflow-hidden"
            >
                <div className="flex items-start justify-between gap-3 px-6 pt-6">
                    <div className="space-y-1">
                        <h2 className="text-lg font-black tracking-tight">How confident are you?</h2>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            You chose: <span className="font-semibold text-foreground">{choiceLabel}</span>
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        aria-label="Go back to choices"
                        className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <X size={16} aria-hidden />
                    </button>
                </div>

                <div className="p-6 space-y-3">
                    {CONFIDENCE_OPTIONS.map((option, index) => (
                        <button
                            key={option.key}
                            onClick={() => onSelect(option.level)}
                            className={cn(
                                'w-full group flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.99]',
                                'bg-card border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md',
                                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'
                            )}
                        >
                            <span className="text-2xl shrink-0" aria-hidden>{option.emoji}</span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-bold text-sm group-hover:text-primary transition-colors">{option.label}</span>
                                <span className="block text-xs text-muted-foreground">{option.hint}</span>
                            </span>
                            <span
                                className="w-6 h-6 shrink-0 rounded-md bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary text-xs font-black flex items-center justify-center transition-colors"
                                aria-hidden
                            >
                                {index + 1}
                            </span>
                        </button>
                    ))}

                    <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 text-center">
                        Knowing <span className="font-semibold text-foreground">when</span> to trust your judgment is a skill —
                        we track your confidence against your accuracy to help you build it.
                    </p>
                </div>
            </motion.div>
        </div>
    );
});
