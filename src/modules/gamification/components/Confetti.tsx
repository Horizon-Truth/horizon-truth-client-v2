import { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['#22c55e', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

/**
 * Lightweight celebration confetti (no external deps).
 * Renders nothing when the user prefers reduced motion.
 */
export const Confetti = memo(function Confetti({ pieces = 60 }: { pieces?: number }) {
    const reduceMotion = useReducedMotion();

    const items = useMemo(
        () =>
            Array.from({ length: pieces }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.8,