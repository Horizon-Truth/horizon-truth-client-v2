import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Share2, AlertCircle } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { cn } from '@/shared/lib/utils';

interface NetworkPropagationMapProps {
    scene: Scene;
}

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    id: number;
    isInfected: boolean;
    infectedAt: number | null;
    panicLevel: number; // 0 to 1
    links: number[];
}

export const NetworkPropagationMap: React.FC<NetworkPropagationMapProps> = ({ scene }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [propagationPercentage, setPropagationPercentage] = useState(0);
    const [activeNodesCount, setActiveNodesCount] = useState(0);
    const [isGlitching, setIsGlitching] = useState(false);
