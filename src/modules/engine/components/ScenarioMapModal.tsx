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