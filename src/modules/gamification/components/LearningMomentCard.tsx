import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { CheckCircle2, XCircle, Info, Lightbulb, AlertTriangle, ChevronDown, X, BookOpen, Scale } from 'lucide-react';
import { matchTechnique, tipForSeed } from '../learning-content';
import { articleForTechnique } from '../encyclopedia';
import { calibrationMoment } from '../confidence';
import type { ConfidenceLevel } from '../confidence';

interface LearningMomentCardProps {
    /** true = good choice, false = bad choice, null = neutral/unknown */
    correct: boolean | null;
    /** Scenario-authored feedback for the chosen option */
    feedback: string;
    /** The label of the choice the player made */