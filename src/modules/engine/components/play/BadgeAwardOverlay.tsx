import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

interface Badge {
    id: string;
    name: string;
    description: string;
    icon?: string;
}

interface BadgeAwardOverlayProps {
    badge: Badge;
    onClose: () => void;
}

export const BadgeAwardOverlay: React.FC<BadgeAwardOverlayProps> = ({ badge, onClose }) => {
    const [audioPlayed, setAudioPlayed] = useState(false);

    useEffect(() => {
        // Placeholder for sound cue logic
        if (!audioPlayed) {
            console.log('PLAYING SOUND: DEEP_AWARD_CUE');
            setAudioPlayed(true);
        }
    }, [audioPlayed]);

    // Simple confetti particles
    const particles = Array.from({ length: 20 });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        >
            {/* Dark Backdrop with Spotlight */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)] animate-pulse" />

            {/* Confetti Particles */}
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: Math.random() * 0.5 + 0.5,
                        rotate: 0
                    }}
                    animate={{
                        x: (Math.random() - 0.5) * 1000,
                        y: (Math.random() - 0.5) * 1000,
                        opacity: 0,
                        rotate: Math.random() * 720
                    }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    className={cn(
                        "absolute w-2 h-2 rounded-sm",
                        ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500"][i % 5]
                    )}
                    style={{ left: '50%', top: '50%' }}
                />
            ))}

            {/* Main Content Container */}
            <div className="relative z-10 flex flex-col items-center max-w-lg text-center px-6">

                {/* 3D Rotating Badge Wrapper */}
                <div className="relative mb-12">
                    {/* Outer Glows */}
                    <div className="absolute inset-0 blur-[100px] bg-blue-500/30 rounded-full animate-pulse" />
                    <div className="absolute inset-0 blur-[40px] bg-blue-400/20 rounded-full" />

                    <motion.div
                        initial={{ scale: 0, rotateY: 360, rotateZ: -10 }}
                        animate={{ scale: 1, rotateY: 0, rotateZ: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            duration: 1.5
                        }}
                        className="relative w-48 h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-[3rem] shadow-2xl flex items-center justify-center border-4 border-white/20"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <Award size={96} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />

                        {/* Shine Effect */}
                        <motion.div
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                        />
                    </motion.div>

                    {/* Floating Sparkles around badge */}
                    <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-4 -right-4 text-amber-400"
                    >
                        <Sparkles size={32} />
                    </motion.div>
                </div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">Security Clearance Level Up</span>
                        <h2 className="text-6xl font-black italic uppercase italic tracking-tighter text-white">
                            Achievement Unlocked_
                        </h2>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-2xl font-bold text-blue-100 mb-2">{badge.name}</p>
                        <p className="text-blue-200/60 font-medium italic">
                            "{badge.description}"
                        </p>
                    </div>

                    <div className="pt-8">
                        <Button
                            size="lg"
                            onClick={onClose}
                            className="h-16 px-12 rounded-2xl bg-white text-black font-black hover:bg-white/90 group uppercase tracking-widest"
                        >
                            Return to Protocol
                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </motion.div>
    );
};
