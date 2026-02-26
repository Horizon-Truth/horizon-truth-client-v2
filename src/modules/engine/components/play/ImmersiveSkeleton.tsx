import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

export const ScenarioSkeleton = () => (
    <div className="flex flex-col gap-6 p-8 bg-slate-50 border border-slate-200 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        <div className="space-y-4 relative z-10">
            <div className="flex justify-between">
                <div className="w-20 h-4 bg-slate-200 rounded-full" />
                <div className="w-16 h-4 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-2">