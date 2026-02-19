import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Activity, Scan } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { useGameStore } from '@/store/game.store';

interface VideoPlayerProps {
    scene: Scene;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ scene }) => {
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
                        <p className="flex justify-between"><span>PROBABILITY:</span> <span>{(Math.random() * 20 + 75).toFixed(2)}%</span></p>
                        <p className="flex justify-between"><span>ALGORITHM:</span> <span>HZN_NEURAL_V4</span></p>
                    </div>
                </div>
            )}

            {/* UI Overlays */}
            <div className="absolute top-6 left-6 z-40 flex items-center gap-3">
                <div className="px-3 py-1 bg-red-600 rounded text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" /> Live
                </div>
                <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-mono text-white/80 uppercase">
                    Rec: 00:04:21:09
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-40 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-primary transition-colors">
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-primary transition-colors">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "45%" }}
                        />
                    </div>
                </div>
                <Maximize size={20} className="text-white hover:text-primary cursor-pointer" />
            </div>

            {/* Night Vision Reticle */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-30">
                <div className="w-64 h-64 border border-emerald-500/20 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 border border-emerald-500/40 rounded-full" />
                    <div className="absolute w-full h-[1px] bg-emerald-500/20" />
                    <div className="absolute h-full w-[1px] bg-emerald-500/20" />
                </div>
            </div>
        </div>
    );
};
