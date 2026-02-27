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