import { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import { CONFIDENCE_OPTIONS } from '../confidence';
import type { ConfidenceLevel } from '../confidence';

interface ConfidenceCheckProps {
    /** The choice the player just picked, awaiting confirmation. */
    choiceLabel: string;
    onSelect: (level: ConfidenceLevel) => void;