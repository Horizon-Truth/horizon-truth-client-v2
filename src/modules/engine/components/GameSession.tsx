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
    ShieldAlert,
    Flame,
    Star,
} from 'lucide-react';
import { SceneRenderer } from './play/SceneRenderer';
import { SpreadSimulationOverlay } from './play/SpreadSimulationOverlay';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Progress } from '@/shared/components/ui/progress';
import { TrustMeter } from './play/TrustMeter';

export function GameSession() {
    // Phase 16: Granular selectors to prevent broad rerenders
    const activeProgress = useGameStore(s => s.activeProgress);
    const stats = useGameStore(s => s.stats);
    const isLoading = useGameStore(s => s.isLoading);
    const error = useGameStore(s => s.error);
    const submitChoice = useGameStore(s => s.submitChoice);
    const lastSpreadSimulation = useGameStore(s => s.lastSpreadSimulation);
    const lastChoiceLabel = useGameStore(s => s.lastChoiceLabel);
    const clearSpreadSimulation = useGameStore(s => s.clearSpreadSimulation);
    const reputationRole = useGameStore(s => s.reputationRole);
    const currentStreak = useGameStore(s => s.currentStreak);

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

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // When scene changes, reset timer
    useEffect(() => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        const limit = activeProgress?.currentScene?.decisionTimeLimit;
        if (limit && limit > 0) {
            setTimeLeft(limit);
            countdownRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(countdownRef.current!);
                        // Auto-submit worst choice (first one)
                        const choices = activeProgress?.currentScene?.availableChoices;
                        if (choices && choices.length > 0 && !isLoading) {
                            handleChoice(choices[0]);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setTimeLeft(null);
        }
        return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeProgress?.currentScene?.id]);

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

    // Emotional Feedback State
    const [prevTrust, setPrevTrust] = useState(stats.trustScore);
    const [trustPulse, setTrustPulse] = useState<'none' | 'increase' | 'decrease'>('none');

    // Casting activeProgress for extra fields if needed or using fallback
    const totalScenes = (activeProgress as any).totalScenes || 5;

    // Keyboard Hotkeys
    useEffect(() => {
        if (!activeProgress) return;
        const handleKeyDown = (e: KeyboardEvent) => {
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

    // Floating Impact State
    const [impacts, setImpacts] = useState<{ id: string; label: string; value: number; type: 'trust' | 'influence' }[]>([]);

    useEffect(() => {
        if (stats.trustScore !== prevTrust) {
            const diff = stats.trustScore - prevTrust;
            const id = Math.random().toString(36).substring(2, 9);
            setImpacts(prev => [...prev, { id, label: diff > 0 ? `+${diff}` : `${diff}`, value: diff, type: 'trust' }]);

            setTrustPulse(diff > 0 ? 'increase' : 'decrease');
            setPrevTrust(stats.trustScore);

            const pulseTimer = setTimeout(() => setTrustPulse('none'), 2000);
            const impactTimer = setTimeout(() => {
                setImpacts(prev => prev.filter(imp => imp.id !== id));
            }, 3000);

            return () => {
                clearTimeout(pulseTimer);
                clearTimeout(impactTimer);
            };
        }
    }, [stats.trustScore, prevTrust]);

    // Track influence changes too
    const [prevInfluence, setPrevInfluence] = useState(stats.influence);
    useEffect(() => {
        const currentInf = activeProgress?.influenceScore ?? stats.influence;
        if (currentInf !== prevInfluence) {
            const diff = currentInf - prevInfluence;
            const id = Math.random().toString(36).substring(2, 9);
            setImpacts(prev => [...prev, { id, label: diff > 0 ? `+${diff}` : `${diff}`, value: diff, type: 'influence' }]);
            setPrevInfluence(currentInf);

            const timer = setTimeout(() => {
                setImpacts(prev => prev.filter(imp => imp.id !== id));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [activeProgress?.influenceScore, stats.influence, prevInfluence]);

    // Scenario Theme Config
    const themeConfig = (() => {
        const title = activeProgress?.scenarioTitle?.toLowerCase() || '';
        if (title.includes('crisis') || title.includes('panic') || title.includes('outrage')) {
            return { color: 'text-red-500', bg: 'bg-red-500/10', glow: 'bg-red-500/10' };
        }
        if (title.includes('campaign') || title.includes('coordinated')) {
            return { color: 'text-amber-500', bg: 'bg-amber-500/10', glow: 'bg-amber-500/5' };
        }
        return { color: 'text-primary', bg: 'bg-primary/10', glow: 'bg-primary/5' };
    })();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeProgress?.currentScene.id]);

    if (!activeProgress) return null;

    const { currentScene } = activeProgress;

    const handleChoice = (choiceKey: string) => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setTimeLeft(null);
        const choiceObj = currentScene?.choices?.find((c: any) => c.label === choiceKey || c.id === choiceKey);
        submitChoice(currentScene.id, choiceKey, choiceObj?.label || choiceKey);
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
                            <ReputationBadge role={reputationRole} />
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="space-y-8 pt-4 flex flex-col items-center">
                        <div className={cn(
                            "relative transition-all duration-500",
                            trustPulse === 'increase' && "scale-[1.05]",
                            trustPulse === 'decrease' && "scale-[0.95] opacity-80"
                        )}>
                            <TrustMeter score={activeProgress.totalScore ?? stats.trustScore} size={160} strokeWidth={10} />

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

                            {/* Floating Impact Text */}
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                                <AnimatePresence>
                                    {impacts.map((imp) => (
                                        <motion.div
                                            key={imp.id}
                                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -100, scale: 1.2 }}
                                            exit={{ opacity: 0, scale: 1.5 }}
                                            className={cn(
                                                "absolute font-black text-2xl drop-shadow-2xl z-50",
                                                imp.type === 'trust'
                                                    ? (imp.value > 0 ? "text-emerald-400" : "text-red-400")
                                                    : (imp.value > 0 ? "text-amber-400" : "text-orange-400")
                                            )}
                                        >
                                            {imp.label} {imp.type === 'trust' ? 'TRUST' : 'INTEL'}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
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
                            <span className="text-xl font-black italic">{activeProgress.influenceScore ?? stats.influence}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-wider">Accuracy</span>
                            </div>
                            <span className="text-xl font-black italic">{activeProgress.accuracyRate ?? stats.accuracyRate}%</span>
                        </div>

                        {/* Streak Tracker */}
                        {currentStreak > 0 && (
                            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between hover:bg-orange-500/15 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                                        <Flame size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider text-orange-400">Streak</span>
                                </div>
                                <span className="text-xl font-black italic text-orange-300">{currentStreak}d 🔥</span>
                            </div>
                        )}
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
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/40 backdrop-blur-xl sticky top-0 z-50">
                    <div className="flex flex-col gap-1 w-1/2">
                        <div className="flex items-center gap-3">
                            <span className={cn("font-black italic tracking-tighter text-lg uppercase", themeConfig.color)}>
                                {activeProgress.scenarioTitle?.split('—')[0] || 'Mission Control'}
                            </span>
                            <div className="h-3 w-[1px] bg-white/10" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                Scene {activeProgress.currentScene.order} / {totalScenes || '?'}
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden max-w-xs">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((activeProgress.currentScene.order) / (totalScenes || 1)) * 100}%` }}
                                className={cn("h-full rounded-full transition-all duration-1000", themeConfig.color.replace('text-', 'bg-'))}
                            />
                        </div>
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
                                {/* Countdown Timer */}
                                {timeLeft !== null && (
                                    <CountdownTimer timeLeft={timeLeft} totalTime={currentScene.decisionTimeLimit!} />
                                )}
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

            {/* 4. Removed Badge Award Overlay */}

            {/* 5. Spread Simulation Overlay */}
            <AnimatePresence>
                {lastSpreadSimulation && (
                    <SpreadSimulationOverlay
                        simulation={lastSpreadSimulation}
                        choiceLabel={lastChoiceLabel || 'your choice'}
                        onClose={clearSpreadSimulation}
                    />
                )}
            </AnimatePresence>

            {/* Ambient Scenario Glow */}
            <div className={cn(
                "fixed inset-0 pointer-events-none opacity-20 blur-[150px] transition-all duration-1000",
                themeConfig.glow
            )} />

            {/* Critical Error Shake Effect */}
            <AnimatePresence>
                {trustPulse === 'decrease' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0], x: [-5, 5, -5, 5, 0] }}
                        className="fixed inset-0 bg-red-900/20 z-[999] pointer-events-none border-[20px] border-red-500/10"
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

// Reputation role badge component
const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    OBSERVER: { label: 'Observer', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
    FACT_CHECKER: { label: 'Fact Checker', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    TRUSTED_VERIFIER: { label: 'Trusted Verifier', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    MODERATOR: { label: 'Moderator', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

const ReputationBadge = memo(({ role }: { role: string }) => {
    const config = ROLE_CONFIG[role] || ROLE_CONFIG['OBSERVER'];
    return (
        <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.15em] mt-1', config.bg, config.color)}>
            <Star size={9} className="flex-shrink-0" />
            {config.label}
        </div>
    );
});
ReputationBadge.displayName = 'ReputationBadge';

// Countdown timer ring component
const CountdownTimer = memo(({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / totalTime;
    const dashOffset = circumference * (1 - progress);
    const isUrgent = timeLeft <= 5;

    return (
        <div className="ml-auto flex items-center gap-2">
            <motion.div
                animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="relative w-10 h-10 flex items-center justify-center"
            >
                <svg className="absolute inset-0 -rotate-90" width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle
                        cx="20" cy="20" r={radius}
                        fill="none"
                        stroke={isUrgent ? '#ef4444' : '#6366f1'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
                    />
                </svg>
                <span className={cn('relative text-[11px] font-black tabular-nums', isUrgent ? 'text-red-400 animate-pulse' : 'text-white')}>
                    {timeLeft}
                </span>
            </motion.div>
            {isUrgent && <span className="text-[9px] font-black text-red-400 uppercase tracking-widest animate-pulse">Act now!</span>}
        </div>
    );
});
CountdownTimer.displayName = 'CountdownTimer';
