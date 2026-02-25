import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { engineService } from '@/services/engine.service';
import type { Scenario, Scene } from '@/services/engine.service';
import api from '@/services/api';

export interface GuestChoiceLogEntry {
    sceneId: string;
    choiceId?: string;
    label: string;
    trustDelta: number;
    timestamp: string;
}

/** Feedback for the last submitted choice, shown as a Learning Moment
 *  before the game advances (via continueGuestGame). */
export interface GuestLastChoice {
    label: string;
    feedback: string | null;
    trustDelta: number;
    trap: string | null;
    correct: boolean | null;
}

export interface GuestGameState {
    scenarios: Scenario[];
    activeScenario: Scenario | null;
    currentScene: Scene | null;
    choicesLog: GuestChoiceLogEntry[];
    trustScore: number;
    isCompleted: boolean;
    isLoading: boolean;
    error: string | null;
    lastChoice: GuestLastChoice | null;
    /** Where the game goes after the player reads the learning moment. */
    pendingAdvance: { nextScene: Scene | null; completed: boolean } | null;

    // Actions
    fetchScenarios: () => Promise<void>;
    startGuestGame: (scenario: Scenario) => void;
    submitGuestChoice: (choice: any) => void;
    continueGuestGame: () => void;
    resetGuestGame: () => void;