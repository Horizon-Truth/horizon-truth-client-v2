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
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
                </>
            )}

            {/* Global Glitch Error Overlay */}
            {error && <GlitchError message={error} onRetry={clearError} />}

            {/* Mission hub */}
            {!activeProgress && !currentOutcome && (
                <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 relative z-10">
                    {/* Player identity card */}
                    <section
                        aria-label="Your profile and rank"
                        className="flex flex-col lg:flex-row gap-6 border border-border rounded-3xl p-6 bg-card shadow-sm animate-in fade-in slide-in-from-top-4 duration-500"
                    >
                        <div className="flex items-center gap-5 flex-1 min-w-0">
                            <div className="relative shrink-0">
                                <Avatar className="h-16 w-16 border-2 border-border">
                                    <AvatarImage src={user?.avatarUrl} alt="" />
                                    <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">
                                        {(user?.nickname || user?.fullName)?.[0]?.toUpperCase() || 'P'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute -bottom-1 -right-1 text-lg" aria-hidden>{rank.emoji}</span>
                            </div>
                            <div className="space-y-1.5 min-w-0">
                                <h1 className="text-xl font-black tracking-tight truncate">
                                    {user?.nickname || user?.fullName || 'Player'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold', rank.chip, rank.color)}>
                                        {rank.emoji} {rank.name}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground font-medium">Level {stats.level}</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{rank.tagline}</p>
                            </div>