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
                ) : (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-4">
                        <Activity className="w-12 h-12 text-emerald-500 animate-pulse" />
                        <span className="font-mono text-xs text-emerald-500/60 uppercase tracking-[0.3em]">Encrypted Feed Intercepted</span>
                    </div>
                )}
            </div>

            {/* AI Detection Overlay (Level 2+) */}
            {stats.level >= 2 && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                    {/* Scanning Bar */}
                    <motion.div
                        className="absolute inset-x-0 h-1 bg-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-40"
                        style={{ top: `${scanProgress}%` }}
                        animate={shouldReduceMotion ? { opacity: [0.3, 0.6] } : {}}
                        transition={shouldReduceMotion ? { duration: 2, repeat: Infinity, repeatType: 'reverse' } : {}}
                    />

                    {/* Bounding Boxes */}
                    <div className="absolute top-[20%] left-[30%] w-32 h-32 border border-red-500/60 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <div className="w-2 h-2 border-t border-l border-red-500" />
                            <div className="w-2 h-2 border-t border-r border-red-500" />
                        </div>
                        <div className="absolute -top-6 left-0 bg-red-500/80 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase flex items-center gap-1">
                            <Scan size={8} /> Target_ID: Unknown
                        </div>
                        <div className="flex justify-between">
                            <div className="w-2 h-2 border-b border-l border-red-500" />
                            <div className="w-2 h-2 border-b border-r border-red-500" />
                        </div>
                    </div>

                    <div className="absolute bottom-[10%] right-[10%] p-4 bg-black/40 backdrop-blur-md border border-white/10 font-mono text-[10px] text-red-400 space-y-1">
                        <p className="flex justify-between gap-8"><span>DETECTION_STATE:</span> <span className="animate-pulse">ANALYZING...</span></p>