import { useRef, useEffect, useState, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useGameStore } from '@/store/game.store';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/shared/lib/utils';
import {
    Loader2,
    ShieldCheck,
    AlertCircle,
    Bell,
    Trophy,
    TrendingUp,
    Zap,
    Clock,
    User,
    Maximize,
    Minimize,
    Eye,
    EyeOff,
    ShieldAlert
} from 'lucide-react';
import { SceneRenderer } from './play/SceneRenderer';
import { BadgeAwardOverlay } from './play/BadgeAwardOverlay';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Progress } from '@/shared/components/ui/progress';
import { TrustMeter } from './play/TrustMeter';

export function GameSession() {
    // Phase 16: Granular selectors to prevent broad rerenders
    const activeProgress = useGameStore(s => s.activeProgress);
    const stats = useGameStore(s => s.stats);
    const isLoading = useGameStore(s => s.isLoading);
    const error = useGameStore(s => s.error);
    const pendingBadges = useGameStore(s => s.pendingBadges);
    const submitChoice = useGameStore(s => s.submitChoice);
    const removePendingBadge = useGameStore(s => s.removePendingBadge);

    const { user } = useAuthStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Phase 17: Navigation Guard (Sticky History)
    useEffect(() => {
        // Create an initial barrier
        window.history.pushState(null, '', window.location.href);

        const handlePopState = (_e: PopStateEvent) => {
            // Force state back to prevent navigation
            window.history.pushState(null, '', window.location.href);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []); // Empty dependency array ensures it persists throughout the game session

    // Unload Protection
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (activeProgress) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [activeProgress]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Error attempting to toggle fullscreen:', err);
        }
    };

    // Keyboard Hotkeys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeProgress) return;
            const key = parseInt(e.key);
            if (key >= 1 && key <= activeProgress.currentScene.availableChoices.length) {
                if (!isLoading) {
                    handleChoice(activeProgress.currentScene.availableChoices[key - 1]);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeProgress, isLoading]);

    // Emotional Feedback State
    const [prevTrust, setPrevTrust] = useState(stats.trustScore);
    const [trustPulse, setTrustPulse] = useState<'none' | 'increase' | 'decrease'>('none');

    useEffect(() => {
        if (stats.trustScore !== prevTrust) {
            setTrustPulse(stats.trustScore > prevTrust ? 'increase' : 'decrease');
            setPrevTrust(stats.trustScore);
            const timer = setTimeout(() => setTrustPulse('none'), 2000);
            return () => clearTimeout(timer);
        }
    }, [stats.trustScore, prevTrust]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeProgress?.currentScene.id]);

    if (!activeProgress) return null;

    const { currentScene } = activeProgress;

    const handleChoice = (choiceKey: string) => {
        submitChoice(currentScene.id, choiceKey);
    };

    return (
        <div
            ref={containerRef}
            className="flex h-screen bg-[#0B0E11] text-white overflow-hidden font-sans selection:bg-primary/30"
        >
            {/* 1. Left Sidebar - Profile & Stats */}
            <aside className={cn(
                "w-[300px] border-r border-white/5 flex flex-col pt-8 bg-[#0B0E11]/80 backdrop-blur-xl transition-all duration-500",
                (isFullscreen || isFocusMode) ? "w-0 opacity-0 -translate-x-full overflow-hidden border-none" : "flex hidden md:flex",
                shouldReduceMotion && "transition-none"
            )}>
                <div className="px-6 space-y-8">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                            <Avatar className="w-20 h-20 border-2 border-[#0B0E11] relative z-10">
                                <AvatarImage src={user?.avatarUrl} />
                                <AvatarFallback className="bg-[#1A1D21] text-xl font-black">{user?.fullName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-[#0B0E11] rounded-full z-20" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg font-black tracking-tight">{user?.fullName || 'Operative'}</h2>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">@{user?.username || 'user_hzn'}</p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="space-y-8 pt-4 flex flex-col items-center">
                        <div className={cn(
                            "relative transition-all duration-500",
                            trustPulse === 'increase' && "scale-[1.05]",
                            trustPulse === 'decrease' && "scale-[0.95] opacity-80"
                        )}>
                            <TrustMeter score={stats.trustScore} size={160} strokeWidth={10} />

                            {/* Floating Protocol Icon on change */}
                            <AnimatePresence>
                                {trustPulse !== 'none' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.5 }}
                                        animate={{ opacity: 1, y: -40, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={cn(
                                            "absolute -right-4 top-0",
                                            trustPulse === 'increase' ? "text-emerald-400" : "text-red-400"
                                        )}
                                    >
                                        <div className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-2xl">
                                            {trustPulse === 'increase' ?
                                                <ShieldCheck size={24} className="animate-bounce" /> :
                                                <ShieldAlert size={24} className="animate-pulse" />
                                            }
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                    <Zap size={18} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-wider">Level</span>
                            </div>
                            <span className="text-xl font-black italic">Lvl {stats.level}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                    <TrendingUp size={18} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-wider">Influence</span>
                            </div>
                            <span className="text-xl font-black italic">{stats.influence}</span>
                        </div>
                    </div>

                    {/* Navigation Mini */}
                    <nav className="space-y-1 pt-4">
                        <NavItem icon={<User size={18} />} label="Profile Info" active />
                        <NavItem icon={<Trophy size={18} />} label="Achievements" />
                        <NavItem icon={<AlertCircle size={18} />} label="Security Brief" />
                    </nav>
                </div>
            </aside>

            {/* 2. Main Feed - Scene Content */}
            <main className="flex-1 flex flex-col relative bg-gradient-to-b from-[#0F1216] to-[#0B0E11]">
                {/* Header */}
                <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <span className="font-black italic tracking-tighter text-lg uppercase text-primary">Mission Feed</span>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-xs font-bold text-muted-foreground truncate max-w-[200px]">{activeProgress.scenarioTitle}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
                            <button
                                onClick={() => setIsFocusMode(!isFocusMode)}
                                className={cn(
                                    "p-2 rounded-lg transition-all duration-300",
                                    isFocusMode ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                                title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                            >
                                {isFocusMode ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white transition-all duration-300"
                                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                            >
                                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Encrypted Stream</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 custom-scrollbar flex flex-col items-center"
                >
                    <div className={cn(
                        "w-full space-y-12 pb-32 transition-all duration-500",
                        (isFullscreen || isFocusMode) ? "max-w-3xl" : "max-w-xl"
                    )}>
                        {/* Dynamic Scene Content */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock size={14} className="text-muted-foreground" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Intercepted {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <SceneRenderer
                                scene={currentScene}
                                onChoice={handleChoice}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Error Handling */}
                        {error && (
                            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-4 animate-in shake-in">
                                <AlertCircle size={24} />
                                {error}
                            </div>
                        )}

                        {/* Choices / Actions - Only show if not handled natively by the scene */}
                        {(() => {
                            const contentType = (currentScene as any).contentType || (currentScene as any).content?.contentType;
                            return !['CHAT', 'TEXT', 'FEED'].includes(contentType);
                        })() && (
                                <div className="space-y-6 pt-8 border-t border-white/5">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Response Node</span>
                                        <span className="text-[10px] font-mono text-muted-foreground opacity-40">PHASE_{currentScene.order}</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {currentScene.availableChoices.map((choice, index) => (
                                            <button
                                                key={choice}
                                                disabled={isLoading}
                                                onClick={() => handleChoice(choice)}
                                                className={cn(
                                                    "group p-5 text-left rounded-2xl border transition-all duration-300 relative overflow-hidden",
                                                    "bg-white/5 border-white/5 hover:border-primary/40 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(var(--primary),0.05)]",
                                                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                                                    isLoading && "opacity-50 cursor-not-allowed grayscale"
                                                )}
                                            >
                                                <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-black text-primary/40 leading-none">[{index + 1}]</span>
                                                            <span className="font-bold text-lg group-hover:text-primary transition-colors">{choice}</span>
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">System Directive Alpha</p>
                                                    </div>
                                                    {isLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                    ) : (
                                                        <ShieldCheck size={20} className="text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </main>

            {/* 3. Right Panel - Notifications & Intel */}
            <aside className={cn(
                "w-[350px] border-l border-white/5 flex flex-col bg-[#0B0E11]/80 backdrop-blur-xl transition-all duration-500",
                (isFullscreen || isFocusMode) ? "w-0 opacity-0 translate-x-full overflow-hidden border-none" : "flex hidden lg:flex"
            )}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Bell size={18} className="text-primary" />
                            <h3 className="font-black text-xs tracking-widest uppercase">Global Intel</h3>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        <NotificationCard
                            icon={<Zap size={14} />}
                            title="New Potential Threat"
                            desc="Anomaly detected in Sector 7 social feed. Analyzing patterns."
                            time="2m ago"
                        />
                        <NotificationCard
                            icon={<Trophy size={14} />}
                            title="Badge Earned"
                            desc="You've unlocked: First Response Protocol."
                            time="15m ago"
                            highlight
                        />
                        <NotificationCard
                            icon={<AlertCircle size={14} />}
                            title="System Note"
                            desc="Encryption keys rotated. Connection is highly secure."
                            time="1h ago"
                        />

                        <div className="pt-8 space-y-4 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Active Nodes</h4>
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase">
                                    <span>Node Strength</span>
                                    <span className="text-primary">84%</span>
                                </div>
                                <Progress value={84} className="h-1 bg-primary/20" indicatorClassName="bg-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
                        <p className="text-xs font-bold leading-relaxed">
                            "Truth is the most valuable currency in the digital age. Spend it wisely."
                        </p>
                    </div>
                </div>
            </aside>

            {/* 4. Badge Award Overlay */}
            <AnimatePresence>
                {pendingBadges.length > 0 && (
                    <BadgeAwardOverlay
                        key={pendingBadges[0].id}
                        badge={pendingBadges[0]}
                        onClose={() => removePendingBadge(pendingBadges[0].id)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

const NavItem = memo(({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => {
    return (
        <div className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group",
            active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-white"
        )}>
            {icon}
            <span className="text-xs font-black uppercase tracking-wider">{label}</span>
        </div>
    );
});
NavItem.displayName = 'NavItem';

const NotificationCard = memo(({ icon, title, desc, time, highlight = false }: { icon: React.ReactNode, title: string, desc: string, time: string, highlight?: boolean }) => {
    return (
        <div className={cn(
            "p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02]",
            highlight ? "bg-primary/10 border-primary/20" : "bg-white/5 border-white/5"
        )}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", highlight ? "bg-primary text-white" : "bg-white/10 text-muted-foreground")}>
                        {icon}
                    </div>
                    <span className="font-bold text-xs truncate max-w-[150px]">{title}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{time}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    );
});
NotificationCard.displayName = 'NotificationCard';
