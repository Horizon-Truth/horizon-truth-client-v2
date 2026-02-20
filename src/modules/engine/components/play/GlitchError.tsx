import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Terminal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface GlitchErrorProps {
    message?: string;
    onRetry?: () => void;
}

export const GlitchError: React.FC<GlitchErrorProps> = ({ message, onRetry }) => {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-lg bg-[#0F0F0F] border border-red-500/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]"
            >
                {/* Glitch Overlay */}
                <motion.div
                    animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="absolute inset-0 bg-red-500/5 pointer-events-none"
                />

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 text-red-500">
                        <div className="p-3 bg-red-500/10 rounded-2xl">
                            <AlertTriangle size={32} className="animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-widest italic">Signal Interference</h2>
                            <p className="text-[10px] font-mono opacity-60">CRITICAL_PROTOCOL_FAIL // ERROR_0x429</p>
                        </div>
                    </div>

                    <div className="bg-black/50 p-4 rounded-2xl border border-white/5 font-mono text-sm space-y-2">
                        <div className="flex items-center gap-2 text-white/40">
                            <Terminal size={14} />
                            <span>System Log:</span>
                        </div>
                        <p className="text-red-400 leading-relaxed font-bold">
                            {message || "The uplink has been compromised. Integrity check failed."}
                        </p>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <Button
                            onClick={onRetry}
                            className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/20"
                        >
                            <RefreshCcw size={20} className="mr-2" />
                            Reboot Protocol
                        </Button>
                        <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
                            Authorized personnel only // Zero-Trust architecture active
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
