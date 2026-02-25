import React, { Suspense, lazy, memo } from 'react';
import { type Scene } from '@/services/engine.service';
import { ChatSkeleton, SocialSkeleton, ScenarioSkeleton } from './ImmersiveSkeleton';

// Phase 16: Lazy load scene components for code-splitting
const TextPost = lazy(() => import('./TextPost').then(m => ({ default: m.TextPost })));
const ChatStream = lazy(() => import('./ChatStream').then(m => ({ default: m.ChatStream })));
const SocialFeed = lazy(() => import('./SocialFeed').then(m => ({ default: m.SocialFeed })));
const VideoPlayer = lazy(() => import('./VideoPlayer').then(m => ({ default: m.VideoPlayer })));
const NetworkPropagationMap = lazy(() => import('./NetworkPropagationMap').then(m => ({ default: m.NetworkPropagationMap })));
const UrlInspection = lazy(() => import('./UrlInspection').then(m => ({ default: m.UrlInspection })));