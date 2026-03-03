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