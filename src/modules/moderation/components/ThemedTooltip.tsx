/**
 * Recharts' default tooltip is inline-styled white with a light border, which
 * is unreadable against a dark background. This replacement uses the popover
 * theme tokens so it follows light and dark alike.
 */
export function ThemedTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number | string; color?: string }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md">
            {label && <p className="mb-1 text-xs font-semibold">{label}</p>}
            {payload.map((entry, i) => (
                <p key={i} className="flex items-center gap-3 text-xs">
                    <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: entry.color }}
                        aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{entry.name}</span>
                    <span className="ml-auto font-semibold tabular-nums">
                        {entry.value}
                    </span>
                </p>
            ))}
        </div>
    );
}
