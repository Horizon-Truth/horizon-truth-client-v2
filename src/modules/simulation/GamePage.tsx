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
import { ScenarioList } from '../engine/components/ScenarioList';
import { GameSession } from '../engine/components/GameSession';
import { GameOutcome } from '../engine/components/GameOutcome';
import { BadgeAwardOverlay } from '../engine/components/play/BadgeAwardOverlay';
import { GlitchError } from '../engine/components/play/GlitchError';
import { Button } from '@/shared/components/ui/button';
import AddFeedbackModal from '../engine/components/AddFeedbackModal';

export default function GamePage() {
    const { stats, activeProgress, currentOutcome, error, clearError, fetchGameHistory, pendingBadges, removePendingBadge } = useGameStore();
    const { logout } = useAuthStore();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Ensure store is hydrated from localStorage before rendering
    useEffect(() => {
        setIsHydrated(true);
        fetchGameHistory();
    }, [fetchGameHistory]);

    if (!isHydrated) return null;

    return (
        <div className="flex flex-col min-h-full gap-6 sm:gap-8 p-4 sm:p-8 overflow-y-auto bg-background/50 selection:bg-primary/20">
            {/* Global Glitch Error Overlay */}
            {error && <GlitchError message={error} onRetry={clearError} />}

            {/* Standard Dashboard View (Scenario List) */}
            {!activeProgress && !currentOutcome && (
                <>
                    {/* Stats Header */}
                    <header className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                        <StatCard
                            label="Protocol Trust"
                            value={`${stats.trustScore}%`}
                            icon={<ShieldCheck className="text-emerald-500" />}
                            progress={stats.trustScore}
                            color="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        />
                        <StatCard
                            label="Network Accuracy"
                            value={`${stats.accuracyRate}%`}
                            icon={<Activity className="text-indigo-500" />}
                            progress={stats.accuracyRate}
                            color="bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                        />
                        <StatCard
                            label="Operational Level"
                            value={`Lvl ${stats.level}`}
                            subValue={`${stats.experience} / ${stats.level * 100} XP`}
                            icon={<Zap className="text-amber-500" />}
                            progress={(stats.experience / (stats.level * 100)) * 100}
                            color="bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        />
                        <StatCard
                            label="Influencer Status"
                            value={stats.influence.toString()}
                            subValue="Network nodes"
                            icon={<Users className="text-blue-500" />}
                        />
                        <StatCard
                            label="Missions Verified"
                            value={stats.missionsCompleted.toString()}
                            subValue="Completed tasks"
                            icon={<Trophy className="text-purple-500" />}
                        />
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 flex gap-8">
                        <div className="flex-1 flex flex-col gap-6 bg-card/20 border border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-10 relative overflow-hidden backdrop-blur-2xl shadow-2xl isolation-isolate [transform:translateZ(0)] backface-visibility-hidden w-full max-w-6xl mx-auto">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                <LayoutDashboard size={240} />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 relative z-10 w-full">
                                <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-wider">Mission Command</h1>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <Button
                                        onClick={() => setIsFeedbackOpen(true)}
                                        className="w-full sm:w-auto rounded-xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-indigo-500 hover:bg-indigo-600"
                                    >
                                        <MessageSquare size={20} />
                                        Give Feedback
                                    </Button>
                                    <Button
                                        onClick={() => logout()}
                                        variant="outline"
                                        className="w-full sm:w-auto rounded-xl h-12 px-6 font-bold gap-2 border-red-500/20 hover:bg-red-500/10 hover:text-red-400 text-red-500 transition-all"
                                    >
                                        <LogOut size={20} />
                                        Log Out
                                    </Button>
                                </div>
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
        <div className="bg-card/20 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 hover:bg-card/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    {icon}
                </div>
            </div>
            <div className="space-y-1.5">
                <h4 className="text-2xl sm:text-4xl font-black tracking-tighter">{value}</h4>
                {subValue && <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{subValue}</p>}
            </div>
            {progress !== undefined && (
                <div className="mt-6 w-full h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
