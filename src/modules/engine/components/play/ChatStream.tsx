import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, CheckCheck, Eye } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { cn } from '@/shared/lib/utils';

interface ChatStreamProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const ChatStream: React.FC<ChatStreamProps> = memo(({ scene, onChoice, isLoading }) => {
    const shouldReduceMotion = useReducedMotion();
    const [visibleMessages, setVisibleMessages] = useState<any[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messages = scene.content?.chatMessages || [];