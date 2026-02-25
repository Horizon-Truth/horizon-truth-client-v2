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

    return (
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
            {/* Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Night Vision Filter (Simulated with Green tint and Vignette) */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-30 bg-emerald-500/10 shadow-[inner_0_0_100px_rgba(0,0,0,0.8)]" />

            {/* Video Content */}
            <div className="absolute inset-0 flex items-center justify-center">
                {videoUrl ? (
                    <iframe
                        src={`${videoUrl}?autoplay=1&mute=1&controls=0&loop=1`}
                        className="w-full h-full scale-110 pointer-events-none"
                        allow="autoplay"
                    />