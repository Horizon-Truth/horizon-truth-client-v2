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