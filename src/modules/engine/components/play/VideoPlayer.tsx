import React, { useState, useEffect, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Activity, Scan } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { useGameStore } from '@/store/game.store';

interface VideoPlayerProps {
    scene: Scene;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = memo(({ scene }) => {
    const shouldReduceMotion = useReducedMotion();
    const { stats } = useGameStore();
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [scanProgress, setScanProgress] = useState(0);
    const videoUrl = scene.content?.videoUrl;

    // Simulate AI scanning progress
    useEffect(() => {
        if (stats.level >= 2) {
            const interval = setInterval(() => {
                setScanProgress(p => (p + 0.5) % 100);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [stats.level]);
