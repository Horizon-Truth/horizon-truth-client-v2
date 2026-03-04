import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game.store';
import { useAuthStore } from '@/store/auth.store';
import { useDevice } from '@/shared/hooks/useDevice';
import { cn } from '@/shared/lib/utils';
import {
    ShieldCheck,
    Target,
    Trophy,
    Flame,
    MessageSquare,
    Megaphone,
    LogOut,
    HelpCircle,
    BookOpen,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { ScenarioList } from '../engine/components/ScenarioList';
import { GameSession } from '../engine/components/GameSession';
import { GameOutcome } from '../engine/components/GameOutcome';
import { BadgeAwardOverlay } from '../engine/components/play/BadgeAwardOverlay';
import { GlitchError } from '../engine/components/play/GlitchError';
import { Button } from '@/shared/components/ui/button';
import AddFeedbackModal from '../engine/components/AddFeedbackModal';
import { useNavigate } from 'react-router-dom';
import { getRank, getNextRank, rankProgress, xpToNextRank } from '@/modules/gamification/progression';
import { HowToPlayDialog, hasSeenHowToPlay } from '@/modules/gamification/components/HowToPlayDialog';
import { SkillsPanel } from '@/modules/gamification/components/SkillsPanel';
import { DailyBriefing } from '@/modules/gamification/components/DailyBriefing';
import { MANUAL_ARTICLES, isArticleUnlocked } from '@/modules/gamification/encyclopedia';

export default function GamePage() {
    const { isLowEndDevice } = useDevice();
    const { stats, activeProgress, currentOutcome, error, clearError, fetchGameHistory, pendingBadges, removePendingBadge, currentStreak, skillBook, calibration } = useGameStore();
    const { user, logout } = useAuthStore();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const navigate = useNavigate();

    // Ensure store is hydrated from localStorage before rendering
    useEffect(() => {
        setIsHydrated(true);
        fetchGameHistory();
        if (!hasSeenHowToPlay()) setIsGuideOpen(true);
    }, [fetchGameHistory]);

    const rank = getRank(stats.experience);
    const nextRank = getNextRank(stats.experience);
    const rankPct = rankProgress(stats.experience);

    // Daily goal: complete 1 mission today
    const unlockedArticleCount = useMemo(() => {
        const snapshot = { missionsCompleted: stats.missionsCompleted, xp: stats.experience };
        return MANUAL_ARTICLES.filter(a => isArticleUnlocked(a, snapshot)).length;
    }, [stats.missionsCompleted, stats.experience]);

    if (!isHydrated) return null;

    return (
        <div className="flex flex-col min-h-full gap-6 p-4 sm:p-8 overflow-y-auto bg-background selection:bg-primary/20 relative">
            {/* Ambient background */}
            {!isLowEndDevice && (