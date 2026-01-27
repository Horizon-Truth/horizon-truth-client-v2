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
import { ConfidenceCheck } from '@/modules/gamification/components/ConfidenceCheck';
import type { ConfidenceLevel } from '@/modules/gamification/confidence';

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
    const lastConfidence = useGameStore(s => s.lastConfidence);
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