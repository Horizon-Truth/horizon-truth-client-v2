import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, MessageCircle, Share2, Heart } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';

interface TextPostProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const TextPost: React.FC<TextPostProps> = ({ scene, onChoice, isLoading }) => {
    const { content } = scene;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                        <MoreHorizontal className="text-muted-foreground w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                    </div>

                    <div className="mt-2 space-y-4">
                        <p className="text-[17px] text-white/90 leading-normal whitespace-pre-wrap">
                            {content?.textBody || scene.description}
                        </p>

                        {/* Reaction-style Choices */}
                        {scene.availableChoices.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                {scene.availableChoices.map((choice) => (
                                    <motion.button
                                        key={choice}
                                        disabled={isLoading}
                                        whileHover={{
                                            scale: 1.1,
                                            y: -2,
                                            backgroundColor: "rgba(255, 255, 255, 0.08)"
                                        }}
                                        whileTap={{
                                            scale: 0.95,
                                            rotate: [0, -2, 2, -2, 2, 0], // Micro vibration
                                        }}
                                        onClick={() => onChoice?.(choice)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium transition-all relative overflow-hidden",
                                            "hover:border-primary/50 hover:text-primary",
                                            isLoading && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                                        {choice}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2 max-w-sm text-muted-foreground">
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-blue-400 transition-colors">
                                <div className="p-2 group-hover:bg-blue-400/10 rounded-full transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <span className="text-sm">42</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-emerald-400 transition-colors">
                                <div className="p-2 group-hover:bg-emerald-400/10 rounded-full transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <span className="text-sm">1.2K</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-rose-400 transition-colors">
                                <div className="p-2 group-hover:bg-rose-400/10 rounded-full transition-colors">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <span className="text-sm">15.4K</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
