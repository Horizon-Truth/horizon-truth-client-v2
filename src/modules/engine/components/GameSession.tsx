import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useGameStore } from '@/store/game.store';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/shared/lib/utils';
import {
    Loader2,
    ShieldCheck,
    AlertCircle,
    TrendingUp,
    Zap,
    Clock,
    Maximize,
    Minimize,
    Eye,
    EyeOff,
    ShieldAlert,
    Flame,
    Star,
    LogOut,
    BookOpen,
    Lightbulb,
    Timer,
} from 'lucide-react';
import { SceneRenderer } from './play/SceneRenderer';
import { SpreadSimulationOverlay } from './play/SpreadSimulationOverlay';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { TrustMeter } from './play/TrustMeter';
import { telemetryService } from '@/services/telemetry.service';
import { LearningMomentCard } from '@/modules/gamification/components/LearningMomentCard';
import { tipForSeed } from '@/modules/gamification/learning-content';

export function GameSession() {
    // Granular selectors to prevent broad rerenders
    const activeProgress = useGameStore(s => s.activeProgress);
    const stats = useGameStore(s => s.stats);
    const isLoading = useGameStore(s => s.isLoading);
    const error = useGameStore(s => s.error);
    const submitChoice = useGameStore(s => s.submitChoice);
    const lastSpreadSimulation = useGameStore(s => s.lastSpreadSimulation);
    const lastChoiceLabel = useGameStore(s => s.lastChoiceLabel);
    const lastChoiceFeedback = useGameStore(s => s.lastChoiceFeedback);
    const lastChoiceCorrect = useGameStore(s => s.lastChoiceCorrect);
    const lastTrustDelta = useGameStore(s => s.lastTrustDelta);
    const lastChoiceTrap = useGameStore(s => s.lastChoiceTrap);
    const clearSpreadSimulation = useGameStore(s => s.clearSpreadSimulation);
    const reputationRole = useGameStore(s => s.reputationRole);
    const currentStreak = useGameStore(s => s.currentStreak);
    const resetGame = useGameStore(s => s.resetGame);

    const { user } = useAuthStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Guard against accidental back navigation: confirm, then exit gracefully.
    useEffect(() => {
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            if (window.confirm('Leave this mission? Your progress in the current scene will be lost.')) {
                resetGame();
            } else {
                window.history.pushState(null, '', window.location.href);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [resetGame]);

    // Unload protection
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

    const currentScene = activeProgress?.currentScene;

    const handleChoice = useCallback((choiceKey: string) => {
        if (!activeProgress || !currentScene) return;
        if (countdownRef.current) clearInterval(countdownRef.current);
        setTimeLeft(null);
        const choiceObj = currentScene.choices?.find((c: any) => c.label === choiceKey || c.id === choiceKey);

        const progressId = activeProgress.id;
        const sceneId = currentScene.id;
        telemetryService.trackTiming(progressId, sceneId, {
            final_decision_timestamp: new Date().toISOString(),
        });
        telemetryService.trackDecision(progressId, sceneId, {
            player_decision_type: 'trust',
            decision_confidence_level: 5,
        });
        telemetryService.flush(progressId, sceneId);

        submitChoice(currentScene.id, choiceKey, choiceObj?.label || choiceKey);
    }, [activeProgress, currentScene, submitChoice]);

    // Decision timer: when it expires the network "reacts without you"
    useEffect(() => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setTimedOut(false);
        const limit = currentScene?.decisionTimeLimit;
        if (limit && limit > 0) {
            setTimeLeft(limit);
            countdownRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(countdownRef.current!);
                        const choices = currentScene?.availableChoices;
                        if (choices && choices.length > 0) {
                            setTimedOut(true);
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
    }, [currentScene?.id]);

    // Telemetry: scene context + timing
    useEffect(() => {
        if (!activeProgress?.currentScene?.id) return;
        const progressId = activeProgress.id;
        const sceneId = activeProgress.currentScene.id;

        telemetryService.trackContext(progressId, sceneId, {
            player_id: user?.id || 'anonymous',
            level_id: activeProgress.scenarioId,
            content_id: sceneId,
            device_type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
            network_state: (navigator as any)?.connection?.effectiveType === '4g' ? 'good' : 'poor',
        });
        telemetryService.trackTiming(progressId, sceneId, {
            content_shown_timestamp: new Date().toISOString(),
        });
    }, [activeProgress?.currentScene?.id, activeProgress?.id, activeProgress?.scenarioId, user?.id]);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
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

    // Trust pulse feedback
    const [prevTrust, setPrevTrust] = useState(stats.trustScore);
    const [trustPulse, setTrustPulse] = useState<'none' | 'increase' | 'decrease'>('none');

    const totalScenes = (activeProgress as any)?.totalScenes || 5;

    // Keyboard hotkeys (1-9) — ignored while typing or holding modifiers
    useEffect(() => {
        if (!activeProgress) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
            const key = parseInt(e.key);
            if (key >= 1 && key <= activeProgress.currentScene.availableChoices.length) {
                if (!isLoading) {
                    handleChoice(activeProgress.currentScene.availableChoices[key - 1]);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeProgress, isLoading, handleChoice]);

    // Floating impact numbers
    const [impacts, setImpacts] = useState<{
        id: string;
        label: string;
        value: number;
        type: 'trust' | 'influence';
        x: number;
        y: number;
        rotation: number;
    }[]>([]);

    useEffect(() => {
        if (stats.trustScore !== prevTrust) {
            const diff = stats.trustScore - prevTrust;
            const id = Math.random().toString(36).substring(2, 9);
            const xOffset = Math.floor(Math.random() * 200) - 100;
            const yTarget = -(Math.floor(Math.random() * 60) + 80);
            const rotation = Math.floor(Math.random() * 40) - 20;

            setImpacts(prev => [...prev, {
                id,
                label: diff > 0 ? `+${diff}` : `${diff}`,
                value: diff,
                type: 'trust',
                x: xOffset,
                y: yTarget,
                rotation
            }]);

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

    const [prevInfluence, setPrevInfluence] = useState(stats.influence);
    useEffect(() => {
        const currentInf = activeProgress?.influenceScore ?? stats.influence;
        if (currentInf !== prevInfluence) {
            const diff = currentInf - prevInfluence;
            const id = Math.random().toString(36).substring(2, 9);
            const xOffset = Math.floor(Math.random() * 200) - 100;
            const yTarget = -(Math.floor(Math.random() * 60) + 80);
            const rotation = Math.floor(Math.random() * 40) - 20;

            setImpacts(prev => [...prev, {
                id,
                label: diff > 0 ? `+${diff}` : `${diff}`,
                value: diff,
                type: 'influence',
                x: xOffset,
                y: yTarget,
                rotation
            }]);
            setPrevInfluence(currentInf);

            const timer = setTimeout(() => {
                setImpacts(prev => prev.filter(imp => imp.id !== id));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [activeProgress?.influenceScore, stats.influence, prevInfluence]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeProgress?.currentScene?.id]);

    if (!activeProgress || !currentScene) return null;

    const sessionTip = tipForSeed(currentScene.id);

    return (
        <div
            ref={containerRef}
            className="flex h-full bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30 relative z-10"
        >
            {/* 1. Left sidebar — profile & live stats */}
            <aside
                aria-label="Your mission stats"
                className={cn(
                    "w-[280px] border-r border-border flex flex-col pt-8 bg-muted/30 transition-all duration-500",
                    (isFullscreen || isFocusMode) ? "w-0 opacity-0 -translate-x-full overflow-hidden border-none" : "hidden md:flex",
                    shouldReduceMotion && "transition-none"
                )}
            >
                <div className="px-6 space-y-8 overflow-y-auto custom-scrollbar pb-8">
                    {/* Profile */}
                    <div className="flex flex-col items-center text-center gap-3">
                        <Avatar className="w-16 h-16 border-2 border-border">
                            <AvatarImage src={user?.avatarUrl} alt="" />
                            <AvatarFallback className="bg-primary/10 text-xl font-black text-primary">{user?.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="text-base font-black tracking-tight">{user?.nickname || user?.fullName || 'Player'}</h2>
                            <ReputationBadge role={reputationRole} />
                        </div>
                    </div>

                    {/* Trust meter */}
                    <div className="flex flex-col items-center gap-6">
                        <div className={cn(
                            "relative transition-all duration-500",
                            trustPulse === 'increase' && "scale-[1.05]",
                            trustPulse === 'decrease' && "scale-[0.95] opacity-80",
                            shouldReduceMotion && "transition-none scale-100 opacity-100"
                        )}>
                            <TrustMeter score={stats.trustScore} size={150} strokeWidth={10} />

                            <AnimatePresence>
                                {trustPulse !== 'none' && !shouldReduceMotion && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.5 }}
                                        animate={{ opacity: 1, y: -40, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={cn(
                                            "absolute -right-4 top-0",
                                            trustPulse === 'increase' ? "text-emerald-500" : "text-red-500"
                                        )}
                                    >
                                        <div className="bg-card p-2 rounded-full border border-border shadow-xl">
                                            {trustPulse === 'increase' ?
                                                <ShieldCheck size={22} aria-label="Trust increased" /> :
                                                <ShieldAlert size={22} aria-label="Trust decreased" />
                                            }
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Floating impact numbers */}
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center" aria-hidden>
                                <AnimatePresence>
                                    {!shouldReduceMotion && impacts.map((imp) => (
                                        <motion.div
                                            key={imp.id}
                                            initial={{ opacity: 0, y: 20, x: imp.x, scale: 0.8, rotate: 0 }}
                                            animate={{ opacity: 1, y: imp.y, x: imp.x, scale: 1.2, rotate: imp.rotation }}
                                            exit={{ opacity: 0, scale: 1.5, rotate: imp.rotation * 1.5 }}
                                            className={cn(
                                                "absolute font-black text-xl drop-shadow-xl z-50",
                                                imp.type === 'trust'
                                                    ? (imp.value > 0 ? "text-emerald-500" : "text-red-500")
                                                    : (imp.value > 0 ? "text-amber-500" : "text-orange-500")
                                            )}
                                        >
                                            {imp.label} {imp.type === 'trust' ? 'TRUST' : 'INFLUENCE'}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        <SidebarStat icon={<Zap size={16} />} iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400" label="Level" value={`${stats.level}`} />
                        <SidebarStat icon={<TrendingUp size={16} />} iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400" label="Influence" value={`${activeProgress.influenceScore ?? stats.influence}`} />
                        <SidebarStat icon={<ShieldCheck size={16} />} iconClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" label="Accuracy" value={`${activeProgress.accuracyRate ?? stats.accuracyRate}%`} />

                        {currentStreak > 0 && (
                            <SidebarStat icon={<Flame size={16} />} iconClass="bg-orange-500/10 text-orange-500" label="Day streak" value={`${currentStreak} 🔥`} />
                        )}
                    </div>
                </div>
            </aside>

            {/* 2. Main feed — scene content */}
            <main className="flex-1 flex flex-col relative bg-background">
                {/* Header */}
                <header className="h-16 sm:h-18 border-b border-border px-3 sm:px-8 flex items-center justify-between bg-card/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex flex-col gap-1.5 w-full max-w-[55%] sm:max-w-[65%] lg:w-1/2 overflow-hidden">
                        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                            <span className="font-black tracking-tight text-sm sm:text-base truncate text-foreground">
                                {activeProgress.scenarioTitle?.split('—')[0] || 'Mission'}
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold text-muted-foreground whitespace-nowrap shrink-0">
                                Scene {activeProgress.currentScene.order} of {totalScenes || '?'}
                            </span>
                        </div>
                        {/* Progress bar */}
                        <div
                            className="w-full h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px] sm:max-w-xs"
                            role="progressbar"
                            aria-valuenow={Math.round(((activeProgress.currentScene.order) / (totalScenes || 1)) * 100)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Mission progress"
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((activeProgress.currentScene.order) / (totalScenes || 1)) * 100}%` }}
                                className="h-full rounded-full bg-primary"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto">
                        <button
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className={cn(
                                "p-2 rounded-lg transition-colors",
                                isFocusMode ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                            title={isFocusMode ? "Exit focus mode" : "Focus mode — hide side panels"}
                            aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
                            aria-pressed={isFocusMode}
                        >
                            {isFocusMode ? <Eye size={16} aria-hidden /> : <EyeOff size={16} aria-hidden />}
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hidden sm:block"
                            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        >
                            {isFullscreen ? <Minimize size={16} aria-hidden /> : <Maximize size={16} aria-hidden />}
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm('Leave this mission and return to the hub? You can resume it later.')) resetGame();
                            }}
                            className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            title="Leave mission"
                            aria-label="Leave mission"
                        >
                            <LogOut size={16} aria-hidden />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar flex flex-col items-center"
                >
                    <div className={cn(
                        "w-full space-y-8 pb-32 transition-all duration-500",
                        (isFullscreen || isFocusMode) ? "max-w-3xl" : "max-w-xl",
                        shouldReduceMotion && "transition-none"
                    )}>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Clock size={14} className="text-muted-foreground" aria-hidden />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {timeLeft !== null && (
                                    <CountdownTimer timeLeft={timeLeft} totalTime={currentScene.decisionTimeLimit!} />
                                )}
                            </div>

                            <SceneRenderer
                                scene={currentScene}
                                onChoice={handleChoice}
                                isLoading={isLoading}
                            />

                            {/* Timed-out notice */}
                            <AnimatePresence>
                                {timedOut && lastChoiceFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-sm font-medium"
                                        role="status"
                                    >
                                        <Timer size={18} className="shrink-0" aria-hidden />
                                        Time ran out — the network reacted before you did. Hesitation has consequences too.
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Learning moment */}
                            <AnimatePresence>
                                {lastChoiceFeedback && (
                                    <LearningMomentCard
                                        correct={lastChoiceCorrect}
                                        feedback={lastChoiceFeedback}
                                        choiceLabel={lastChoiceLabel}
                                        trap={lastChoiceTrap}
                                        trustDelta={lastTrustDelta}
                                        tipSeed={currentScene.id}
                                        onDismiss={clearSpreadSimulation}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Error handling */}
                        {error && (
                            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-4" role="alert">
                                <AlertCircle size={24} aria-hidden />
                                {error}
                            </div>
                        )}

                        {/* Choices — only when the scene doesn't render them natively */}
                        {(() => {
                            const contentType = (currentScene as any).contentType || (currentScene as any).content?.contentType;
                            return !['CHAT', 'TEXT', 'FEED'].includes(contentType);
                        })() && (
                                <div className="space-y-4 pt-8 border-t border-border">
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What do you do?</span>
                                        <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">Tip: press 1–{currentScene.availableChoices.length}</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3" role="group" aria-label="Your response options">
                                        {currentScene.availableChoices.map((choice, index) => (
                                            <button
                                                key={choice}
                                                disabled={isLoading}
                                                onClick={() => handleChoice(choice)}
                                                className={cn(
                                                    "group p-4 sm:p-5 text-left rounded-2xl border transition-all duration-200 relative overflow-hidden active:scale-[0.99]",
                                                    "bg-card border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                                                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                                                    isLoading && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300" aria-hidden />
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="w-6 h-6 shrink-0 rounded-md bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary text-xs font-black flex items-center justify-center transition-colors" aria-hidden>
                                                            {index + 1}
                                                        </span>
                                                        <span className="font-bold text-sm sm:text-base group-hover:text-primary transition-colors">{choice}</span>
                                                    </div>
                                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" aria-hidden />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </main>

            {/* 3. Right panel — field guide (real mission info, no fake data) */}
            <aside
                aria-label="Field guide"
                className={cn(
                    "w-[330px] border-l border-border flex flex-col bg-muted/30 transition-all duration-500",
                    (isFullscreen || isFocusMode) ? "w-0 opacity-0 translate-x-full overflow-hidden border-none" : "hidden lg:flex",
                    shouldReduceMotion && "transition-none"
                )}
            >
                <div className="p-6 h-full flex flex-col gap-5 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-primary" aria-hidden />
                        <h3 className="font-black text-xs tracking-widest uppercase">Field Guide</h3>
                    </div>

                    {/* Mission briefing */}
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current mission</p>
                        <p className="text-sm font-bold leading-snug">{activeProgress.scenarioTitle}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Star size={12} aria-hidden />
                            <span>Scene {activeProgress.currentScene.order} of {totalScenes}</span>
                        </div>
                    </div>

                    {/* Session stats */}
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">This session</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Score</span>
                            <span className="font-black tabular-nums">{activeProgress.totalScore ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Accuracy</span>
                            <span className="font-black tabular-nums">{activeProgress.accuracyRate ?? '—'}{activeProgress.accuracyRate != null ? '%' : ''}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Influence</span>
                            <span className="font-black tabular-nums">{activeProgress.influenceScore ?? 0}</span>
                        </div>
                    </div>

                    {/* Verification tip of the scene */}
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-2">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={14} className="text-primary" aria-hidden />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Verification habit</p>
                        </div>
                        <p className="text-sm font-bold">{sessionTip.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{sessionTip.tip}</p>
                    </div>

                    <div className="mt-auto p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border">
                        <p className="text-xs font-bold leading-relaxed text-foreground/80">
                            "Truth is the most valuable currency in the digital age. Spend it wisely."
                        </p>
                    </div>
                </div>
            </aside>

            {/* Spread simulation overlay */}
            <AnimatePresence>
                {lastSpreadSimulation && (
                    <SpreadSimulationOverlay
                        simulation={lastSpreadSimulation}
                        choiceLabel={lastChoiceLabel || 'your choice'}
                        onClose={clearSpreadSimulation}
                    />
                )}
            </AnimatePresence>

            {/* Trust-loss flash */}
            <AnimatePresence>
                {trustPulse === 'decrease' && !shouldReduceMotion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.35, 0], x: [-5, 5, -5, 5, 0] }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-red-900/20 z-[999] pointer-events-none border-[16px] border-red-500/10"
                        aria-hidden
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

const SidebarStat = memo(({ icon, iconClass, label, value }: { icon: React.ReactNode; iconClass: string; label: string; value: string }) => {
    return (
        <div className="w-full p-4 rounded-2xl bg-card border border-border flex items-center justify-between hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", iconClass)} aria-hidden>
                    {icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
            </div>
            <span className="text-lg font-black tabular-nums">{value}</span>
        </div>
    );
});
SidebarStat.displayName = 'SidebarStat';

// Reputation role badge component
const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    OBSERVER: { label: 'Observer', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
    FACT_CHECKER: { label: 'Fact Checker', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    TRUSTED_VERIFIER: { label: 'Trusted Verifier', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    MODERATOR: { label: 'Moderator', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

const ReputationBadge = memo(({ role }: { role: string }) => {
    const config = ROLE_CONFIG[role] || ROLE_CONFIG['OBSERVER'];
    return (
        <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider mt-1', config.bg, config.color)}>
            <Star size={9} className="flex-shrink-0" aria-hidden />
            {config.label}
        </div>
    );
});
ReputationBadge.displayName = 'ReputationBadge';

// Countdown timer ring
const CountdownTimer = memo(({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / totalTime;
    const dashOffset = circumference * (1 - progress);
    const isUrgent = timeLeft <= 5;

    return (
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0" role="timer" aria-label={`${timeLeft} seconds remaining`}>
            <motion.div
                animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="relative w-10 h-10 flex items-center justify-center"
            >
                <svg className="absolute inset-0 -rotate-90" width="40" height="40" viewBox="0 0 40 40" aria-hidden>
                    <circle cx="20" cy="20" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-foreground/10" />
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
                <span className={cn('relative text-[11px] font-black tabular-nums', isUrgent ? 'text-red-500' : 'text-foreground')}>
                    {timeLeft}
                </span>
            </motion.div>
            {isUrgent && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Act now!</span>}
        </div>
    );
});
CountdownTimer.displayName = 'CountdownTimer';
