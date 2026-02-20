import React from 'react';
import { type Scene } from '@/services/engine.service';
import { TextPost } from './TextPost';
import { ChatStream } from './ChatStream';
import { SocialFeed } from './SocialFeed';
import { VideoPlayer } from './VideoPlayer';
import { NetworkPropagationMap } from './NetworkPropagationMap';

interface SceneRendererProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, onChoice, isLoading }) => {
    const contentType = scene.contentType || (scene as any).content?.contentType;

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
