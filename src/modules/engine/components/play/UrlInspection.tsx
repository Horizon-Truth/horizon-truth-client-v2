import React, { memo, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock, Unlock, ChevronDown, AlertTriangle, CheckCircle2, Search, Globe } from 'lucide-react';
import { type Scene } from '@/services/engine.service';
import { cn } from '@/shared/lib/utils';
import { useGameStore } from '@/store/game.store';
import { telemetryService } from '@/services/telemetry.service';

/**
 * Phase 10 challenge — URL inspection.
 *
 * Renders a suspicious link as a fake browser window whose address bar can be
 * dissected: clicking the host reveals its anatomy (subdomain / domain / TLD),
 * and an investigator toolkit lists expandable clues. The scene's choices are
 * rendered by GameSession as usual, so this component is pure investigation.
 *
 * scene.content contract:
 * {
 *   url: string,                 // the link under investigation
 *   pageTitle?: string,          // what the landing page claims
 *   pageSnippet?: string,        // first lines of the landing page
 *   prompt?: string,             // investigator question shown at top
 *   clues?: { label: string; detail: string; suspicious?: boolean }[]
 * }
 */

interface UrlInspectionProps {
    scene: Scene;
    onChoice?: (choice: string) => void;
    isLoading?: boolean;
}

interface ParsedUrl {
    protocol: string;
    isHttps: boolean;
    subdomain: string;
    domain: string;
    tld: string;
    path: string;
}

function parseUrl(raw: string): ParsedUrl | null {
    try {
        const url = new URL(raw);
        const parts = url.hostname.split('.');
        const tld = parts.length > 1 ? parts[parts.length - 1] : '';
        const domain = parts.length > 1 ? parts[parts.length - 2] : parts[0];
        const subdomain = parts.slice(0, -2).join('.');
        return {
            protocol: url.protocol.replace(':', ''),
            isHttps: url.protocol === 'https:',
            subdomain,
            domain,
            tld,
            path: `${url.pathname}${url.search}`,
        };
    } catch {
        return null;
    }
}

