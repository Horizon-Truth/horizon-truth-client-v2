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

export function markHowToPlaySeen() {
    try {
        localStorage.setItem(STORAGE_KEY, '1');
    } catch {
        /* ignore */
    }
}

interface Step {
    icon: React.ReactNode;
    title: string;
    body: React.ReactNode;
}

const STEPS: Step[] = [
    {
        icon: <ShieldCheck size={28} aria-hidden />,
        title: 'Your mission',
        body: (
            <p>
                Misinformation spreads six times faster than the truth. In Horizon Truth you step into
                realistic social feeds, chats, and news stories — and learn to tell what's real from
                what's engineered to fool you. Every mission builds a real-world skill.
            </p>
        ),
    },
    {
        icon: <MousePointerClick size={28} aria-hidden />,
        title: 'How to play',
        body: (
            <div className="space-y-2">
                <p>
                    Each mission is a short story told in scenes. Read the post, chat, or article carefully,
                    then choose how to respond — share it, verify it, report it, or ignore it.
                </p>
                <p>
                    After every choice you'll see a <strong>Learning Moment</strong>: why your choice helped
                    or hurt, which manipulation technique was in play, and a verification habit to take with you.
                </p>
            </div>
        ),
    },
    {
        icon: <TrendingUp size={28} aria-hidden />,
        title: 'Trust, accuracy & XP',
        body: (
            <div className="space-y-2">
                <p>
                    Good decisions raise your <strong>Trust Score</strong>; falling for manipulation lowers it.
                    Your <strong>Accuracy</strong> tracks how often you make the best call.
                </p>
                <p>
                    Completing missions earns <strong>XP</strong>. XP moves you up through {RANKS.length} ranks —
                    from {RANKS[0].emoji} {RANKS[0].name} all the way to {RANKS[RANKS.length - 1].emoji}{' '}
                    {RANKS[RANKS.length - 1].name}. Higher ranks unlock harder, more realistic missions.
                </p>
            </div>
        ),
    },
    {
        icon: <Flame size={28} aria-hidden />,
        title: 'Keep your streak alive',
        body: (
            <div className="space-y-2">
                <p>
                    Play at least one mission a day to build your <strong>streak</strong>. Critical thinking is
                    a muscle — a few minutes daily beats an hour once a month.
                </p>
                <p>
                    Replay missions to reach 100% accuracy and earn badges along the way. Ready?
                </p>
            </div>
        ),
    },
];

interface HowToPlayDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function HowToPlayDialog({ open, onOpenChange }: HowToPlayDialogProps) {
    const [step, setStep] = useState(0);
    const isLast = step === STEPS.length - 1;
    const current = STEPS[step];

    const close = () => {
        markHowToPlaySeen();
        onOpenChange(false);
        setStep(0);
    };

    return (
        <Dialog open={open} onOpenChange={v => (v ? onOpenChange(v) : close())}>
            <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
                <div className="p-8 pb-6 space-y-5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-4"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                {current.icon}
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight">
                                {current.title}
                            </DialogTitle>
                            <DialogDescription asChild>
                                <div className="text-sm leading-relaxed text-muted-foreground">{current.body}</div>
                            </DialogDescription>
                        </motion.div>
                    </AnimatePresence>

                    {/* Step dots */}
                    <div className="flex items-center gap-2 pt-2" role="tablist" aria-label="Guide steps">
                        {STEPS.map((_, i) => (
                            <button
                                key={i}
                                role="tab"
                                aria-selected={i === step}
                                aria-label={`Step ${i + 1}`}
                                onClick={() => setStep(i)}
                                className={cn(
                                    'h-2 rounded-full transition-all',
                                    i === step ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-6 py-4">
                    {step > 0 ? (
                        <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="font-bold rounded-xl">
                            <ChevronLeft size={16} className="mr-1" /> Back
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={close} className="font-bold rounded-xl text-muted-foreground">
                            Skip
                        </Button>
                    )}
                    <Button
                        onClick={() => (isLast ? close() : setStep(s => s + 1))}
                        className="font-bold rounded-xl px-6"
                    >
                        {isLast ? "Let's play" : 'Next'}
                        {!isLast && <ChevronRight size={16} className="ml-1" />}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
