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