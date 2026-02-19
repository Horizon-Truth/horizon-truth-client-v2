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