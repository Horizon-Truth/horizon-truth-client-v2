import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquare, Heart, Bookmark, BarChart3, MoreHorizontal, Redo2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { type Scene } from '@/services/engine.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useGameStore } from '@/store/game.store';
import { telemetryService } from '@/services/telemetry.service';

interface SocialFeedProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const SocialFeed: React.FC<SocialFeedProps> = memo(({ scene, onChoice, isLoading }) => {
    const feedItems = scene.content?.feedItems || [];
    const { activeProgress } = useGameStore();

    // Track social context exposure when feed mounts
    React.useEffect(() => {
        if (!activeProgress?.id || !scene.id) return;
        telemetryService.trackSocialContext(activeProgress.id, scene.id, {
            social_context_exposed: 'peer',
            social_metrics_visible: true,
            like_count_shown: feedItems.length * 500, // Aggregate fake numbers
            share_count_shown: feedItems.length * 100,
            comment_count_shown: feedItems.length * 20,
            authority_badge_visible: false
        });
    }, [activeProgress?.id, scene.id, feedItems.length]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const scrollPercent = Math.round((target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100);

        if (!activeProgress?.id || !scene.id || isNaN(scrollPercent)) return;

        // Track Scroll Depth
        telemetryService.trackConsumption(activeProgress.id, scene.id, {
            scroll_depth_percent: scrollPercent,
            paragraphs_viewed: Math.floor((scrollPercent / 100) * feedItems.length),
        });
    };
