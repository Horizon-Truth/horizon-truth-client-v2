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