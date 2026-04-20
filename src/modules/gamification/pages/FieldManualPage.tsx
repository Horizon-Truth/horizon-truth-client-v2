import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Lock, BookOpen, CheckCircle2, Eye, Wrench, X } from 'lucide-react';
import { useGameStore } from '@/store/game.store';
import {
    MANUAL_ARTICLES,
    MANUAL_CATEGORIES,
    isArticleUnlocked,
    unlockRequirementLabel,
} from '../encyclopedia';
import type { ManualCategory } from '../encyclopedia';

/**
 * Phase 6 — the Field Manual: an unlockable knowledge encyclopedia.
 * Articles unlock with mission/XP progress; learning moments deep-link here
 * via /dashboard/manual?article=<id>.
 */
export default function FieldManualPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const stats = useGameStore(s => s.stats);
    const [category, setCategory] = useState<ManualCategory | 'all'>('all');

    const snapshot = { missionsCompleted: stats.missionsCompleted, xp: stats.experience };
    const unlockedCount = useMemo(
        () => MANUAL_ARTICLES.filter(a => isArticleUnlocked(a, snapshot)).length,
        [snapshot.missionsCompleted, snapshot.xp]
    );

    const openId = searchParams.get('article');
    const openArticle = openId ? MANUAL_ARTICLES.find(a => a.id === openId) ?? null : null;
    const openUnlocked = openArticle ? isArticleUnlocked(openArticle, snapshot) : false;

    const closeArticle = () => setSearchParams({}, { replace: true });

    // Escape closes the open article.
    useEffect(() => {
        if (!openArticle) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeArticle(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openArticle?.id]);

    const visible = MANUAL_ARTICLES.filter(a => category === 'all' || a.category === category);

    return (
        <div className="min-h-full bg-background text-foreground overflow-y-auto p-4 sm:p-8">
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
                {/* Header */}
                <header className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/dashboard/game')}
                            className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft size={16} aria-hidden /> Back to missions
                        </Button>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                        {unlockedCount} / {MANUAL_ARTICLES.length} entries unlocked
                    </span>
                </header>

                <section className="border border-border rounded-3xl p-6 sm:p-8 bg-card shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <BookOpen size={22} aria-hidden />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Field Manual</h1>
                            <p className="text-sm text-muted-foreground">
                                Everything you've learned in the field, collected. New entries unlock as you complete missions.
                            </p>
                        </div>
                    </div>

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-2 pt-2" role="group" aria-label="Filter by category">
                        <CategoryChip active={category === 'all'} onClick={() => setCategory('all')} label="All" emoji="📚" />
                        {(Object.keys(MANUAL_CATEGORIES) as ManualCategory[]).map(key => (
                            <CategoryChip
                                key={key}
                                active={category === key}
                                onClick={() => setCategory(key)}
                                label={MANUAL_CATEGORIES[key].name}
                                emoji={MANUAL_CATEGORIES[key].emoji}
                            />
                        ))}
                    </div>
                </section>

                {/* Article grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
                    {visible.map(article => {
                        const unlocked = isArticleUnlocked(article, snapshot);
                        const cat = MANUAL_CATEGORIES[article.category];
                        return (
                            <button
                                key={article.id}
                                onClick={() => unlocked && setSearchParams({ article: article.id }, { replace: true })}
                                disabled={!unlocked}
                                aria-label={unlocked ? `Read ${article.title}` : `${article.title} — ${unlockRequirementLabel(article)}`}
                                className={cn(
                                    'text-left rounded-3xl border p-5 transition-all duration-200 flex flex-col gap-3 min-h-[150px]',
                                    unlocked
                                        ? 'bg-card border-border hover:border-primary/40 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'
                                        : 'bg-muted/40 border-border opacity-70 cursor-not-allowed'
                                )}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span aria-hidden>{cat.emoji}</span> {cat.name}
                                    </span>
                                    {unlocked
                                        ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" aria-hidden />
                                        : <Lock size={16} className="text-muted-foreground shrink-0" aria-hidden />}
                                </div>
                                <div className="space-y-1">
                                    <h2 className={cn('font-black tracking-tight leading-snug', !unlocked && 'text-muted-foreground')}>
                                        {article.title}
                                    </h2>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {unlocked ? article.tagline : unlockRequirementLabel(article)}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Article reader */}
            <AnimatePresence>
                {openArticle && openUnlocked && (
                    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6">
                        <div
                            className="absolute inset-0 bg-background/85 backdrop-blur-sm animate-in fade-in duration-200"
                            onClick={closeArticle}
                            aria-hidden
                        />
                        <motion.article
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 24 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            role="dialog"
                            aria-modal="true"
                            aria-label={openArticle.title}
                            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-t-3xl sm:rounded-3xl border border-border bg-card shadow-2xl"
                        >
                            <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-start justify-between gap-4 z-10">
                                <div className="space-y-1 min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {MANUAL_CATEGORIES[openArticle.category].emoji} {MANUAL_CATEGORIES[openArticle.category].name}
                                    </p>
                                    <h2 className="text-xl font-black tracking-tight leading-snug">{openArticle.title}</h2>
                                    <p className="text-xs text-muted-foreground italic">{openArticle.tagline}</p>
                                </div>
                                <button
                                    onClick={closeArticle}
                                    aria-label="Close article"
                                    className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                                >
                                    <X size={18} aria-hidden />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    {openArticle.body.map((paragraph, i) => (
                                        <p key={i} className="text-sm leading-relaxed text-foreground/90">{paragraph}</p>
                                    ))}
                                </div>

                                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                                        <Eye size={13} aria-hidden /> How to spot it
                                    </p>
                                    <ul className="space-y-2">
                                        {openArticle.howToSpot.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/85">
                                                <CheckCircle2 size={13} className="text-primary mt-0.5 shrink-0" aria-hidden />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-2xl bg-muted/60 p-5 space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">In the real world</p>
                                    <p className="text-xs leading-relaxed text-foreground/85">{openArticle.realWorld}</p>
                                </div>

                                {openArticle.verifyWith && openArticle.verifyWith.length > 0 && (
                                    <div className="rounded-2xl border border-border p-5 space-y-3">
                                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <Wrench size={13} aria-hidden /> Verify with
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {openArticle.verifyWith.map((tool, i) => (
                                                <span key={i} className="px-3 py-1.5 rounded-full bg-muted text-xs font-semibold text-foreground/85">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.article>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CategoryChip({ active, onClick, label, emoji }: { active: boolean; onClick: () => void; label: string; emoji: string }) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors',
                active
                    ? 'bg-primary/15 border-primary/40 text-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            )}
        >
            <span aria-hidden>{emoji}</span> {label}
        </button>
    );
}
