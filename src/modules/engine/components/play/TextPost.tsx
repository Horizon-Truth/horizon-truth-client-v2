import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MoreHorizontal, MessageCircle, Share2, Heart } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { useGameStore } from '@/store/game.store';
import { telemetryService } from '@/services/telemetry.service';

interface TextPostProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const TextPost: React.FC<TextPostProps> = memo(({ scene, onChoice, isLoading }) => {
    const shouldReduceMotion = useReducedMotion();
    const { content } = scene;
    const { activeProgress } = useGameStore();

    // Track social context exposure when mounted
    React.useEffect(() => {
        if (!activeProgress?.id || !scene.id) return;
        telemetryService.trackSocialContext(activeProgress.id, scene.id, {
            social_context_exposed: 'authority', // Mocking for now based on UI
            social_metrics_visible: true,
            like_count_shown: 15400,
            share_count_shown: 1200,
            comment_count_shown: 42,
            authority_badge_visible: true
        });
    }, [activeProgress?.id, scene.id]);

    const handleShareClick = () => {
        if (!activeProgress?.id || !scene.id) return;
        telemetryService.trackDissemination(activeProgress.id, scene.id, {
            share_clicked: true,
            share_channel_type: 'public'
        });
    };

    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, delay: 0.5 }}
            className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl"