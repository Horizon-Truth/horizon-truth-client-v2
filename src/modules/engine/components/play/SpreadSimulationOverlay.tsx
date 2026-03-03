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