import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { engineService } from '@/services/engine.service';
import { cn } from '@/shared/lib/utils';
import { ShieldAlert, Fingerprint, Activity, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { telemetryService } from '@/services/telemetry.service';

interface InvestigationRevealProps {
    progressId: string;
    onComplete: () => void;
}

interface SummaryChoice {
    sceneTitle: string;
    userAction: string;
    userConsequence: string;
    userTrustDelta: number;
    isPerfect: boolean;
    bestAction: string;
}

export const InvestigationReveal: React.FC<InvestigationRevealProps> = ({ progressId, onComplete }) => {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await engineService.getScenarioSummary(progressId);
                setSummary(data);
                setLoading(false);

                // Staggered reveals
                for (let i = 0; i < data.choices.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setVisibleCount(i + 1);
                }
            } catch (err) {
                console.error('Failed to fetch summary:', err);
                setLoading(false);
            }
        };
        fetchSummary();

        // Start verification timer
        telemetryService.trackVerification(progressId, 'investigation_reveal', {
            verification_start_timestamp: new Date().toISOString()
        });
    }, [progressId]);

    /* 
    const handleLearnMore = () => {
        telemetryService.trackVerification(progressId, 'investigation_reveal', {
            learn_more_opened: true,
            source_button_clicked_count: 1
        });
        // In a real app, open a modal with more info
        alert('Opening detailed verification logs...');
    };
    */

    const handleComplete = () => {
        telemetryService.trackVerification(progressId, 'investigation_reveal', {
            verification_end_timestamp: new Date().toISOString()
        });
        telemetryService.flush(progressId, 'investigation_reveal');
        onComplete();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center border border-border">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <p className="text-foreground font-mono animate-pulse uppercase tracking-[0.3em] text-xs">Reviewing your decisions...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar w-full h-full pb-20 bg-background text-foreground">
            <div className="w-full max-w-4xl mx-auto py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-muted border border-border text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">
                        <Fingerprint size={14} />
                        Decision Review
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground">
                        What really happened
                    </h2>
                    <p className="text-muted-foreground font-medium">
                        Compare each choice you made with its real impact on the network.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Vertical Timeline Line */}
                    <motion.div