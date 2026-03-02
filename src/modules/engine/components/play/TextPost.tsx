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
        >
            <div className="p-4 flex gap-3">
                <Avatar className="w-12 h-12 border border-white/10">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=HS&background=0D8ABC&color=fff`} />
                    <AvatarFallback>HS</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 hover:underline cursor-pointer truncate">Horizon Systems</span>
                            <span className="text-[10px] sm:text-xs md:text-sm text-slate-500 truncate">@horizon_intel · 12m</span>
                        </div>
                        <button className="text-muted-foreground hover:text-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary rounded-md p-1 flex-shrink-0">
                            <MoreHorizontal className="w-5 h-5 cursor-pointer" />
                        </button>
                    </div>

                    <div className="mt-2 space-y-4">
                        <p className="text-[15px] sm:text-[17px] text-slate-800 leading-normal whitespace-pre-wrap">
                            {content?.textBody || scene.description}
                        </p>

                        {/* Contextual Action Menu */}
                        {scene.availableChoices.length > 0 && (
                            <div className="pt-4 sm:pt-6 border-t border-white/5 space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Contextual Response</span>
                                </div>
                                <div className="space-y-2">
                                    {scene.availableChoices.map((choice: string, index: number) => (
                                        <motion.button
                                            key={choice}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.01, x: 2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onChoice?.(choice)}
                                            className={cn(
                                                "w-full p-4 sm:p-6 h-auto rounded-2xl sm:rounded-3xl text-left transition-all relative overflow-hidden group/btn",
                                                "bg-slate-50 border border-slate-200 hover:border-primary/40 hover:bg-primary/5",
                                                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                                                isLoading && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                                                <div className={cn(
                                                    "w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center font-black text-xs sm:text-sm transition-colors group-hover/btn:bg-primary group-hover/btn:text-white",
                                                    isLoading && "animate-pulse bg-primary/20"
                                                )}>
                                                    {isLoading ? "..." : index + 1}
                                                </div>
                                                <span className="text-sm sm:text-base font-bold text-slate-700 leading-tight">{choice}</span>
                                            </div>

                                            <span className={cn(
                                                "absolute left-0 top-0 bottom-0 w-1 bg-primary/40 scale-y-0 transition-transform origin-top group-hover/btn:scale-y-100",
                                                isLoading && "scale-y-100 animate-pulse"
                                            )} />

                                            {isLoading && (
                                                <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between pt-4 max-w-sm text-slate-500 font-black gap-y-4 gap-x-4 sm:gap-x-6">
                            <button className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer hover:text-blue-600 transition-all active:scale-90 focus-visible:ring-1 focus-visible:ring-blue-600 rounded-xl p-2 sm:p-3 -m-2 sm:-m-3">
                                <div className="p-1.5 sm:p-2 group-hover:bg-blue-600/10 rounded-full transition-colors">
                                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="text-xs sm:text-sm">42</span>
                            </button>
                            <button
                                onClick={handleShareClick}
                                className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer hover:text-emerald-600 transition-all active:scale-90 focus-visible:ring-1 focus-visible:ring-emerald-600 rounded-xl p-2 sm:p-3 -m-2 sm:-m-3"
                            >
                                <div className="p-1.5 sm:p-2 group-hover:bg-emerald-600/10 rounded-full transition-colors">
                                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="text-xs sm:text-sm">1.2K</span>
                            </button>
                            <button className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer hover:text-rose-600 transition-all active:scale-90 focus-visible:ring-1 focus-visible:ring-rose-600 rounded-xl p-2 sm:p-3 -m-2 sm:-m-3">
                                <div className="p-1.5 sm:p-2 group-hover:bg-rose-600/10 rounded-full transition-colors">
                                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="text-xs sm:text-sm">15.4K</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

TextPost.displayName = 'TextPost';
