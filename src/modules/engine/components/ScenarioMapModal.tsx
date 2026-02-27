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