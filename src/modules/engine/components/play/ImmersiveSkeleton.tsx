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
                <div className="w-3/4 h-6 bg-slate-300 rounded-lg" />
                <div className="w-full h-4 bg-slate-200 rounded-lg" />
                <div className="w-5/6 h-4 bg-slate-200 rounded-lg" />
            </div>
            <div className="w-1/2 h-4 bg-slate-200 rounded-full pt-2" />
        </div>
        <div className="mt-auto w-full h-12 bg-slate-200 rounded-2xl" />
    </div>
);

export const ChatSkeleton = () => (
    <div className="space-y-4 p-4 h-[400px] overflow-hidden bg-white rounded-2xl border border-slate-200">
        {[1, 2, 3, 4].map((i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className={cn(
                    "max-w-[70%] h-12 rounded-2xl",
                    i % 2 === 0 ? "bg-blue-600/10 ml-auto rounded-tr-none" : "bg-slate-100 mr-auto rounded-tl-none"
                )}
            />
        ))}
    </div>
);

export const SocialSkeleton = () => (
    <div className="space-y-8 p-4">
        {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 opacity-40">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="w-1/3 h-4 bg-slate-200 rounded-full" />
                    <div className="w-full h-24 bg-slate-100 rounded-2xl" />
                    <div className="flex justify-between w-3/4">
                        <div className="w-8 h-4 bg-slate-100 rounded-full" />
                        <div className="w-8 h-4 bg-slate-100 rounded-full" />
                        <div className="w-8 h-4 bg-slate-100 rounded-full" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);
