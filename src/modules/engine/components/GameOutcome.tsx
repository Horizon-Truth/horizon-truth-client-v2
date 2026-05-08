import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Trophy, LayoutDashboard, ShieldCheck, Activity, Target, TrendingDown, Shield, Globe, Sparkles, BookOpen, Brain, GraduationCap, Lightbulb, Users, Share2, ShieldAlert } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { InvestigationReveal } from './play/InvestigationReveal';
import PlayerFeedbackModal from './play/PlayerFeedbackModal';
import { motion } from 'framer-motion';
import { engineService } from '@/services/engine.service';
import type { Scenario } from '@/services/engine.service';
import { getRank, getNextRank, rankProgress, xpToNextRank } from '@/modules/gamification/progression';
import { Confetti } from '@/modules/gamification/components/Confetti';
import { tipForSeed } from '@/modules/gamification/learning-content';
import { hasImpact, impactVerdict, formatPeople } from '@/modules/gamification/impact';

const NARRATIVE_CONFIG: Record<string, {
    title: string;
    subtitle: string;
    surface: string;
    icon: React.ReactNode;
}> = {
    TRUTH_VICTORY: {
        title: 'Truth Victory',
        subtitle: 'You identified and contained the misinformation before it spread. The community trusts your judgment.',
        surface: 'bg-emerald-500/10 border-emerald-500/25',
        icon: <Shield size={40} className="text-emerald-500" aria-hidden />,
    },
    CONTAINED_EARLY: {
        title: 'Contained Early',
        subtitle: 'Good work — you slowed the spread significantly, though some misinformation still reached the network.',
        surface: 'bg-blue-500/10 border-blue-500/25',
        icon: <ShieldCheck size={40} className="text-blue-500" aria-hidden />,
    },
    VIRAL_MISINFORMATION: {
        title: 'Viral Misinformation',
        subtitle: 'The false claim reached thousands before fact-checkers could intervene. The damage is significant.',
        surface: 'bg-orange-500/10 border-orange-500/25',
        icon: <Globe size={40} className="text-orange-500" aria-hidden />,
    },
    COMMUNITY_CRISIS: {
        title: 'Community Crisis',
        subtitle: 'Your decisions amplified the narrative. The community is divided and trust in institutions has fallen.',
        surface: 'bg-red-500/10 border-red-500/25',
        icon: <TrendingDown size={40} className="text-red-500" aria-hidden />,
    },
};

export function GameOutcome() {
    const { currentOutcome, resetGame, stats, missionImpact } = useGameStore();
    const [view, setView] = useState<'reveal' | 'summary'>('reveal');
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [scenario, setScenario] = useState<Scenario | null>(null);

    // Enrich the result screen with the scenario's educational content
    useEffect(() => {
        const scenarioId = currentOutcome?.scenario?.id;
        if (!scenarioId) return;
        engineService.getScenarioById(scenarioId)
            .then(setScenario)
            .catch(() => setScenario(null));
    }, [currentOutcome?.scenario?.id]);

    if (!currentOutcome) return null;

    const isSuccess = currentOutcome.passed ?? (currentOutcome.outcomeType === 'SUCCESS' || currentOutcome.outcomeType === 'PASS' || currentOutcome.outcomeType === 'PERFECT_PASS' || (currentOutcome.accuracyRate !== undefined && currentOutcome.accuracyRate !== null && currentOutcome.accuracyRate >= 70));
    const narrativeKey = currentOutcome.narrativeEnding || (isSuccess ? 'CONTAINED_EARLY' : 'COMMUNITY_CRISIS');
    const narrativeCfg = NARRATIVE_CONFIG[narrativeKey] || NARRATIVE_CONFIG['COMMUNITY_CRISIS'];

    // XP breakdown (the store already added the score to experience)
    const xpEarned = Math.max(0, currentOutcome.score ?? 0);
    const xpNow = stats.experience;
    const rank = getRank(xpNow);
    const nextRank = getNextRank(xpNow);
    const rankPct = rankProgress(xpNow);

    const lessons: { icon: React.ReactNode; label: string; text: string }[] = [];
    if (scenario?.learningObjective) lessons.push({ icon: <GraduationCap size={18} aria-hidden />, label: 'What this mission taught', text: scenario.learningObjective });
    if (scenario?.psychologicalTrigger) lessons.push({ icon: <Brain size={18} aria-hidden />, label: 'The manipulation at play', text: scenario.psychologicalTrigger });
    if (scenario?.preventionLesson) lessons.push({ icon: <ShieldCheck size={18} aria-hidden />, label: 'How to protect yourself', text: scenario.preventionLesson });
    if (lessons.length === 0) {
        const tip = tipForSeed(currentOutcome.scenario?.id || 'fallback');
        lessons.push({ icon: <Lightbulb size={18} aria-hidden />, label: tip.title, text: tip.tip });
    }

    // Community impact (Phase 4): only show the ledger of this very mission.
    const impact = missionImpact
        && (!currentOutcome.progressId || missionImpact.progressId === currentOutcome.progressId)
        && hasImpact(missionImpact)
        ? missionImpact
        : null;
    const verdict = impact ? impactVerdict(impact) : null;

    if (view === 'reveal' && currentOutcome.progressId) {
        return (
            <InvestigationReveal
                progressId={currentOutcome.progressId}
                onComplete={() => setView('summary')}
            />
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 flex flex-col items-center bg-background text-foreground">
            {isSuccess && <Confetti />}