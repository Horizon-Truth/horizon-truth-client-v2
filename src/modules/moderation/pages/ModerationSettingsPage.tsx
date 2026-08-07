import { useState } from 'react';
import { Lock, Plus, Settings2, Trash2 } from 'lucide-react';

import {
    Permission,
    type FlagSeverity,
    type ModerationFlag,
} from '@/services/moderation.service';
import {
    useFlagCatalogue,
    useFlagMutation,
    useModerationPermissions,
    useModerators,
} from '@/shared/hooks/useModeration';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

import { FlagSeverityBadge } from '../components/badges';
import { flagColorClasses } from '../constants';

const SEVERITIES: FlagSeverity[] = ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const COLORS = [
    'red',
    'rose',
    'orange',
    'amber',
    'emerald',
    'cyan',
    'blue',
    'indigo',
    'violet',
    'purple',
    'slate',
];

/**
 * Administrative settings: the flag catalogue and the moderation roster.
 *
 * The catalogue is editable so policy language can be retuned without a
 * deploy, but flag *codes* are immutable and system flags cannot be deleted —
 * historical decisions and analytics reference them.
 */
export default function ModerationSettingsPage() {
    const { can } = useModerationPermissions();
    const { data: flags, isLoading } = useFlagCatalogue(true);
    const { data: moderators } = useModerators();

    const createFlag = useFlagMutation('create');
    const updateFlag = useFlagMutation('update');
    const deleteFlag = useFlagMutation('delete');

    const [editing, setEditing] = useState<ModerationFlag | null>(null);
    const [creating, setCreating] = useState(false);

    const canManage = can(Permission.MANAGE_FLAGS);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
                    <Settings2 className="h-6 w-6 text-primary" aria-hidden="true" />
                    Moderation settings
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    The flag catalogue and the moderation roster.
                </p>
            </header>

            {/* --- Flag catalogue --- */}
            <section
                aria-labelledby="catalogue-heading"
                className="overflow-hidden rounded-xl border bg-card shadow-sm"
            >
                <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
                    <div>
                        <h2 id="catalogue-heading" className="text-sm font-semibold">
                            Flag catalogue
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Labels, colours and severities can be retuned. Codes
                            are permanent so analytics stay comparable.
                        </p>
                    </div>

                    {canManage && (
                        <Button size="sm" onClick={() => setCreating(true)}>
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            New flag
                        </Button>
                    )}
                </header>

                {isLoading ? (
                    <ul className="divide-y">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <li key={i} className="px-5 py-4">
                                <div
                                    className="h-5 animate-pulse rounded bg-muted"
                                    aria-hidden="true"
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul className="divide-y">
                        {flags?.map((flag) => (
                            <li
                                key={flag.id}
                                className={cn(
                                    'flex flex-wrap items-start gap-4 px-5 py-4',
                                    !flag.isActive && 'opacity-60',
                                )}
                            >
                                <span
                                    className={cn(
                                        'rounded-full border px-3 py-1 text-xs font-semibold',
                                        flagColorClasses(flag.color),
                                    )}
                                >
                                    {flag.label}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                                            {flag.code}
                                        </code>
                                        <FlagSeverityBadge severity={flag.severity} />
                                        {flag.isSystem && (
                                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                <Lock
                                                    className="h-3 w-3"
                                                    aria-hidden="true"
                                                />
                                                System
                                            </span>
                                        )}
                                        {!flag.isActive && (
                                            <span className="text-xs font-medium text-muted-foreground">
                                                Retired
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {flag.description}
                                    </p>
                                    {flag.translations && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Translated:{' '}
                                            {Object.keys(flag.translations).join(', ')}
                                        </p>
                                    )}
                                </div>

                                {canManage && (
                                    <div className="flex shrink-0 gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditing(flag)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            aria-label={`Remove the ${flag.label} flag`}
                                            onClick={() =>
                                                deleteFlag.mutate({ id: flag.id })
                                            }
                                        >
                                            <Trash2
                                                className="h-4 w-4 text-destructive"
                                                aria-hidden="true"
                                            />
                                        </Button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* --- Roster --- */}
            <section
                aria-labelledby="roster-heading"
                className="overflow-hidden rounded-xl border bg-card shadow-sm"
            >
                <header className="border-b px-5 py-4">
                    <h2 id="roster-heading" className="text-sm font-semibold">
                        Moderation roster
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Current workload per moderator. Use it to balance
                        assignments rather than to rank people.
                    </p>
                </header>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <caption className="sr-only">
                            Moderation staff with their roles and current open
                            case counts.
                        </caption>
                        <thead className="border-b bg-muted/40">
                            <tr>
                                {['Name', 'Role', 'Open cases', 'Last seen'].map(
                                    (header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                        >
                                            {header}
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {(moderators ?? []).map((m) => (
                                <tr key={m.id} className="hover:bg-accent/40">
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{m.fullName}</p>
                                        {m.email && (
                                            <p className="text-xs text-muted-foreground">
                                                {m.email}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs">{m.role}</td>
                                    <td
                                        className={cn(
                                            'px-4 py-3 tabular-nums',
                                            m.openCases > 15 &&
                                                'font-semibold text-amber-600 dark:text-amber-400',
                                        )}
                                    >
                                        {m.openCases}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        {m.lastLoginAt
                                            ? new Date(
                                                  m.lastLoginAt,
                                              ).toLocaleDateString()
                                            : 'never'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {(creating || editing) && (
                <FlagDialog
                    flag={editing}
                    isPending={createFlag.isPending || updateFlag.isPending}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                    onSave={(payload) => {
                        if (editing) {
                            updateFlag.mutate(
                                { id: editing.id, payload },
                                { onSuccess: () => setEditing(null) },
                            );
                        } else {
                            createFlag.mutate(
                                { payload },
                                { onSuccess: () => setCreating(false) },
                            );
                        }
                    }}
                />
            )}
        </div>
    );
}

function FlagDialog({
    flag,
    isPending,
    onClose,
    onSave,
}: {
    flag: ModerationFlag | null;
    isPending: boolean;
    onClose: () => void;
    onSave: (payload: Record<string, unknown>) => void;
}) {
    const [code, setCode] = useState(flag?.code ?? '');
    const [label, setLabel] = useState(flag?.label ?? '');
    const [description, setDescription] = useState(flag?.description ?? '');
    const [severity, setSeverity] = useState<FlagSeverity>(
        flag?.severity ?? 'MEDIUM',
    );
    const [color, setColor] = useState(flag?.color ?? 'slate');
    const [isActive, setIsActive] = useState(flag?.isActive ?? true);

    const isEdit = !!flag;
    const codeValid = isEdit || /^[A-Z][A-Z0-9_]{2,49}$/.test(code);
    const canSave =
        codeValid && label.trim().length > 0 && description.trim().length > 0;

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? `Edit ${flag.label}` : 'New flag'}
                    </DialogTitle>
                    <DialogDescription>
                        Flags record a moderator's assessment. Write the
                        description so a new moderator can apply it correctly
                        without asking.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {!isEdit && (
                        <div className="space-y-2">
                            <Label htmlFor="flag-code">Code</Label>
                            <Input
                                id="flag-code"
                                value={code}
                                onChange={(e) =>
                                    setCode(e.target.value.toUpperCase())
                                }
                                placeholder="ELECTION_INTEGRITY"
                                aria-invalid={code.length > 0 && !codeValid}
                                aria-describedby="flag-code-help"
                            />
                            <p
                                id="flag-code-help"
                                className={cn(
                                    'text-xs',
                                    code.length > 0 && !codeValid
                                        ? 'text-destructive'
                                        : 'text-muted-foreground',
                                )}
                            >
                                UPPER_SNAKE_CASE, 3–50 characters. Permanent once
                                saved.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="flag-label">Label</Label>
                        <Input
                            id="flag-label"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Election Integrity"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="flag-description">Description</Label>
                        <Textarea
                            id="flag-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="When should a moderator reach for this flag, and when should they not?"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="flag-severity">Severity</Label>
                        <select
                            id="flag-severity"
                            value={severity}
                            onChange={(e) =>
                                setSeverity(e.target.value as FlagSeverity)
                            }
                            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {SEVERITIES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-muted-foreground">
                            Severity weights the user's risk score, so set it to
                            match real-world harm.
                        </p>
                    </div>

                    <fieldset className="space-y-2">
                        <legend className="text-sm font-medium">Colour</legend>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((c) => (
                                <label
                                    key={c}
                                    className={cn(
                                        'cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-all',
                                        flagColorClasses(c),
                                        color === c &&
                                            'ring-2 ring-ring ring-offset-2',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="flag-color"
                                        value={c}
                                        checked={color === c}
                                        onChange={() => setColor(c)}
                                        className="sr-only"
                                    />
                                    {c}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="h-4 w-4 rounded border-input accent-primary"
                        />
                        Available for moderators to apply
                    </label>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!canSave || isPending}
                        onClick={() =>
                            onSave({
                                ...(isEdit ? {} : { code }),
                                label: label.trim(),
                                description: description.trim(),
                                severity,
                                color,
                                isActive,
                            })
                        }
                    >
                        {isEdit ? 'Save changes' : 'Create flag'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
