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
                        </div>

                        {/* Rank progress */}
                        <div className="flex-1 flex flex-col justify-center gap-2 lg:max-w-sm">
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-muted-foreground">{stats.experience.toLocaleString()} XP</span>
                                {nextRank ? (
                                    <span className={nextRank.color}>
                                        {xpToNextRank(stats.experience).toLocaleString()} XP to {nextRank.emoji} {nextRank.name}
                                    </span>
                                ) : (
                                    <span className={rank.color}>Max rank reached</span>
                                )}
                            </div>
                            <div
                                className="w-full h-3 bg-muted rounded-full overflow-hidden"
                                role="progressbar"
                                aria-valuenow={rankPct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={nextRank ? `Progress towards ${nextRank.name}` : 'Rank progress'}
                            >
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                                    style={{ width: `${rankPct}%` }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                            <div className="flex items-center gap-1">
                                <Button
                                    onClick={() => navigate('/dashboard/manual')}
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl font-bold gap-2 text-primary hover:text-primary hover:bg-primary/10"
                                >
                                    <BookOpen size={16} aria-hidden /> Field Manual
                                    <span className="px-1.5 py-0.5 rounded-md bg-primary/15 text-[10px] font-black tabular-nums">
                                        {unlockedArticleCount}/{MANUAL_ARTICLES.length}
                                    </span>
                                </Button>
                                <Button
                                    onClick={() => setIsGuideOpen(true)}
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-foreground"
                                >
                                    <HelpCircle size={16} aria-hidden /> How to play
                                </Button>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    onClick={() => setIsFeedbackOpen(true)}
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-foreground"
                                >
                                    <MessageSquare size={15} aria-hidden /> Feedback
                                </Button>
                                <Button
                                    onClick={() => navigate('/crowdsourcing/submit')}
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Megaphone size={15} aria-hidden /> Report misinfo
                                </Button>
                                <Button
                                    onClick={() => logout()}
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Log out"
                                    className="rounded-xl font-bold gap-2 text-red-500/80 hover:text-red-500 hover:bg-red-500/10"
                                >
                                    <LogOut size={15} aria-hidden />
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section aria-label="Your stats" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                        <StatCard
                            label="Trust Score"
                            hint="How much the community trusts your judgment"
                            value={`${stats.trustScore}%`}
                            icon={<ShieldCheck className="text-emerald-500" size={20} aria-hidden />}
                            progress={stats.trustScore}
                            barClass="bg-emerald-500"
                        />
                        <StatCard
                            label="Accuracy"
                            hint="How often you make the best call"
                            value={`${stats.accuracyRate}%`}
                            icon={<Target className="text-indigo-500" size={20} aria-hidden />}
                            progress={stats.accuracyRate}
                            barClass="bg-indigo-500"
                        />
                        <StatCard
                            label="Missions Completed"
                            hint="Scenarios you've finished"
                            value={stats.missionsCompleted.toString()}
                            icon={<Trophy className="text-purple-500" size={20} aria-hidden />}
                        />
                        <StatCard
                            label="Day Streak"
                            hint={currentStreak > 0 ? 'Keep it going — play daily!' : 'Play today to start a streak'}
                            value={currentStreak > 0 ? `${currentStreak} 🔥` : '—'}
                            icon={<Flame className="text-orange-500" size={20} aria-hidden />}
                        />
                    </section>

                    {/* Today's briefing + skill graph */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <DailyBriefing />
                        <SkillsPanel skillBook={skillBook} calibration={calibration} />
                    </div>

                    {/* Learning path */}
                    <main className="border border-border rounded-3xl p-4 sm:p-10 bg-card shadow-sm relative overflow-hidden">
                        <ScenarioList />
                    </main>
                </div>
            )}

            {/* Immersive full-screen game view */}
            {(activeProgress || currentOutcome) && (
                <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden animate-in fade-in duration-500">
                    {!isLowEndDevice && (
                        <>
                            <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
                        </>
                    )}

                    <div className="flex-1 relative z-10 w-full h-full overflow-hidden flex flex-col">
                        {activeProgress && <GameSession />}
                        {currentOutcome && <GameOutcome />}
                    </div>
                </div>
            )}

            {/* Feedback modal */}
            {isFeedbackOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/90 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsFeedbackOpen(false)}
                    />
                    <div className="relative z-[210] w-full max-w-lg">
                        <AddFeedbackModal
                            onSuccess={() => setIsFeedbackOpen(false)}
                            onCancel={() => setIsFeedbackOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* How to play guide */}
            <HowToPlayDialog open={isGuideOpen} onOpenChange={setIsGuideOpen} />

            {/* Badge award overlay */}
            <AnimatePresence>
                {pendingBadges && pendingBadges.length > 0 && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
                        <div className="pointer-events-auto">
                            <BadgeAwardOverlay
                                key={pendingBadges[0].id || pendingBadges[0].badgeCode}
                                badge={pendingBadges[0]}
                                onClose={() => removePendingBadge(pendingBadges[0].id)}
                            />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ label, hint, value, icon, progress, barClass }: {
    label: string;
    hint: string;
    value: string;
    icon: React.ReactNode;
    progress?: number;
    barClass?: string;
}) {
    return (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate pr-2">{label}</span>
                <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center shrink-0">
                    {icon}
                </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight tabular-nums">{value}</p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{hint}</p>
            {progress !== undefined && (
                <div className="mt-3 w-full h-1.5 bg-muted rounded-full overflow-hidden" aria-hidden>
                    <div
                        className={cn('h-full rounded-full transition-all duration-1000 ease-out', barClass)}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                </div>
            )}
        </div>
    );
}
