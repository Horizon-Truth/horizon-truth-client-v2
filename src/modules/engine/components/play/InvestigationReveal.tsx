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