import { memo } from 'react';
import { cn } from '@/shared/lib/utils';
import { Brain, Scale, Crosshair } from 'lucide-react';
import { SKILLS, skillLevel, skillLevelProgress, skillAccuracy, weakestSkill } from '../skills';
import type { SkillProgress } from '../skills';
import { calibrationInsight } from '../confidence';
import type { CalibrationLedger } from '../confidence';

interface SkillsPanelProps {
    skillBook: Record<string, SkillProgress>;