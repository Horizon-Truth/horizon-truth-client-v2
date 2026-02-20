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

    return (
        <div className={cn("relative flex flex-col items-center justify-center group", className)} style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-white/5"
                />

                {/* Progress Circle */}
                <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    strokeLinecap="round"
                    className={cn("transition-colors duration-500", status.color)}
                />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-full transition-all duration-500 backdrop-blur-sm",
                        status.bg
                    )}
                >
                    <span className={cn("text-2xl font-black italic", status.color)}>
                        {normalizedScore}%
                    </span>
                    <div className={cn("mt-1 opacity-80", status.color)}>
                        {status.icon}
                    </div>
                </motion.div>

                {/* Label Tooltip (Subtle) */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md bg-black/80 border border-white/10",
                        status.color
                    )}>
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Glow/Ambience Effect */}
            <div className={cn(
                "absolute inset-0 rounded-full blur-2xl opacity-20 -z-10 transition-all duration-700",
                status.bg.replace('bg-', 'bg-')
            )} />
        </div>
    );
};
