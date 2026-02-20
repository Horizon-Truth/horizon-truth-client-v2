import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MoreHorizontal, MessageCircle, Share2, Heart } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';

interface TextPostProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const TextPost: React.FC<TextPostProps> = memo(({ scene, onChoice, isLoading }) => {
    const shouldReduceMotion = useReducedMotion();
    const { content } = scene;

    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, delay: 0.5 }}
            className="w-full bg-[#15181C] border border-white/5 rounded-2xl overflow-hidden shadow-xl"
        >
            <div className="p-4 flex gap-3">
                <Avatar className="w-12 h-12 border border-white/10">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=HS&background=0D8ABC&color=fff`} />
                    <AvatarFallback>HS</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold text-white hover:underline cursor-pointer">Horizon Systems</span>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">@horizon_intel · 12m</span>
                        </div>
                        <button className="text-muted-foreground hover:text-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary rounded-md p-1">
                            <MoreHorizontal className="w-5 h-5 cursor-pointer" />
                        </button>
                    </div>

                    <div className="mt-2 space-y-4">
                        <p className="text-[17px] text-white/90 leading-normal whitespace-pre-wrap">
                            {content?.textBody || scene.description}
                        </p>

                        {/* Contextual Action Menu */}
                        {scene.availableChoices.length > 0 && (
                            <div className="pt-6 border-t border-white/5 space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Contextual Response</span>
                                </div>
                                <div className="space-y-2">
                                    {scene.availableChoices.map((choice: string, index: number) => (
                                        <motion.button
                                            key={choice}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onChoice?.(choice)}
                                            className={cn(
                                                "w-full p-6 h-auto rounded-3xl text-left transition-all relative overflow-hidden group/btn",
                                                "bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5",
                                                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                                                isLoading && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-black text-sm transition-colors group-hover/btn:bg-primary group-hover/btn:text-white",
                                                    isLoading && "animate-pulse bg-primary/20"
                                                )}>
                                                    {isLoading ? "..." : index + 1}
                                                </div>
                                                <span className="text-base font-bold text-white/90">{choice}</span>
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

                        <div className="flex items-center justify-between pt-2 max-w-sm text-muted-foreground font-black">
                            <button className="flex items-center gap-2 group cursor-pointer hover:text-blue-400 transition-colors focus-visible:ring-1 focus-visible:ring-blue-400 rounded-md p-1 -m-1">
                                <div className="p-2 group-hover:bg-blue-400/10 rounded-full transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <span className="text-sm">42</span>
                            </button>
                            <button className="flex items-center gap-2 group cursor-pointer hover:text-emerald-400 transition-colors focus-visible:ring-1 focus-visible:ring-emerald-400 rounded-md p-1 -m-1">
                                <div className="p-2 group-hover:bg-emerald-400/10 rounded-full transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <span className="text-sm">1.2K</span>
                            </button>
                            <button className="flex items-center gap-2 group cursor-pointer hover:text-rose-400 transition-colors focus-visible:ring-1 focus-visible:ring-rose-400 rounded-md p-1 -m-1">
                                <div className="p-2 group-hover:bg-rose-400/10 rounded-full transition-colors">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <span className="text-sm">15.4K</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

TextPost.displayName = 'TextPost';
