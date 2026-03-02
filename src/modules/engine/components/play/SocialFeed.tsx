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

    return (
        <div
            className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-8"
            onScroll={handleScroll}
        >
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 pb-2 mb-4">
                <h3 className="text-sm font-bold tracking-tight uppercase px-4 pt-2 text-slate-900">Global Live Feed</h3>
            </div>

            {feedItems.sort((a: any, b: any) => a.itemOrder - b.itemOrder).map((item: any, idx: number) => (
                <FeedItem key={item.id || idx} item={item} index={idx} />
            ))}

            {/* Social Reaction-style Choice Bar */}
            {scene.availableChoices.length > 0 && (
                <div className="sticky bottom-4 left-0 right-0 flex justify-center px-2 sm:px-4">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="p-1.5 rounded-3xl sm:rounded-full bg-slate-50/90 backdrop-blur-xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-wrap justify-center items-center gap-1"
                    >
                        {scene.availableChoices.map((choice: string) => (
                            <motion.button
                                key={choice}
                                disabled={isLoading}
                                whileHover={{
                                    scale: 1.05,