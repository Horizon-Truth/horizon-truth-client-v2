import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface TrustMeterProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    className?: string;