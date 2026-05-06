import { memo } from 'react';
import { cn } from '@/shared/lib/utils';
import { Brain, Scale, Crosshair } from 'lucide-react';
import { SKILLS, skillLevel, skillLevelProgress, skillAccuracy, weakestSkill } from '../skills';
import type { SkillProgress } from '../skills';
import { calibrationInsight } from '../confidence';
import type { CalibrationLedger } from '../confidence';

interface SkillsPanelProps {
    skillBook: Record<string, SkillProgress>;
    calibration: CalibrationLedger;
}

/**
 * Phase 7 — the player's competency graph on the mission hub: per-skill level
 * and accuracy, a focus-area callout, and the calibration insight (Phase 15).
 */
export const SkillsPanel = memo(function SkillsPanel({ skillBook, calibration }: SkillsPanelProps) {
    const hasAnyProgress = SKILLS.some(s => (skillBook[s.key]?.total ?? 0) > 0);
    const focus = weakestSkill(skillBook);
    const insight = calibrationInsight(calibration);

    return (
        <section
            aria-label="Your skills"
            className="border border-border rounded-3xl p-6 bg-card shadow-sm space-y-5 animate-in fade-in slide-in-from-top-4 duration-700"
        >
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <Brain size={16} className="text-primary" aria-hidden />
                    <h2 className="font-black text-xs tracking-widest uppercase">Your skills</h2>
                </div>