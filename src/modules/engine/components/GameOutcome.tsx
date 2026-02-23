import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Trophy, LayoutDashboard, ShieldCheck, Activity, Target, TrendingDown, Shield, Globe, Sparkles, BookOpen, Brain, GraduationCap, Lightbulb, Users, Share2, ShieldAlert } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { InvestigationReveal } from './play/InvestigationReveal';
import PlayerFeedbackModal from './play/PlayerFeedbackModal';
import { motion } from 'framer-motion';
import { engineService } from '@/services/engine.service';
import type { Scenario } from '@/services/engine.service';
import { getRank, getNextRank, rankProgress, xpToNextRank } from '@/modules/gamification/progression';
import { Confetti } from '@/modules/gamification/components/Confetti';
import { tipForSeed } from '@/modules/gamification/learning-content';
import { hasImpact, impactVerdict, formatPeople } from '@/modules/gamification/impact';

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