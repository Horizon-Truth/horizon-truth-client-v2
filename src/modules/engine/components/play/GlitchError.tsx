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