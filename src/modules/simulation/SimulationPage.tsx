import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TRIAL_SCENARIO } from './data/trial-scenario';
import type { Scene, Choice } from './data/trial-scenario';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/shared/lib/utils';
import { ShieldCheck, ArrowRight, Share2, User, MessageCircle, LayoutDashboard, Target, BookOpen, GraduationCap, Brain, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { LearningMomentCard } from '@/modules/gamification/components/LearningMomentCard';
import { Confetti } from '@/modules/gamification/components/Confetti';
import { TECHNIQUES } from '@/modules/gamification/learning-content';

const SimulationPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [trustScore, setTrustScore] = useState(50);
    const [bestChoices, setBestChoices] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

    const totalScenes = TRIAL_SCENARIO.scenes.length;
    const currentScene = TRIAL_SCENARIO.scenes[currentSceneIndex];

    const handleChoice = (choice: Choice) => {
        setSelectedChoice(choice);
        if (choice.isBest) setBestChoices(prev => prev + 1);
        setTrustScore(prev => Math.min(100, Math.max(0, prev + choice.trustImpact)));
    };

    const nextStep = () => {
        setSelectedChoice(null);
        if (currentSceneIndex < totalScenes - 1) {
            setCurrentSceneIndex(prev => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const accuracy = Math.round((bestChoices / totalScenes) * 100);

    // Techniques the player has faced so far (for the results screen)
    const coveredTechniques = useMemo(
        () => TRIAL_SCENARIO.scenes
            .map(s => TECHNIQUES.find(t => t.key === s.techniqueKey))
            .filter((t): t is NonNullable<typeof t> => !!t),
        []
    );

    const renderSceneContent = (scene: Scene) => {
        if (scene.type === 'SOCIAL_POST') {
            return (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 flex items-center gap-3 border-b border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold" aria-hidden>
                            {scene.author[0]}
                        </div>
                        <div>
                            <p className="font-bold text-sm tracking-tight">{scene.author}</p>
                            <p className="text-[11px] text-muted-foreground">
                                {scene.handle ? `${scene.handle} · ` : ''}{scene.timestamp}
                            </p>
                        </div>
                        <div className="ml-auto">
                            <Share2 size={16} className="text-muted-foreground" aria-hidden />
                        </div>
                    </div>
                    {scene.mediaUrl && (
                        <div className="aspect-video overflow-hidden bg-muted">
                            <img src={scene.mediaUrl} alt="Attached to the post — treat with suspicion" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                    )}
                    <div className="p-6">
                        <p className="text-base sm:text-lg leading-relaxed font-medium">{scene.content}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg p-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary" aria-hidden>
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">{scene.author}</h4>
                        <p className="text-sm text-muted-foreground">Someone you trust is asking for your advice.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0" aria-hidden>
                        <User size={20} className="text-muted-foreground" />
                    </div>
                    <div className="bg-muted/60 p-4 rounded-2xl rounded-tl-none border border-border max-w-[80%]">
                        <p className="text-sm font-medium leading-relaxed">{scene.content}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">{scene.timestamp}</p>
                    </div>
                </div>
            </div>
        );
    };

    if (isCompleted) {
        const passed = accuracy >= 70;
        return (
            <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center p-4 py-12 overflow-hidden">
                {passed && <Confetti />}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full" />

                <div className="w-full max-w-2xl z-10 space-y-6 animate-in zoom-in-95 duration-700">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck size={14} aria-hidden /> Trial complete
                        </div>