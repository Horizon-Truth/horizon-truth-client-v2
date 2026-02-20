import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Eye } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { cn } from '@/shared/lib/utils';

interface ChatStreamProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const ChatStream: React.FC<ChatStreamProps> = ({ scene, onChoice, isLoading }) => {
    const [visibleMessages, setVisibleMessages] = useState<any[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messages = scene.content?.chatMessages || [];

    useEffect(() => {
        setVisibleMessages([]);
        let mounted = true;

        const showMessages = async () => {
            for (let i = 0; i < messages.length; i++) {
                if (!mounted) break;

                setIsTyping(true);
                // Simulate typing delay
                await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

                if (!mounted) break;
                setIsTyping(false);
                setVisibleMessages(prev => [...prev, messages[i]]);

                // Gap between messages
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        };

        showMessages();
        return () => { mounted = false; };
    }, [messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [visibleMessages, isTyping]);

    return (
        <div className="flex flex-col h-[400px] border border-white/5 rounded-2xl bg-[#0F1721] overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">TG</div>
                    <div>
                        <p className="text-sm font-bold leading-tight">Intel Channel Alpha</p>
                        <p className="text-[10px] text-blue-400">12,492 subscribers</p>
                    </div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar scroll-smooth"
            >
                <AnimatePresence initial={false}>
                    {visibleMessages.map((msg, idx) => (
                        <motion.div
                            key={msg.id || idx}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={cn(
                                "max-w-[85%] rounded-2xl p-3 relative shadow-md",
                                msg.sender === 'USER'
                                    ? "bg-blue-600 ml-auto rounded-tr-none"
                                    : "bg-[#212D3B] mr-auto rounded-tl-none"
                            )}
                        >
                            {msg.sender !== 'USER' && (
                                <p className="text-[11px] font-bold text-blue-400 mb-1">Forwarded from @intel_leak</p>
                            )}
                            <p className="text-sm text-white leading-relaxed">{msg.message}</p>
                            <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                                <span className="text-[10px]">14:2{idx}</span>
                                {msg.sender === 'USER' ? <CheckCheck size={12} /> : <Check size={12} />}
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-[#212D3B] rounded-2xl rounded-tl-none p-3 mr-auto flex gap-1 items-center"
                        >
                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Telegram-style Inline Choice Keyboard */}
                {!isTyping && scene.availableChoices.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 gap-1.5 pt-4"
                    >
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <span className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">Select Operation</span>
                            <div className="h-[1px] flex-1 bg-blue-400/20" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {scene.availableChoices.map((choice) => (
                                <motion.button
                                    key={choice}
                                    disabled={isLoading}
                                    whileHover={{
                                        backgroundColor: "rgba(59, 130, 246, 0.15)",
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                        x: [0, -2, 2, -2, 2, 0], // Micro vibration
                                        transition: { duration: 0.1 }
                                    }}
                                    onClick={() => onChoice?.(choice)}
                                    className={cn(
                                        "w-full p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-sm font-bold text-blue-400 transition-all duration-200 text-center relative overflow-hidden group/btn",
                                        "hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
                                        isLoading && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {/* Subtle Ripple Effect Simulation */}
                                    <div className="absolute inset-0 bg-blue-400/10 scale-0 group-active/btn:scale-150 transition-transform duration-500 rounded-full opacity-0 group-active/btn:opacity-100 pointer-events-none" />

                                    <span className="relative z-10">{choice}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-2 px-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye size={14} />
                    <span className="text-[10px] font-bold">154.2K views</span>
                </div>
                <button className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Join Channel</button>
            </div>
        </div>
    );
};
