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