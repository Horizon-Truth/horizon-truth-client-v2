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
                <div className="sticky bottom-4 left-0 right-0 flex justify-center px-4">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="p-1.5 rounded-full bg-slate-50/90 backdrop-blur-xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-1"
                    >
                        {scene.availableChoices.map((choice: string) => (
                            <motion.button
                                key={choice}
                                disabled={isLoading}
                                whileHover={{
                                    scale: 1.2,
                                    y: -8,
                                    backgroundColor: "rgba(255, 255, 255, 0.05)"
                                }}
                                whileTap={{
                                    scale: 0.9,
                                    rotate: [0, -5, 5, -5, 5, 0],
                                }}
                                onClick={() => onChoice?.(choice)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-base font-bold transition-all relative overflow-hidden flex items-center gap-2",
                                    "text-slate-600 hover:text-primary",
                                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                                    isLoading && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    isLoading ? "bg-primary animate-pulse" : "bg-primary/40"
                                )} />
                                {choice}
                                {isLoading && (
                                    <div className="absolute inset-0 bg-primary/5 flex items-center justify-center backdrop-blur-[1px]">
                                        <div className="w-1 h-4 bg-primary animate-[stretch_1s_infinite]" />
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    );
});

SocialFeed.displayName = 'SocialFeed';

const FeedItem = ({ item, index }: { item: any, index: number }) => {
    const shouldReduceMotion = useReducedMotion();
    const { activeProgress } = useGameStore();
    // Generate realistic engagement numbers
    const views = (Math.random() * 50 + 10).toFixed(1) + 'K';
    const likes = Math.floor(Math.random() * 2000 + 100);
    const shares = Math.floor(Math.random() * 500 + 50);

    const handleShareClick = () => {
        if (!activeProgress?.id) return;
        const sceneId = activeProgress.currentScene?.id;
        if (!sceneId) return;

        telemetryService.trackDissemination(activeProgress.id, sceneId, {
            share_clicked: true,
            share_channel_type: 'public',
            share_count: shares + 1
        });
    };

    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: shouldReduceMotion ? 0.1 : 0.8 + (index * 0.2) }}
            className="group relative border-b border-slate-100 last:border-0 pb-6 mb-6"
        >
            <div className="flex gap-4">
                <Avatar className="w-10 h-10 border border-white/5">
                    <AvatarImage src={item.avatarUrl || `https://ui-avatars.com/api/?name=${item.authorName || 'Anon'}&background=random`} />
                    <AvatarFallback>{(item.authorName || 'A').charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-sm truncate hover:underline cursor-pointer text-slate-900">
                                {item.authorName || "Anonymous Source"}
                            </span>
                            <span className="text-slate-500 text-xs">@{item.authorUsername || `user_${index}72`}</span>
                            <span className="text-slate-500 text-xs">· {index + 1}m</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                    </div>

                    <div className="mt-1 space-y-3">
                        {/* Forwarded Tag */}
                        <div className="flex items-center gap-1 text-primary brightness-125 italic">
                            <Redo2 size={14} className="-scale-x-100" />
                            <span className="text-xs font-black uppercase tracking-tight">Forwarded many times</span>
                        </div>

                        <p className="text-base text-slate-800 leading-relaxed font-medium">
                            {item.description}
                        </p>

                        {item.mediaUrl && (
                            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative group/media">
                                <img
                                    src={item.mediaUrl}
                                    alt="Post media"
                                    className="w-full h-full object-cover transition-transform group-hover/media:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity" />
                            </div>
                        )}

                        <div className="flex items-center justify-between text-muted-foreground pt-1 pr-8">
                            <button
                                onClick={handleShareClick}
                                className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-blue-400 rounded-md p-1 -m-1"
                            >
                                <MessageSquare size={18} />
                                <span className="text-sm font-bold">{shares}</span>
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-emerald-400 rounded-md p-1 -m-1">
                                <BarChart3 size={18} />
                                <span className="text-sm font-bold">{views}</span>
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer text-rose-400/80 focus-visible:ring-1 focus-visible:ring-rose-400 rounded-md p-1 -m-1">
                                <Heart size={18} fill="currentColor" className="fill-rose-400/20" />
                                <span className="text-sm font-bold">{likes}</span>
                            </button>
                            <button className="hover:text-primary transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-primary rounded-md p-1 -m-1">
                                <Bookmark size={18} />
                            </button>
                        </div>

                        {/* Fake Comment Thread */}
                        <div className="pt-2 space-y-3 border-t border-slate-100">
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0" />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold">anon_operative</span>
                                        <span className="text-[10px] text-muted-foreground">· 1m</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-tight">Can anyone verify the source of this intel? Looks suspicious.</p>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-60">
                                <div className="w-6 h-6 rounded-full bg-white/5 flex-shrink-0" />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold">sector_7_bot</span>
                                        <span className="text-[10px] text-muted-foreground">· 34s</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-tight">Confirmed through secondary uplink. Proceed with caution.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {index === 0 && (
                <div className="absolute -left-12 top-0 bottom-0 w-1 bg-primary/40 rounded-full" />
            )}
        </motion.div>
    );
};
