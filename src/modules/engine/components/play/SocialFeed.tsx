import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquare, Heart, Bookmark, BarChart3, MoreHorizontal, Redo2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { type Scene } from '@/services/engine.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useGameStore } from '@/store/game.store';
import { telemetryService } from '@/services/telemetry.service';

interface SocialFeedProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const SocialFeed: React.FC<SocialFeedProps> = memo(({ scene, onChoice, isLoading }) => {
    const feedItems = scene.content?.feedItems || [];
    const { activeProgress } = useGameStore();

    // Track social context exposure when feed mounts
    React.useEffect(() => {
        if (!activeProgress?.id || !scene.id) return;