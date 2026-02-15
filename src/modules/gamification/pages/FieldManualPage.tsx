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