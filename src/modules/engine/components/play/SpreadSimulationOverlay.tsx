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