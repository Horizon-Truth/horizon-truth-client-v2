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

    // Simulation settings from scene content or defaults
    const NODE_COUNT = scene.content?.nodeCount || 40;
    const MAX_LINKS = scene.content?.maxLinks || 3;
    const SPREAD_PROBABILITY = scene.content?.spreadProbability || 0.005;

    const nodes = useRef<Node[]>([]);
    const animationFrame = useRef<number>(0);

    // Initialize network
    useEffect(() => {
        const width = canvasRef.current?.offsetWidth || 800;
        const height = canvasRef.current?.offsetHeight || 500;

        // Create nodes
        const newNodes: Node[] = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            newNodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                id: i,
                isInfected: i === 0, // Start with one node infected
                infectedAt: i === 0 ? Date.now() : null,
                panicLevel: i === 0 ? 1 : 0,
                links: []
            });