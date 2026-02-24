import { useEffect, useState, useRef, useCallback, useMemo, Fragment } from 'react';
import type { Scenario } from '@/services/engine.service';
import { engineService } from '@/services/engine.service';
import { useGameStore } from '@/store/game.store';
import { Button } from '@/shared/components/ui/button';
import { Play, Loader2, Info, Trophy, Lock, Star, ChevronUp, Compass, Sparkles, BookMarked } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ScenarioSkeleton } from './play/ImmersiveSkeleton';
import { masteryFor, nextMasteryGoal } from '@/modules/gamification/mastery';
import { recommendScenario } from '@/modules/gamification/recommendation';
import { campaignTitle, campaignWorldState } from '@/modules/gamification/campaigns';
import type { CampaignWorldState } from '@/modules/gamification/campaigns';

export function ScenarioList({ onStartGame }: { onStartGame?: (scenario: Scenario) => void, guestMode?: boolean }) {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);
    const [loadingScenarioId, setLoadingScenarioId] = useState<string | null>(null);
    const gameStore = useGameStore();
    const skillBook = useGameStore(s => s.skillBook);
    const observer = useRef<IntersectionObserver | null>(null);

    // Adaptive pick (Phase 9): trains the weakest skill / covers new ground.
    // Guest mode has no skill history, so recommendations stay generic there.
    const recommendation = useMemo(
        () => recommendScenario(scenarios, skillBook),
        [scenarios, skillBook]
    );

    // Campaign arcs (Phase 3): chapter numbering + world state per campaignTag.
    const campaignMeta = useMemo(() => {
        const byTag = new Map<string, Scenario[]>();
        for (const s of scenarios) {
            if (s.campaignTag) byTag.set(s.campaignTag, [...(byTag.get(s.campaignTag) ?? []), s]);
        }
        const meta = new Map<string, { title: string; chapter: number; total: number; isArcStart: boolean; state: CampaignWorldState }>();
        const seen = new Map<string, number>();
        for (const s of scenarios) {
            if (!s.campaignTag) continue;
            const chapter = (seen.get(s.campaignTag) ?? 0) + 1;
            seen.set(s.campaignTag, chapter);
            meta.set(s.id, {
                title: campaignTitle(s.campaignTag),
                chapter,