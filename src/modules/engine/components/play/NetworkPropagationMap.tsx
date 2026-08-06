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
        }

        // Create random links
        newNodes.forEach((node, i) => {
            const numLinks = Math.floor(Math.random() * MAX_LINKS) + 1;
            for (let j = 0; j < numLinks; j++) {
                const targetIdx = Math.floor(Math.random() * NODE_COUNT);
                if (targetIdx !== i && !node.links.includes(targetIdx)) {
                    node.links.push(targetIdx);
                    newNodes[targetIdx].links.push(i);
                }
            }
        });

        nodes.current = newNodes;

        // Glitch interval
        const glitchInterval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 150);
        }, 3000);

        return () => clearInterval(glitchInterval);
    }, []);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            const width = canvas.width = canvas.offsetWidth;
            const height = canvas.height = canvas.offsetHeight;

            ctx.clearRect(0, 0, width, height);

            // Update Simulation
            let infectedCount = 0;
            nodes.current.forEach(node => {
                // Movement
                node.x += node.vx;
                node.y += node.vy;

                // Bounce
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                if (node.isInfected) {
                    infectedCount++;
                    // Propagate to links
                    node.links.forEach(linkIdx => {
                        const target = nodes.current[linkIdx];
                        if (!target.isInfected && Math.random() < SPREAD_PROBABILITY) {
                            target.isInfected = true;
                            target.infectedAt = Date.now();
                            target.panicLevel = 1;
                        }
                    });
                }
            });

            const targetPercentage = (infectedCount / NODE_COUNT) * 100;
            setPropagationPercentage(prev => {
                const diff = targetPercentage - prev;
                return prev + diff * 0.05;
            });
            setActiveNodesCount(infectedCount);

            // Draw Links
            ctx.setLineDash([]);
            nodes.current.forEach(node => {
                node.links.forEach(linkIdx => {
                    const target = nodes.current[linkIdx];
                    const dist = Math.hypot(target.x - node.x, target.y - node.y);

                    if (dist < 200) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(target.x, target.y);

                        // Animated Ripple / Light between nodes
                        if (node.isInfected || target.isInfected) {
                            const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
                            gradient.addColorStop(0, node.isInfected ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.1)');
                            gradient.addColorStop(1, target.isInfected ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.1)');
                            ctx.strokeStyle = gradient;
                            ctx.lineWidth = 1.5;
                        } else {
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                            ctx.lineWidth = 0.5;
                        }
                        ctx.stroke();
                    }
                });
            });

            // Draw Nodes
            nodes.current.forEach(node => {
                const timeInfected = node.infectedAt ? (Date.now() - node.infectedAt) : 0;

                // Exploding Ripple Effect for newly infected nodes
                if (node.isInfected && timeInfected < 1000) {
                    const rippleSize = (timeInfected / 1000) * 40;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, rippleSize, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(239, 68, 68, ${1 - timeInfected / 1000})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // Core Node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.isInfected ? 4 : 2, 0, Math.PI * 2);
                if (node.isInfected) {
                    ctx.fillStyle = '#EF4444';
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#EF4444';
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
            });

            animationFrame.current = requestAnimationFrame(render);
        };

        animationFrame.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrame.current);
    }, []);

    return (
        <div className="relative w-full aspect-video bg-[#0B0E11] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
            {/* Background Texture / Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Scanlines Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-20">
                <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>

            {/* Canvas Simulation */}
            <canvas
                ref={canvasRef}
                className={cn(
                    "w-full h-full relative z-0 transition-opacity duration-1000",
                    isGlitching && "invert sepia hue-rotate-180 brightness-150"
                )}
            />

            {/* HUD Elements */}
            <div className="absolute inset-0 pointer-events-none z-30 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-red-500">
                            <Zap size={16} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Propagating Viral Vector</span>
                        </div>
                        <h4 className="text-2xl font-black italic tracking-tighter text-white uppercase italic">
                            Network Saturation_
                        </h4>
                    </div>
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Compromised_Nodes</span>
                            <span className="text-xl font-mono font-black text-red-500 leading-none">
                                {activeNodesCount.toString().padStart(3, '0')} / {NODE_COUNT}
                            </span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <Activity className="text-red-500 animate-pulse" />
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-7xl font-mono font-black text-white tracking-tighter leading-none flex items-baseline gap-2">
                                {Math.floor(propagationPercentage).toString().padStart(2, '0')}
                                <span className="text-2xl text-red-500">%</span>
                            </span>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-1.5 w-64 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        className="h-full bg-red-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${propagationPercentage}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <span className="text-[11px] font-mono text-white/50 animate-pulse">CRITICAL_LEVEL</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <Share2 size={12} className="text-blue-400" />
                                <span className="text-[9px] font-black text-white/80 uppercase">Sector 7 Intercept</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <AlertCircle size={12} className="text-amber-500" />
                                <span className="text-[9px] font-black text-white/80 uppercase">Panic_Spread: High</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right space-y-1">
                        <p className="text-[9px] font-mono text-white/40 uppercase">Trace_ID: HZN_992_X</p>
                        <p className="text-[9px] font-mono text-white/40 uppercase">Loc: Unknown_Grid</p>
                    </div>
                </div>
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
};
