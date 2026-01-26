import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game.store';
import { useAuthStore } from '@/store/auth.store';
import { useDevice } from '@/shared/hooks/useDevice';
import { cn } from '@/shared/lib/utils';
import {
    ShieldCheck,
    Target,
    Trophy,
    Flame,
    MessageSquare,
    Megaphone,
    LogOut,
    HelpCircle,
    BookOpen,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { ScenarioList } from '../engine/components/ScenarioList';
import { GameSession } from '../engine/components/GameSession';
import { GameOutcome } from '../engine/components/GameOutcome';
import { BadgeAwardOverlay } from '../engine/components/play/BadgeAwardOverlay';
import { GlitchError } from '../engine/components/play/GlitchError';
import { Button } from '@/shared/components/ui/button';
import AddFeedbackModal from '../engine/components/AddFeedbackModal';
import { useNavigate } from 'react-router-dom';
import { getRank, getNextRank, rankProgress, xpToNextRank } from '@/modules/gamification/progression';
import { HowToPlayDialog, hasSeenHowToPlay } from '@/modules/gamification/components/HowToPlayDialog';
import { SkillsPanel } from '@/modules/gamification/components/SkillsPanel';
import { DailyBriefing } from '@/modules/gamification/components/DailyBriefing';
import { MANUAL_ARTICLES, isArticleUnlocked } from '@/modules/gamification/encyclopedia';
