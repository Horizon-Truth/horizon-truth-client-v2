import { useState } from "react";
import { Check, Copy, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { defangUrl } from "@/shared/utils/defang";

/**
 * Shows a reported URL without making it clickable.
 *
 * The address is rendered defanged (`hxxps://evil[.]com`) so it cannot be
 * followed by a click, a middle-click, or a keyboard activation — there is no
 * anchor element at all. Investigators who genuinely need the address get a
 * copy button, which puts the real URL on the clipboard for a sandbox without
 * ever navigating this browser to it.
 */
export interface DefangedUrlProps {
    url: string;
    /** Optional label above the address, e.g. "Source URL". */
    label?: string;
    className?: string;
}

export function DefangedUrl({ url, label, className }: DefangedUrlProps) {
    const [copied, setCopied] = useState(false);
    const defanged = defangUrl(url);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Original link copied — open it only in a safe environment");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Could not copy the link");
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && <h4 className="font-bold">{label}</h4>}

            <p
                // Not an <a>: reported content must never be one click away.
                className="font-mono text-sm break-all text-foreground/90"
                data-testid="defanged-url"
            >
                {defanged}
            </p>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
                >
                    {copied ? (
                        <Check size={14} aria-hidden="true" />
                    ) : (
                        <Copy size={14} aria-hidden="true" />
                    )}
                    {copied ? "Copied" : "Copy original link"}
                </button>

                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldAlert size={14} className="shrink-0" aria-hidden="true" />
                    Link disabled for safety. It may lead to the reported content.
                </span>
            </div>
        </div>
    );
}

export default DefangedUrl;
