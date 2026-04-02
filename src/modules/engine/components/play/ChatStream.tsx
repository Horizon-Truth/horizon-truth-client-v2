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

    useEffect(() => {
        setVisibleMessages([]);
        let mounted = true;

        const showMessages = async () => {
            for (let i = 0; i < messages.length; i++) {
                if (!mounted) break;

                // Only show typing for non-user messages
                if (messages[i].sender !== 'USER') {
                    setIsTyping(true);
                    // Simulate realistic typing delay
                    const typingTime = 1000 + Math.random() * 1500;
                    await new Promise(resolve => setTimeout(resolve, typingTime));
                }

                if (!mounted) break;
                setIsTyping(false);
                setVisibleMessages(prev => [...prev, messages[i]]);

                // Realistic gap between messages
                await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
            }
        };

        showMessages();
        return () => { mounted = false; };
    }, [messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [visibleMessages, isTyping]);

    return (
        <div className="flex flex-col h-[400px] border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">