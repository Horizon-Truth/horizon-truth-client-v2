import { useState } from 'react';
import {
    ExternalLink,
    Eye,
    EyeOff,
    FileQuestion,
    Image as ImageIcon,
    Link2,
    Trash2,
    Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { TARGET_TYPE_LABEL } from '../constants';
import type {
    ContentPreview,
    ContentVisibility,
} from '@/services/moderation.service';

const VISIBILITY_NOTICE: Record<
    ContentVisibility,
    { label: string; className: string; icon: typeof EyeOff } | null
> = {
    VISIBLE: null,
    HIDDEN: {
        label: 'Hidden from the public. Moderators can still see it.',
        className:
            'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
        icon: EyeOff,
    },
    DELETED: {
        label: 'Deleted. Recoverable by a senior moderator.',
        className:
            'border-red-300 bg-red-50 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200',
        icon: Trash2,
    },
};

/**
 * The reported content itself.
 *
 * Media is behind a click-to-reveal by default: moderators work through
 * queues of potentially graphic material, and nobody should be shown a
 * distressing image simply for opening a case.
 */
export function ContentPreviewCard({
    preview,
    visibility,
    snapshot,
}: {
    preview: ContentPreview;
    visibility: ContentVisibility;
    /** Text captured at report time, shown when the live content is gone. */
    snapshot?: string | null;
}) {
    const [mediaRevealed, setMediaRevealed] = useState(false);
    const notice = VISIBILITY_NOTICE[visibility];

    return (
        <section
            aria-labelledby="preview-heading"
            className="overflow-hidden rounded-xl border bg-card shadow-sm"
        >
            <header className="flex items-center justify-between gap-3 border-b bg-muted/40 px-5 py-3">
                <div className="min-w-0">
                    <h2 id="preview-heading" className="text-sm font-semibold">
                        Reported content
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        {TARGET_TYPE_LABEL[preview.targetType] ??
                            preview.targetType}
                    </p>
                </div>

                {preview.deepLink && preview.available && (
                    <Link
                        to={preview.deepLink}
                        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Open in context
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </Link>
                )}
            </header>

            {notice && (
                <p
                    className={cn(
                        'flex items-center gap-2 border-b px-5 py-2.5 text-xs font-medium',
                        notice.className,
                    )}
                    role="status"
                >
                    <notice.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {notice.label}
                </p>
            )}

            <div className="space-y-4 p-5">
                {!preview.available && (
                    <p className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
                        <FileQuestion
                            className="mt-0.5 h-4 w-4 shrink-0"
                            aria-hidden="true"
                        />
                        The original content is no longer retrievable. What
                        follows is the snapshot captured when it was reported.
                    </p>
                )}

                {preview.title && (
                    <h3 className="text-base font-semibold">{preview.title}</h3>
                )}

                {(preview.body ?? snapshot) && (
                    <blockquote className="whitespace-pre-wrap rounded-lg border-l-4 border-muted-foreground/30 bg-muted/40 px-4 py-3 text-sm">
                        {preview.body ?? snapshot}
                    </blockquote>
                )}

                {preview.mediaUrl && (
                    <figure className="space-y-2">
                        <figcaption className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            {preview.targetType === 'UPLOADED_VIDEO' ? (
                                <Video className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                                <ImageIcon
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                />
                            )}
                            Attached media
                        </figcaption>

                        {mediaRevealed ? (
                            preview.targetType === 'UPLOADED_VIDEO' ? (
                                <video
                                    src={preview.mediaUrl}
                                    controls
                                    className="max-h-96 w-full rounded-lg border bg-black"
                                >
                                    <track kind="captions" />
                                </video>
                            ) : (
                                <img
                                    src={preview.mediaUrl}
                                    alt="The reported media, as submitted"
                                    className="max-h-96 w-full rounded-lg border object-contain"
                                />
                            )
                        ) : (
                            <button
                                type="button"
                                onClick={() => setMediaRevealed(true)}
                                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/50 text-sm text-muted-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <Eye className="h-5 w-5" aria-hidden="true" />
                                <span className="font-medium">
                                    Show media
                                </span>
                                <span className="text-xs">
                                    Hidden by default — it may be distressing
                                </span>
                            </button>
                        )}
                    </figure>
                )}

                {preview.externalUrl && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                        <p className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
                            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                            External link
                        </p>
                        {/*
                          Deliberately not a clickable anchor: reported links are
                          often phishing or malware. The moderator can copy it
                          into a sandbox if they need to inspect it.
                        */}
                        <code className="mt-1.5 block break-all rounded bg-background/60 px-2 py-1 text-xs">
                            {preview.externalUrl}
                        </code>
                        <p className="mt-1.5 text-xs text-amber-800 dark:text-amber-300">
                            Not clickable by design. Copy it into a sandbox if
                            you need to inspect it.
                        </p>
                    </div>
                )}

                {preview.authorId && (
                    <p className="text-xs text-muted-foreground">
                        Author:{' '}
                        <Link
                            to={`/dashboard/moderation/users/${preview.authorId}`}
                            className="font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            view moderation profile
                        </Link>
                    </p>
                )}
            </div>
        </section>
    );
}
