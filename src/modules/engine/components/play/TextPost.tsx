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
