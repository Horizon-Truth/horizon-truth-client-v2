import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Waypoints, Target, Flag } from 'lucide-react';
import type { Scene } from '@/services/engine.service';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

interface ScenarioMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    scenes: Scene[];
}

export const ScenarioMapModal: React.FC<ScenarioMapModalProps> = ({ isOpen, onClose, scenes }) => {
    if (!isOpen) return null;

    // Sort scenes by order
    const orderedScenes = [...scenes].sort((a, b) => a.order - b.order);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/90 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl h-[85vh] bg-[#0c0c0e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <Waypoints size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-wider text-white">Scenario Map</h2>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest">Network Flow Analysis</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                            <X size={20} className="text-white" />
                        </Button>
                    </div>

                    {/* Flow Map Visualizer */}
                    <div className="flex-1 overflow-auto p-8 relative scenario-map-bg">
                        {/* Background structural lines */}
                        <div className="absolute top-0 bottom-0 left-12 w-px bg-white/10 z-0 hidden md:block" />

                        <div className="space-y-12 relative z-10 max-w-4xl mx-auto pl-0 md:pl-20">
                            {orderedScenes.map((scene, index) => {
                                const isTerminal = scene.isTerminal;

                                return (
                                    <div key={scene.id} className="relative group">
                                        {/* Connector to left vertical line */}
                                        <div className="absolute -left-16 top-8 w-16 h-px bg-white/10 hidden md:block" />

                                        {/* Node Marker */}
                                        <div className={cn(
                                            "absolute -left-[5.25rem] top-6 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-[#0c0c0e] hidden md:flex",
                                            isTerminal ? "border-emerald-500/50 text-emerald-500" : "border-primary/50 text-primary"
                                        )}>
                                            {isTerminal ? <Flag size={14} /> : <Target size={14} />}
                                        </div>

                                        <div className={cn(
                                            "p-6 rounded-2xl border transition-all duration-300",
                                            isTerminal ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30"
                                        )}>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="text-[10px] font-black uppercase text-white/50 bg-black/50 px-3 py-1 rounded-full border border-white/5 tracking-widest">
                                                    Phase {index + 1}
                                                </div>
                                                <h3 className="text-lg font-bold text-white">{scene.title}</h3>
                                            </div>

                                            {scene.description && (
                                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 italic">
                                                    {scene.description}
                                                </p>
                                            )}

                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-2">Branch Pathways</h4>
                                                {scene.choices && scene.choices.length > 0 ? (
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                        {scene.choices.map(choice => {
                                                            const targetedScene = orderedScenes.find(s => s.id === choice.nextSceneId);
                                                            const bestOutcome = choice.outcomes?.sort((a, b) => (b.score || 0) - (a.score || 0))[0];

                                                            return (
                                                                <div
                                                                    key={choice.id}
                                                                    className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col gap-2"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-bold text-white/90">{choice.label}</span>
                                                                        <span className={cn(
                                                                            "text-[10px] font-black px-2 py-0.5 rounded-full",
                                                                            (choice.scoreImpact || 0) > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/40"
                                                                        )}>
                                                                            {(choice.scoreImpact || 0) > 0 ? '+' : ''}{choice.scoreImpact || 0} pts
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <ArrowRight size={12} className="text-primary/70" />
                                                                        <span className="text-xs text-primary font-medium">
                                                                            {targetedScene ? targetedScene.title : (bestOutcome?.endScenario ? 'END PROTOCOL' : 'Next Sequential Node')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-white/30 italic">No branching choices defined. Will proceed sequentially.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
