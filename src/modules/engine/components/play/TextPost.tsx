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
            transition={{ duration: 0.8, delay: 0.5 }}
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

                        {/* Contextual Action Menu */}
                        {scene.availableChoices.length > 0 && (
                            <div className="pt-6 border-t border-white/5 space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Contextual Response</span>
                                </div>
                                <div className="space-y-2">
                                    {scene.availableChoices.map((choice) => (
                                        <motion.button
                                            key={choice}
                                            disabled={isLoading}
                                            whileHover={{
                                                x: 5,
                                                backgroundColor: "rgba(255, 255, 255, 0.03)"
                                            }}
                                            whileTap={{
                                                scale: 0.98,
                                                x: [0, -2, 2, -2, 2, 0], // Micro vibration
                                            }}
                                            onClick={() => onChoice?.(choice)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold transition-all relative overflow-hidden group",
                                                "hover:border-primary/40 hover:text-primary",
                                                isLoading && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {/* Ripple Simulation */}
                                            <div className="absolute inset-0 bg-primary/10 scale-0 group-active:scale-150 transition-transform duration-500 rounded-full opacity-0 group-active:opacity-100 pointer-events-none" />

                                            <span className="relative z-10">{choice}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary group-hover:scale-150 transition-all shadow-[0_0_10px_transparent] group-hover:shadow-primary/50" />
                                        </motion.button>
                                    ))}
                                </div>
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
