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