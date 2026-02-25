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