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

    // Choice picked but not yet submitted — awaiting the confidence check (Phase 15).
    const [pendingChoice, setPendingChoice] = useState<{ key: string; label: string } | null>(null);

    const performChoice = useCallback((choiceKey: string, confidence: ConfidenceLevel) => {
        if (!activeProgress || !currentScene) return;
        if (countdownRef.current) clearInterval(countdownRef.current);
        setTimeLeft(null);
        setPendingChoice(null);
        const choiceObj = currentScene.choices?.find((c: any) => c.label === choiceKey || c.id === choiceKey);

        const progressId = activeProgress.id;
        const sceneId = currentScene.id;
        telemetryService.trackTiming(progressId, sceneId, {
            final_decision_timestamp: new Date().toISOString(),
        });
        telemetryService.trackDecision(progressId, sceneId, {
            player_decision_type: 'trust',
            decision_confidence_level: confidence,
        });
        telemetryService.flush(progressId, sceneId);

        submitChoice(currentScene.id, choiceKey, choiceObj?.label || choiceKey, confidence);
    }, [activeProgress, currentScene, submitChoice]);

    const handleChoice = useCallback((choiceKey: string) => {
        if (!activeProgress || !currentScene) return;
        const choiceObj = currentScene.choices?.find((c: any) => c.label === choiceKey || c.id === choiceKey);
        setPendingChoice({ key: choiceKey, label: choiceObj?.label || choiceKey });
    }, [activeProgress, currentScene]);

    // Keep a ref so the countdown interval sees the latest pending choice.
    const pendingChoiceRef = useRef<{ key: string; label: string } | null>(null);
    useEffect(() => { pendingChoiceRef.current = pendingChoice; }, [pendingChoice]);

    // Decision timer: when it expires the network "reacts without you"
    useEffect(() => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setTimedOut(false);
        setPendingChoice(null);
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
                            // If a choice was picked but the confidence check was still
                            // open, honor it; either way a timed-out decision counts as
                            // a guess (lowest confidence).
                            performChoice(pendingChoiceRef.current?.key ?? choices[0], 1);
                        }