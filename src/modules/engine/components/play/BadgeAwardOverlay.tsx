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