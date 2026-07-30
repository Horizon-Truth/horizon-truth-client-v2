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
                duration: 2.2 + Math.random() * 1.6,
                size: 6 + Math.random() * 6,
                color: COLORS[i % COLORS.length],
                rotate: Math.random() * 360,
                drift: (Math.random() - 0.5) * 30,
            })),
        [pieces]
    );

    if (reduceMotion) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden" aria-hidden>
            {items.map(p => (
                <motion.span
                    key={p.id}
                    initial={{ x: `${p.x}vw`, y: '-5vh', rotate: 0, opacity: 1 }}
                    animate={{
                        y: '105vh',
                        x: `${p.x + p.drift}vw`,
                        rotate: p.rotate + 360,
                        opacity: [1, 1, 0.9, 0],
                    }}
                    transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size * 0.45,
                        backgroundColor: p.color,
                        borderRadius: 2,
                    }}
                />
            ))}
        </div>
    );
});
