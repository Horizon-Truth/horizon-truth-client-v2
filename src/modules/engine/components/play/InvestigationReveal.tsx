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