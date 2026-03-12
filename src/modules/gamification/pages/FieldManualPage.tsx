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