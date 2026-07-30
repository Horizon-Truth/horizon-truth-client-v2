import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGuestGameStore } from '@/store/guest-game.store';
import { cn } from '@/shared/lib/utils';
import {
    ShieldCheck,
    MessageSquare,
    ArrowRight,
    Trophy,
    Home,
    UserPlus,
    Loader2,
    AlertCircle,
    Target,
    BookOpen,
    GraduationCap,
    Brain,
    LogOut,
    Sparkles,
    Flame,
    Lightbulb,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ScenarioList } from '../engine/components/ScenarioList';
import { SceneRenderer } from '../engine/components/play/SceneRenderer';
import { TrustMeter } from '../engine/components/play/TrustMeter';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import AddFeedbackModal from '../engine/components/AddFeedbackModal';
import { LearningMomentCard } from '@/modules/gamification/components/LearningMomentCard';
import { Confetti } from '@/modules/gamification/components/Confetti';
import { tipForSeed } from '@/modules/gamification/learning-content';
import { RANKS } from '@/modules/gamification/progression';

export default function GuestGamePage() {
    const {
        activeScenario,
        currentScene,
        isCompleted,
        trustScore,
        choicesLog,
        isLoading,
        error,
        lastChoice,
        startGuestGame,
        submitGuestChoice,
        continueGuestGame,
        resetGuestGame
    } = useGuestGameStore();

    const navigate = useNavigate();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Accuracy: choices that gained trust count as best calls
    const bestChoices = useMemo(() => choicesLog.filter(c => c.trustDelta > 0).length, [choicesLog]);
    const accuracy = choicesLog.length > 0 ? Math.round((bestChoices / choicesLog.length) * 100) : 0;

    const sortedScenes = useMemo(
        () => [...(activeScenario?.scenes || [])].sort((a: any, b: any) => a.order - b.order),
        [activeScenario]
    );
    const totalScenes = sortedScenes.length || activeScenario?.totalScenes || 0;
    const sceneNumber = currentScene
        ? Math.max(1, sortedScenes.findIndex(s => s.id === currentScene.id) + 1)
        : 0;

    // SceneRenderer's CHAT/TEXT/FEED components emit a choice label — map it
    // back to the full choice object the guest store expects.
    const handleChoiceByKey = (choiceKey: string) => {
        if (!currentScene) return;
        const choiceObj = currentScene.choices?.find((c: any) => c.label === choiceKey || c.id === choiceKey)
            ?? { label: choiceKey };
        submitGuestChoice(choiceObj);
    };

    const contentType = currentScene
        ? ((currentScene as any).contentType || (currentScene as any).content?.contentType)
        : null;
    const sceneRendersOwnChoices = ['CHAT', 'TEXT', 'FEED'].includes(contentType);

    const feedbackText = lastChoice
        ? lastChoice.feedback ?? (
            lastChoice.correct === false
                ? 'That reaction is exactly what this content was engineered to produce. Slow down and verify before acting.'
                : lastChoice.correct === true
                    ? 'Good decision — verifying before reacting is how misinformation gets stopped.'
                    : 'Noted. Not every choice is right or wrong — but every one shapes how information spreads.'
        )
        : null;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/20">
            {/* Ambient background */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Guest header */}
            <header className="relative z-20 border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => navigate('/')}
                            aria-label="Go to home page"
                        >
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform" aria-hidden>
                                <ShieldCheck className="text-primary-foreground h-5 w-5" />
                            </div>
                            <span className="font-black tracking-tighter text-xl hidden sm:block">HORIZON</span>
                        </button>
                        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />
                        <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden />
                            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Guest mode</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="hidden sm:flex text-xs font-bold gap-2 rounded-xl"
                        >
                            <Home size={16} aria-hidden /> Home
                        </Button>
                        <Button
                            onClick={() => navigate('/register')}
                            className="rounded-xl h-10 px-5 font-bold gap-2 shadow-lg shadow-primary/20 text-xs sm:text-sm"
                        >
                            <UserPlus size={16} aria-hidden /> Create account
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-8 overflow-y-auto custom-scrollbar">
                {/* Mission hub */}
                {!activeScenario && !isCompleted && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1 space-y-8">
                                <div className="bg-card border border-border rounded-3xl p-4 sm:p-10 shadow-sm">
                                    <ScenarioList onStartGame={startGuestGame} guestMode />
                                </div>
                            </div>

                            {/* Sidebar */}
                            <aside className="w-full lg:w-80 flex flex-col gap-6">
                                {/* Why create an account */}
                                <div className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0" aria-hidden>
                                            <Sparkles className="text-primary w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-tight leading-tight">Play with progress</h3>
                                            <p className="text-[11px] text-muted-foreground font-medium">Free account</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-2.5 text-xs text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <Trophy size={14} className="text-primary mt-0.5 shrink-0" aria-hidden />
                                            <span>Earn XP and climb {RANKS.length} ranks — from {RANKS[0].emoji} {RANKS[0].name} to {RANKS[RANKS.length - 1].emoji} {RANKS[RANKS.length - 1].name}</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Flame size={14} className="text-orange-500 mt-0.5 shrink-0" aria-hidden />
                                            <span>Build a daily streak and unlock harder missions</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ShieldCheck size={14} className="text-emerald-500 mt-0.5 shrink-0" aria-hidden />
                                            <span>Keep your Trust Score and badges across devices</span>
                                        </li>
                                    </ul>
                                    <Button
                                        onClick={() => navigate('/register')}
                                        className="font-bold w-full h-11 rounded-xl shadow-lg shadow-primary/20"
                                    >
                                        <UserPlus size={16} className="mr-2" aria-hidden /> Create free account
                                    </Button>
                                </div>

                                {/* Give feedback */}
                                <div className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-4 shadow-sm">
                                    <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center" aria-hidden>
                                        <MessageSquare className="text-muted-foreground w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black tracking-tight">Tell us what you think</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Your feedback shapes how we teach people to fight misinformation. No account needed.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setIsFeedbackOpen(true)}
                                        variant="outline"
                                        className="w-full text-xs font-bold h-10 rounded-xl"
                                    >
                                        Give feedback
                                    </Button>
                                </div>
                            </aside>
                        </div>
                    </div>
                )}

                {/* Guest play view */}
                {(activeScenario || isCompleted) && (
                    <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden animate-in fade-in duration-500">
                        <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

                        {isLoading && !currentScene && !isCompleted ? (
                            <div className="flex-1 flex items-center justify-center relative z-10">
                                <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center border border-border">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden />
                                    </div>
                                    <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground animate-pulse">Loading mission...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full overflow-hidden relative z-10">
                                {/* Left sidebar — guest stats */}
                                <aside aria-label="Your session stats" className="w-[280px] border-r border-border flex-col pt-8 bg-muted/30 hidden md:flex">
                                    <div className="px-6 space-y-8 overflow-y-auto custom-scrollbar pb-8">
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <Avatar className="w-16 h-16 border-2 border-border">
                                                <AvatarFallback className="bg-primary/10 text-xl font-black text-primary">G</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <h2 className="text-base font-black tracking-tight">Guest Player</h2>
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                                    Trial session
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-6">
                                            <TrustMeter score={trustScore} size={150} strokeWidth={10} />

                                            <div className="w-full p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" aria-hidden>
                                                        <Target size={16} />
                                                    </div>
                                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Best calls</span>
                                                </div>
                                                <span className="text-lg font-black tabular-nums">{bestChoices}/{choicesLog.length}</span>
                                            </div>

                                            {/* Verification habit */}
                                            {currentScene && (
                                                <div className="w-full p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Lightbulb size={13} className="text-primary" aria-hidden />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Verification habit</p>
                                                    </div>
                                                    <p className="text-xs font-bold">{tipForSeed(currentScene.id).title}</p>
                                                    <p className="text-[11px] text-muted-foreground leading-relaxed">{tipForSeed(currentScene.id).tip}</p>
                                                </div>
                                            )}

                                            {/* Save progress CTA */}
                                            <div className="w-full p-4 rounded-2xl bg-card border border-border text-center space-y-3">
                                                <p className="text-xs text-muted-foreground leading-snug">Guest progress isn't saved. Create a free account to keep your Trust Score and earn XP.</p>
                                                <Button
                                                    size="sm"
                                                    className="h-9 text-xs font-bold w-full rounded-lg"
                                                    onClick={() => navigate('/register')}
                                                >
                                                    <UserPlus size={14} className="mr-1.5" aria-hidden /> Save my progress
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </aside>

                                {/* Main content */}
                                <div className="flex-1 flex flex-col relative bg-background min-w-0">
                                    {/* Header */}
                                    <header className="h-16 sm:h-18 border-b border-border px-3 sm:px-8 flex items-center justify-between bg-card/80 backdrop-blur-md sticky top-0 z-50">
                                        <div className="flex flex-col gap-1.5 min-w-0 flex-1 pr-3">
                                            <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                                                <span className="font-black tracking-tight text-sm sm:text-base truncate">
                                                    {activeScenario?.title || 'Guest mission'}
                                                </span>
                                                {!isCompleted && totalScenes > 0 && (
                                                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground whitespace-nowrap shrink-0">
                                                        Scene {sceneNumber} of {totalScenes}
                                                    </span>
                                                )}
                                            </div>
                                            {!isCompleted && totalScenes > 0 && (
                                                <div
                                                    className="w-full h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px] sm:max-w-xs"
                                                    role="progressbar"
                                                    aria-valuenow={Math.round((sceneNumber / totalScenes) * 100)}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-label="Mission progress"
                                                >
                                                    <motion.div
                                                        animate={{ width: `${(sceneNumber / totalScenes) * 100}%` }}
                                                        className="h-full rounded-full bg-primary"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (isCompleted || window.confirm('Leave this mission? Guest progress is not saved.')) resetGuestGame();
                                            }}
                                            className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors shrink-0"
                                            title="Leave mission"
                                            aria-label="Leave mission"
                                        >
                                            <LogOut size={16} aria-hidden />
                                        </button>
                                    </header>

                                    {/* Content */}
                                    <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar flex flex-col items-center">
                                        <div className="w-full max-w-xl space-y-8 pb-32">
                                            {error && (
                                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3" role="alert">
                                                    <AlertCircle size={18} aria-hidden />
                                                    {error}
                                                </div>
                                            )}

                                            {isCompleted ? (
                                                <GuestResults
                                                    trustScore={trustScore}
                                                    accuracy={accuracy}
                                                    bestChoices={bestChoices}
                                                    totalChoices={choicesLog.length}
                                                    scenario={activeScenario}
                                                    onReplay={resetGuestGame}
                                                    onRegister={() => navigate('/register')}
                                                    onHome={() => navigate('/')}
                                                />
                                            ) : currentScene && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                    <SceneRenderer
                                                        scene={currentScene}
                                                        onChoice={handleChoiceByKey}
                                                        isLoading={isLoading}
                                                    />

                                                    {/* Learning moment + continue */}
                                                    <AnimatePresence>
                                                        {lastChoice && feedbackText && (
                                                            <div className="space-y-4">
                                                                <LearningMomentCard
                                                                    correct={lastChoice.correct}
                                                                    feedback={feedbackText}
                                                                    choiceLabel={lastChoice.label}
                                                                    trap={lastChoice.trap}
                                                                    trustDelta={lastChoice.trustDelta}
                                                                    tipSeed={currentScene.id}
                                                                />
                                                                <Button
                                                                    onClick={continueGuestGame}
                                                                    className="w-full h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                                                                >
                                                                    Continue
                                                                    <ArrowRight size={16} className="ml-2" aria-hidden />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </AnimatePresence>

                                                    {/* Choices (when the scene doesn't render its own) */}
                                                    {!sceneRendersOwnChoices && !lastChoice && (
                                                        <div className="space-y-4 pt-8 border-t border-border">
                                                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">What do you do?</span>
                                                            <div className="grid grid-cols-1 gap-3" role="group" aria-label="Your response options">
                                                                {(currentScene.choices?.length ? currentScene.choices.map((c: any) => c.label) : currentScene.availableChoices || []).map((label: string, index: number) => (
                                                                    <button
                                                                        key={label}
                                                                        disabled={isLoading}
                                                                        onClick={() => handleChoiceByKey(label)}
                                                                        className={cn(
                                                                            "group p-4 sm:p-5 text-left rounded-2xl border transition-all duration-200 relative overflow-hidden active:scale-[0.99]",
                                                                            "bg-card border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                                                                            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                                                                            isLoading && "opacity-50 cursor-not-allowed"
                                                                        )}
                                                                    >
                                                                        <div className="flex items-center justify-between gap-3">
                                                                            <div className="flex items-center gap-3 min-w-0">
                                                                                <span className="w-6 h-6 shrink-0 rounded-md bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary text-xs font-black flex items-center justify-center transition-colors" aria-hidden>
                                                                                    {index + 1}
                                                                                </span>
                                                                                <span className="font-bold text-sm sm:text-base group-hover:text-primary transition-colors">{label}</span>
                                                                            </div>
                                                                            {isLoading
                                                                                ? <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" aria-hidden />
                                                                                : <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" aria-hidden />}
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Guest feedback modal */}
            {isFeedbackOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setIsFeedbackOpen(false)} />
                    <div className="relative z-[210] w-full max-w-lg">
                        <AddFeedbackModal
                            isGuest
                            onSuccess={() => setIsFeedbackOpen(false)}
                            onCancel={() => setIsFeedbackOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function GuestResults({ trustScore, accuracy, bestChoices, totalChoices, scenario, onReplay, onRegister, onHome }: {
    trustScore: number;
    accuracy: number;
    bestChoices: number;
    totalChoices: number;
    scenario: import('@/services/engine.service').Scenario | null;
    onReplay: () => void;
    onRegister: () => void;
    onHome: () => void;
}) {
    const passed = accuracy >= 70;

    const lessons: { icon: React.ReactNode; label: string; text: string }[] = [];
    if (scenario?.learningObjective) lessons.push({ icon: <GraduationCap size={18} aria-hidden />, label: 'What this mission taught', text: scenario.learningObjective });
    if (scenario?.psychologicalTrigger) lessons.push({ icon: <Brain size={18} aria-hidden />, label: 'The manipulation at play', text: scenario.psychologicalTrigger });
    if (scenario?.preventionLesson) lessons.push({ icon: <ShieldCheck size={18} aria-hidden />, label: 'How to protect yourself', text: scenario.preventionLesson });
    if (lessons.length === 0) {
        const tip = tipForSeed(scenario?.id || 'guest');
        lessons.push({ icon: <Lightbulb size={18} aria-hidden />, label: tip.title, text: tip.tip });
    }

    return (
        <div className="space-y-6 py-8 animate-in zoom-in-95 duration-700">
            {passed && <Confetti />}

            <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center mx-auto border border-primary/25" aria-hidden>
                    <Trophy size={40} className="text-primary" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                    {passed ? 'Mission complete!' : 'Mission over — lesson learned.'}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    {passed
                        ? 'You kept your community\'s trust. This is what digital resilience looks like.'
                        : 'Misinformation won this round — but now you\'ve seen its tricks up close.'}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-center gap-1.5">
                        <ShieldCheck size={12} aria-hidden /> Trust Score
                    </p>
                    <p className="text-3xl font-black tabular-nums">{trustScore}%</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-center gap-1.5">
                        <Target size={12} aria-hidden /> Accuracy
                    </p>
                    <p className="text-3xl font-black tabular-nums">{accuracy}%</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{bestChoices} of {totalChoices} best calls</p>
                </div>
            </div>

            {/* What you learned */}
            <div className="space-y-3 text-left">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                    <BookOpen size={14} className="text-primary" aria-hidden /> What you learned
                </p>
                {lessons.map((lesson, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.15 }}
                        className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            {lesson.icon}
                        </div>
                        <div className="space-y-1 min-w-0">
                            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">{lesson.label}</p>
                            <p className="text-sm leading-relaxed">{lesson.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Register CTA */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm text-center">
                <div className="space-y-1.5">
                    <h4 className="font-black text-xl tracking-tight">Don't lose what you just learned</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Guest results disappear when you leave. Create a free account to earn XP for missions like this,
                        climb the ranks, and keep your streak going.
                    </p>
                </div>
                <Button
                    onClick={onRegister}
                    className="w-full h-12 rounded-2xl font-black shadow-lg shadow-primary/20"
                >
                    <UserPlus size={16} className="mr-2" aria-hidden /> Create free account
                </Button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2">
                <Button variant="ghost" onClick={onReplay} className="font-bold text-xs rounded-xl">Try another mission</Button>
                <Button variant="ghost" onClick={onHome} className="font-bold text-xs rounded-xl">Back to home</Button>
            </div>
        </div>
    );
}
