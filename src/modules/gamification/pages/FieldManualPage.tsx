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