export const UrlInspection: React.FC<UrlInspectionProps> = memo(({ scene }) => {
    const shouldReduceMotion = useReducedMotion();
    const { activeProgress } = useGameStore();
    const content = scene.content ?? {};
    const rawUrl: string = content.url ?? '';
    const parsed = useMemo(() => parseUrl(rawUrl), [rawUrl]);
    const clues: { label: string; detail: string; suspicious?: boolean }[] = Array.isArray(content.clues) ? content.clues : [];

    const [showAnatomy, setShowAnatomy] = useState(false);
    const [openClues, setOpenClues] = useState<Set<number>>(new Set());
    const panelViews = useRef(0);

    const trackPanelView = () => {
        panelViews.current += 1;
        if (activeProgress?.id && scene.id) {
            telemetryService.trackVerification(activeProgress.id, scene.id, {
                fact_panel_views: panelViews.current,
                learn_more_opened: true,
            });
        }
    };

    const toggleClue = (i: number) => {
        setOpenClues(prev => {
            const next = new Set(prev);
            if (next.has(i)) {
                next.delete(i);
            } else {
                next.add(i);
                trackPanelView();
            }
            return next;
        });
    };

    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.5 }}
            className="w-full space-y-4"
        >
            {content.prompt && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15">
                    <Search size={16} className="text-primary mt-0.5 shrink-0" aria-hidden />
                    <p className="text-sm font-semibold leading-relaxed">{content.prompt}</p>
                </div>
            )}

            {/* Fake browser window */}
            <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
                {/* Chrome */}
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/60 border-b border-border">
                    <div className="flex gap-1.5" aria-hidden>
                        <span className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    {/* Address bar — click to dissect */}
                    <button
                        onClick={() => {
                            setShowAnatomy(v => {
                                if (!v) trackPanelView();
                                return !v;
                            });
                        }}
                        aria-expanded={showAnatomy}
                        aria-label="Inspect the address bar"
                        className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border text-left hover:border-primary/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                        {parsed?.isHttps
                            ? <Lock size={13} className="text-emerald-500 shrink-0" aria-label="HTTPS" />
                            : <Unlock size={13} className="text-red-500 shrink-0" aria-label="Not secure" />}
                        <span className="font-mono text-xs sm:text-sm truncate">
                            {parsed ? (
                                <>
                                    <span className="text-muted-foreground">{parsed.protocol}://</span>
                                    {parsed.subdomain && <span className="text-muted-foreground">{parsed.subdomain}.</span>}
                                    <span className="font-bold text-foreground">{parsed.domain}.{parsed.tld}</span>
                                    <span className="text-muted-foreground">{parsed.path}</span>
                                </>
                            ) : (
                                <span className="text-foreground">{rawUrl || 'about:blank'}</span>
                            )}
                        </span>
                        <ChevronDown size={13} className={cn('ml-auto shrink-0 text-muted-foreground transition-transform', showAnatomy && 'rotate-180')} aria-hidden />
                    </button>
                </div>

                {/* Domain anatomy */}
                {showAnatomy && parsed && (
                    <div className="px-5 py-4 bg-primary/5 border-b border-border space-y-2 text-xs leading-relaxed">
                        <p className="font-black uppercase tracking-widest text-[10px] text-primary flex items-center gap-1.5">
                            <Globe size={12} aria-hidden /> Address anatomy
                        </p>
                        <p>
                            <span className="font-bold">{parsed.isHttps ? 'https' : parsed.protocol}</span> —{' '}
                            {parsed.isHttps
                                ? 'the connection is encrypted. Note: a padlock proves privacy, not honesty — scam sites use HTTPS too.'
                                : 'the connection is not encrypted. Legitimate news and banking sites always use HTTPS.'}
                        </p>
                        {parsed.subdomain && (
                            <p><span className="font-bold font-mono">{parsed.subdomain}.</span> — a subdomain. Anyone can put a trusted brand here: “bbc.evil-site.com” belongs to evil-site.com, not the BBC.</p>
                        )}
                        <p>
                            <span className="font-bold font-mono">{parsed.domain}.{parsed.tld}</span> — the registered domain: <span className="font-bold">this is who you're actually visiting.</span> Read it character by character.
                        </p>
                        {parsed.path && parsed.path !== '/' && (
                            <p><span className="font-bold font-mono">{parsed.path}</span> — the page path. It can claim anything; only the domain identifies the owner.</p>
                        )}
                    </div>
                )}

                {/* Page preview */}
                <div className="p-6 space-y-3">
                    {content.pageTitle && (
                        <h3 className="text-lg sm:text-xl font-black leading-snug">{content.pageTitle}</h3>
                    )}
                    {content.pageSnippet && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{content.pageSnippet}</p>
                    )}
                    {!content.pageTitle && !content.pageSnippet && (
                        <p className="text-sm text-muted-foreground italic">{scene.description}</p>
                    )}
                </div>
            </div>

            {/* Investigator toolkit */}
            {clues.length > 0 && (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <p className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                        Investigator toolkit — tap to examine
                    </p>
                    <ul>
                        {clues.map((clue, i) => {
                            const open = openClues.has(i);
                            return (
                                <li key={i} className={cn(i > 0 && 'border-t border-border')}>
                                    <button
                                        onClick={() => toggleClue(i)}
                                        aria-expanded={open}
                                        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                                    >
                                        {clue.suspicious
                                            ? <AlertTriangle size={15} className="text-amber-500 shrink-0" aria-hidden />
                                            : <CheckCircle2 size={15} className="text-emerald-500 shrink-0" aria-hidden />}
                                        <span className="text-sm font-bold flex-1 min-w-0">{clue.label}</span>
                                        <ChevronDown size={14} className={cn('shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden />
                                    </button>
                                    {open && (
                                        <p className="px-5 pb-4 pl-[52px] text-xs text-muted-foreground leading-relaxed">{clue.detail}</p>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </motion.div>
    );
});

UrlInspection.displayName = 'UrlInspection';
