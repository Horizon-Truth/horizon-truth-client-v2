import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game.store';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/shared/lib/utils';
import {
    ShieldCheck,
    Zap,
    Users,
    Trophy,
    LayoutDashboard,
    Activity,
    MessageSquare,
    LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { ScenarioList } from '../engine/components/ScenarioList';
import { GameSession } from '../engine/components/GameSession';
import { GameOutcome } from '../engine/components/GameOutcome';
import { BadgeAwardOverlay } from '../engine/components/play/BadgeAwardOverlay';
import { GlitchError } from '../engine/components/play/GlitchError';
import { Button } from '@/shared/components/ui/button';
import AddFeedbackModal from '../engine/components/AddFeedbackModal';

export default function GamePage() {
    const { stats, activeProgress, currentOutcome, error, clearError, fetchGameHistory, pendingBadges, removePendingBadge } = useGameStore();
    const { user, logout } = useAuthStore();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Ensure store is hydrated from localStorage before rendering
    useEffect(() => {
        setIsHydrated(true);
        fetchGameHistory();
    }, [fetchGameHistory]);

    if (!isHydrated) return null;

    return (
        <div className="flex flex-col min-h-full gap-6 sm:gap-8 p-4 sm:p-8 overflow-y-auto bg-background/50 selection:bg-primary/20 relative">
            {/* Ambient Background Dashboard */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Global Glitch Error Overlay */}
            {error && <GlitchError message={error} onRetry={clearError} />}

            {/* Standard Dashboard View (Scenario List) */}
            {!activeProgress && !currentOutcome && (
                <>
                    {/* User Profile Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/10 backdrop-blur-xl border border-white/5 rounded-3xl p-6 mb-2 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-5">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <Avatar className="h-16 w-16 border-2 border-background relative">
                                    <AvatarImage src={user?.avatarUrl} alt={user?.nickname || user?.fullName} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">
                                        {(user?.nickname || user?.fullName)?.[0]?.toUpperCase() || 'P'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-background" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-black tracking-tight">{user?.nickname || user?.fullName}</h2>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-primary/20 text-primary border border-primary/20 uppercase tracking-widest">
                                        Level {stats.level}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">Operational Pulse: <span className="text-blue-400">Stable</span></p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                            <Button
                                onClick={() => setIsFeedbackOpen(true)}
                                variant="ghost"
                                className="flex-1 sm:flex-none rounded-xl h-10 px-4 font-bold gap-2 text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
                            >
                                <MessageSquare size={18} />
                                <span className="text-xs">Feedback</span>
                            </Button>
                            <Button
                                onClick={() => logout()}
                                variant="ghost"
                                className="flex-1 sm:flex-none rounded-xl h-10 px-4 font-bold gap-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline text-xs">Log Out</span>
                            </Button>
                        </div>
                    </div>

                    {/* Stats Header */}
                    <header className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                        <StatCard
                            label="Protocol Trust"
                            value={`${stats.trustScore}%`}
                            icon={<ShieldCheck className="text-emerald-500 w-4 h-4 sm:w-6 sm:h-6" />}
                            progress={stats.trustScore}
                            color="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        />
                        <StatCard
                            label="Network Accuracy"
                            value={`${stats.accuracyRate}%`}
                            icon={<Activity className="text-indigo-500 w-4 h-4 sm:w-6 sm:h-6" />}
                            progress={stats.accuracyRate}
                            color="bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                        />
                        <StatCard
                            label="Operational Level"
                            value={`Lvl ${stats.level}`}
                            subValue={`${stats.experience} / ${stats.level * 100} XP`}
                            icon={<Zap className="text-amber-500 w-4 h-4 sm:w-6 sm:h-6" />}
                            progress={(stats.experience / (stats.level * 100)) * 100}
                            color="bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        />
                        <StatCard
                            label="Influencer Status"
                            value={stats.influence.toString()}
                            subValue="Nodes"
                            icon={<Users className="text-blue-500 w-4 h-4 sm:w-6 sm:h-6" />}
                        />
                        <StatCard
                            label="Missions Verified"
                            value={stats.missionsCompleted.toString()}
                            subValue="Verified"
                            icon={<Trophy className="text-purple-500 w-4 h-4 sm:w-6 sm:h-6" />}
                        />
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 flex gap-8 relative z-10">
                        <div className="flex-1 flex flex-col gap-6 bg-card/20 border border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-10 relative overflow-hidden backdrop-blur-3xl shadow-2xl isolation-isolate [transform:translateZ(0)] backface-visibility-hidden w-full max-w-6xl 2xl:max-w-7xl 3xl:max-w-[90rem] mx-auto">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                <LayoutDashboard size={240} />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 relative z-10 w-full">
                                <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-wider">Mission Command</h1>
                            </div>

                            <ScenarioList />
                        </div>
                    </main>
                </>
            )}

            {/* Immersive Full-Screen Game View */}
            {(activeProgress || currentOutcome) && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden animate-in fade-in duration-500">
                    {/* Background Ambient Glows */}
                    <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

                    <div className="flex-1 relative z-10 w-full h-full overflow-hidden flex flex-col">
                        {activeProgress && <GameSession />}
                        {currentOutcome && <GameOutcome />}
                    </div>
                </div>
            )}

            {/* Feedback Modal Overlay */}
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

            {/* Badge Award Overlay Global */}
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

function StatCard({ label, value, subValue, icon, progress, color }: { label: string, value: string, subValue?: string, icon: React.ReactNode, progress?: number, color?: string }) {
    return (
        <div className="bg-card/20 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 hover:bg-card/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <span className="text-[8px] sm:text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    {icon}
                </div>
            </div>
            <div className="space-y-1 sm:space-y-1.5">
                <h4 className="text-xl sm:text-4xl font-black tracking-tighter truncate">{value}</h4>
                {subValue && <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none truncate">{subValue}</p>}
            </div>
            {progress !== undefined && (
                <div className="mt-4 sm:mt-6 w-full h-1 sm:h-2 bg-white/5 rounded-full overflow-hidden p-[0.5px] sm:p-[1px]">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
