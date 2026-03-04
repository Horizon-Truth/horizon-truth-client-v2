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