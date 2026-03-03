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