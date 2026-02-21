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