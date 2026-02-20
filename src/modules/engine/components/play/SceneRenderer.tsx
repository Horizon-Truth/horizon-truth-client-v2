import React, { Suspense, lazy, memo } from 'react';
import { type Scene } from '@/services/engine.service';
import { ChatSkeleton, SocialSkeleton, ScenarioSkeleton } from './ImmersiveSkeleton';

// Phase 16: Lazy load scene components for code-splitting
const TextPost = lazy(() => import('./TextPost').then(m => ({ default: m.TextPost })));
const ChatStream = lazy(() => import('./ChatStream').then(m => ({ default: m.ChatStream })));
const SocialFeed = lazy(() => import('./SocialFeed').then(m => ({ default: m.SocialFeed })));
const VideoPlayer = lazy(() => import('./VideoPlayer').then(m => ({ default: m.VideoPlayer })));
const NetworkPropagationMap = lazy(() => import('./NetworkPropagationMap').then(m => ({ default: m.NetworkPropagationMap })));

interface SceneRendererProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const SceneRenderer: React.FC<SceneRendererProps> = memo(({ scene, onChoice, isLoading }) => {
    const contentType = scene.contentType || (scene as any).content?.contentType;

    if (isLoading) {
        // Use specific skeletons for in-place loading if we know the type
        if (contentType === 'CHAT') return <ChatSkeleton />;
        if (contentType === 'FEED') return <SocialSkeleton />;

        return (
            <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />

                <div className="relative z-10 space-y-8 flex flex-col items-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-t-2 border-r-2 border-primary rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 text-center">
                        <p className="text-xs font-black uppercase tracking-[0.5em] text-primary animate-pulse">System Initializing</p>
                        <div className="flex items-center gap-2 justify-center">
                            <span className="text-[10px] font-mono text-white/40 uppercase">Decrypting Uplink...</span>
                            <span className="w-8 h-[1px] bg-white/20 animate-pulse" />
                        </div>
                    </div>

                    <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </div>
                </div>

                {/* Scannline Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>
        );
    }

    const renderContent = () => {
        switch (contentType) {
            case 'TEXT':
                return <TextPost scene={scene} onChoice={onChoice} isLoading={isLoading} />;
            case 'CHAT':
                return <ChatStream scene={scene} onChoice={onChoice} isLoading={isLoading} />;
            case 'FEED':
                return <SocialFeed scene={scene} onChoice={onChoice} isLoading={isLoading} />;
            case 'PROPAGATION':
                return <NetworkPropagationMap scene={scene} />;
            case 'IMAGE':
                return (
                    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={scene.content?.imageUrl} alt={scene.title} className="w-full h-auto" />
                    </div>
                );
            case 'VIDEO':
                return <VideoPlayer scene={scene} />;
            default:
                return (
                    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 space-y-6 shadow-inner">
                        <p className="text-2xl font-medium leading-relaxed italic text-white/90 border-l-4 border-primary/60 pl-8 py-2">
                            "{scene.description}"
                        </p>
                    </div>
                );
        }
    };

    const getFallback = () => {
        if (contentType === 'CHAT') return <ChatSkeleton />;
        if (contentType === 'FEED') return <SocialSkeleton />;
        return <ScenarioSkeleton />;
    };

    return (
        <Suspense fallback={getFallback()}>
            {renderContent()}
        </Suspense>
    );
});

SceneRenderer.displayName = 'SceneRenderer';
