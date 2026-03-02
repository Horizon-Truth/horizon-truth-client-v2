import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface TrustMeterProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export const TrustMeter: React.FC<TrustMeterProps> = ({
    score,
    size = 120,
    strokeWidth = 8,
    className
}) => {
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Normalize score to 0-100
    const normalizedScore = Math.min(100, Math.max(0, score));
    const offset = circumference - (normalizedScore / 100) * circumference;

    // Color logic
    const status = useMemo(() => {
        if (normalizedScore > 70) return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20', label: 'High Trust', icon: <ShieldCheck size={20} /> };
        if (normalizedScore > 30) return { color: 'text-amber-500', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20', label: 'Neutral', icon: <Shield size={20} /> };
        return { color: 'text-red-500', bg: 'bg-red-500/10', glow: 'shadow-red-500/20', label: 'Dangerous', icon: <ShieldAlert size={20} /> };
    }, [normalizedScore]);
