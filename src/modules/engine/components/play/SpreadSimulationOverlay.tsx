import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Users, Share2, TrendingDown, X } from 'lucide-react';

interface SpreadSimulation {
    reach: number;
    reshares: number;
    credibility_loss: number;
}

interface SpreadSimulationOverlayProps {
    simulation: SpreadSimulation;
    onClose: () => void;
    choiceLabel: string;
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const duration = 1800;
        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.round(target * eased));
            if (progress >= 1) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [target]);

    return (
        <span className="tabular-nums">
            {current.toLocaleString()}{suffix}
        </span>
    );
}

export function SpreadSimulationOverlay({ simulation, onClose, choiceLabel }: SpreadSimulationOverlayProps) {
    const [phase, setPhase] = useState<'warning' | 'stats' | 'done'>('warning');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('stats'), 1000);
        return () => clearTimeout(t1);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 backdrop-blur-xl"
                onClick={onClose}
            >
                {/* Animated red pulse rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.3, opacity: 0.6 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
                            className="absolute w-40 h-40 rounded-full border border-red-500/40"
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0.8, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative w-full max-w-lg mx-4 bg-[#0E1015] border border-red-500/30 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(239,68,68,0.2)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-900/60 to-red-800/30 border-b border-red-500/20 p-6 flex items-center gap-4">
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0"
                        >
                            <AlertTriangle className="text-red-400" size={24} />
                        </motion.div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400/70">MISINFORMATION SPREAD DETECTED</p>
                            <h2 className="font-black text-lg text-white leading-tight">You chose: <span className="text-red-400">{choiceLabel}</span></h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-auto p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="p-6 space-y-6">
                        <p className="text-sm text-muted-foreground font-medium">
                            Within <span className="text-white font-bold">2 hours</span>, your action triggered:
                        </p>

                        <AnimatePresence>
                            {phase === 'stats' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    {/* Reach */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center"
                                    >
                                        <Users className="text-red-400 mx-auto mb-2" size={20} />
                                        <div className="text-2xl font-black text-red-300">
                                            <AnimatedCounter target={simulation.reach} />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">People Reached</p>
                                    </motion.div>

                                    {/* Reshares */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.25 }}
                                        className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center"
                                    >
                                        <Share2 className="text-orange-400 mx-auto mb-2" size={20} />
                                        <div className="text-2xl font-black text-orange-300">
                                            <AnimatedCounter target={simulation.reshares} />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Reshares</p>
                                    </motion.div>

                                    {/* Credibility Loss */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 text-center"
                                    >
                                        <TrendingDown className="text-purple-400 mx-auto mb-2" size={20} />
                                        <div className="text-2xl font-black text-purple-300">
                                            <AnimatedCounter target={simulation.credibility_loss} suffix="%" />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Credibility Lost</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Spreading visual */}
                        {phase === 'stats' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-3"
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Spread Timeline</p>
                                {['Post shared', 'Influencers amplified', 'Local panic started', 'Fact-checkers alerted'].map((event, i) => (
                                    <motion.div
                                        key={event}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.0 + i * 0.2 }}
                                        className="flex items-center gap-3 text-xs"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                        <span className="text-muted-foreground">{['2min', '15min', '45min', '2hr'][i]}</span>
                                        <span className="text-white/80">{event}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: phase === 'stats' ? 1.5 : 0.5 }}
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
                        >
                            Understood — Continue Mission
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
