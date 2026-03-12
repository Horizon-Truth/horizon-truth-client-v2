import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { ShieldCheck, MousePointerClick, TrendingUp, Flame, ChevronRight, ChevronLeft } from 'lucide-react';
import { RANKS } from '../progression';

const STORAGE_KEY = 'horizon-howtoplay-seen';

export function hasSeenHowToPlay(): boolean {
    try {
        return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return true;
    }
}
