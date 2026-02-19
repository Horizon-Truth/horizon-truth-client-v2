import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Bookmark, BarChart3, MoreHorizontal } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { type Scene } from '@/services/engine.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

interface SocialFeedProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ scene, onChoice, isLoading }) => {
    const feedItems = scene.content?.feedItems || [];

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-8">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/5 pb-2 mb-4">
                <h3 className="text-sm font-bold tracking-tight uppercase px-4 pt-2">Global Live Feed</h3>
            </div>

            {feedItems.sort((a: any, b: any) => a.itemOrder - b.itemOrder).map((item: any, idx: number) => (
                <FeedItem key={item.id || idx} item={item} index={idx} />
            ))}

            {/* Contextual Options Menu */}
            {scene.availableChoices.length > 0 && (
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <div className="p-4 rounded-2xl bg-[#1A1D21] border border-white/10 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Contextual Actions</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {scene.availableChoices.map((choice) => (
                                <motion.button
                                    key={choice}
                                    disabled={isLoading}
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor: "rgba(var(--primary), 0.1)",
                                        borderColor: "rgba(var(--primary), 0.4)"
                                    }}
                                    whileTap={{
                                        scale: 0.95,
                                        y: [0, -1, 1, -1, 1, 0], // Micro vibration
                                    }}
                                    onClick={() => onChoice?.(choice)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold transition-all relative overflow-hidden",
                                        "hover:text-primary",
                                        isLoading && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {choice}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FeedItem = ({ item, index }: { item: any, index: number }) => {
    // Generate realistic engagement numbers
    const views = (Math.random() * 50 + 10).toFixed(1) + 'K';
    const likes = Math.floor(Math.random() * 2000 + 100);
    const shares = Math.floor(Math.random() * 500 + 50);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative border-b border-white/5 last:border-0 pb-6 mb-6"
        >
            <div className="flex gap-4">
                <Avatar className="w-10 h-10 border border-white/5">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=U${index}&background=random`} />
                    <AvatarFallback>U{index}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-sm truncate hover:underline cursor-pointer">
                                {item.title || "Anonymous Source"}
                            </span>
                            <span className="text-muted-foreground text-xs">@user_{index}72</span>
                            <span className="text-muted-foreground text-xs">· {index + 1}m</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                    </div>

                    <div className="mt-1 space-y-3">
                        <p className="text-sm text-white/90 leading-relaxed font-medium">
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
                            <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
                                <MessageSquare size={16} />
                                <span className="text-xs">{shares}</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer">
                                <BarChart3 size={16} />
                                <span className="text-xs">{views}</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer text-rose-400/80">
                                <Heart size={16} fill="currentColor" className="fill-rose-400/20" />
                                <span className="text-xs">{likes}</span>
                            </div>
                            <Bookmark size={16} className="hover:text-primary transition-colors cursor-pointer" />
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
