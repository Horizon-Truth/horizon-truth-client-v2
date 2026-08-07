import { useState } from 'react';
import {
    BarChart3,
    Download,
    FileSpreadsheet,
    FileText,
    Loader2,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { toast } from 'sonner';

import {
    Permission,
    downloadBlob,
    moderationService,
    type AnalyticsQuery,
} from '@/services/moderation.service';
import {
    useModerationAnalytics,
    useModerationPermissions,
    useModeratorScorecard,
    extractErrorMessage,
} from '@/shared/hooks/useModeration';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';

import { ChartCard } from '../components/ChartCard';
import { ThemedTooltip } from '../components/ThemedTooltip';
import { StatCard } from '../components/StatCard';
import {
    CASE_STATUS_TONE,
    CHART_COLORS,
    SEVERITY_TONE,
    formatDuration,
} from '../constants';

const RANGES = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
];

/**
 * Moderator analytics: throughput, speed, categories and appeal outcomes,
 * plus export in the three formats the programme reports in.
 */
export default function ModerationAnalyticsPage() {
    const { can } = useModerationPermissions();
    const [days, setDays] = useState(30);
    const [granularity, setGranularity] =
        useState<AnalyticsQuery['granularity']>('day');
    const [exporting, setExporting] = useState<string | null>(null);

    const query: AnalyticsQuery = {
        from: new Date(Date.now() - days * 86_400_000).toISOString(),
        granularity,
    };

    const { data, isLoading } = useModerationAnalytics(query);
    const { data: scorecard, isLoading: scorecardLoading } =
        useModeratorScorecard(query);

    const exportAs = async (format: 'csv' | 'xlsx' | 'pdf') => {
        setExporting(format);
        try {
            const blob = await moderationService.exportAnalytics({
                ...query,
                format,
            });
            const extension = format === 'xlsx' ? 'xls' : format;
            downloadBlob(
                blob,
                `moderation-report-${new Date().toISOString().split('T')[0]}.${extension}`,
            );
            toast.success(`Exported as ${format.toUpperCase()}`);
        } catch (error) {
            toast.error(extractErrorMessage(error));
        } finally {
            setExporting(null);
        }
    };

    const stats = data?.resolutionStats;

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
                        <BarChart3
                            className="h-6 w-6 text-primary"
                            aria-hidden="true"
                        />
                        Moderation analytics
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        How much work is arriving, how fast it is handled, and
                        how often decisions survive appeal.
                    </p>
                </div>

                {can(Permission.EXPORT_DATA) && (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={exporting !== null}
                            onClick={() => exportAs('csv')}
                        >
                            {exporting === 'csv' ? (
                                <Loader2
                                    className="h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Download className="h-4 w-4" aria-hidden="true" />
                            )}
                            CSV
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={exporting !== null}
                            onClick={() => exportAs('xlsx')}
                        >
                            {exporting === 'xlsx' ? (
                                <Loader2
                                    className="h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                            ) : (
                                <FileSpreadsheet
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            )}
                            Excel
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={exporting !== null}
                            onClick={() => exportAs('pdf')}
                        >
                            {exporting === 'pdf' ? (
                                <Loader2
                                    className="h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                            ) : (
                                <FileText className="h-4 w-4" aria-hidden="true" />
                            )}
                            PDF
                        </Button>
                    </div>
                )}
            </header>

            {/* --- Controls --- */}
            <div className="flex flex-wrap items-end gap-4 rounded-xl border bg-card p-4 shadow-sm">
                <fieldset className="flex flex-wrap gap-2">
                    <legend className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Period
                    </legend>
                    {RANGES.map((range) => (
                        <button
                            key={range.days}
                            type="button"
                            onClick={() => setDays(range.days)}
                            aria-pressed={days === range.days}
                            className={cn(
                                'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                days === range.days
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-background text-muted-foreground hover:bg-accent',
                            )}
                        >
                            {range.label}
                        </button>
                    ))}
                </fieldset>

                <div className="space-y-1.5">
                    <Label htmlFor="granularity" className="text-xs uppercase tracking-wide text-muted-foreground">
                        Group by
                    </Label>
                    <select
                        id="granularity"
                        value={granularity}
                        onChange={(e) =>
                            setGranularity(
                                e.target.value as AnalyticsQuery['granularity'],
                            )
                        }
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
            </div>

            {/* --- Headline numbers --- */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Cases closed"
                    value={stats?.total ?? 0}
                    icon={BarChart3}
                    hint={`${stats?.upheld ?? 0} upheld · ${stats?.dismissed ?? 0} dismissed`}
                    isLoading={isLoading}
                />
                <StatCard
                    label="Median resolution"
                    value={formatDuration(stats?.medianSeconds)}
                    icon={BarChart3}
                    hint={`90th percentile ${formatDuration(stats?.p90Seconds)}`}
                    isLoading={isLoading}
                />
                <StatCard
                    label="Appeals decided"
                    value={data?.appealStats.decided ?? 0}
                    icon={BarChart3}
                    hint={`${data?.appealStats.total ?? 0} submitted in period`}
                    isLoading={isLoading}
                />
                <StatCard
                    label="Overturn rate"
                    value={
                        data?.appealStats.overturnRatePercent !== null &&
                        data?.appealStats.overturnRatePercent !== undefined
                            ? `${data.appealStats.overturnRatePercent}%`
                            : '—'
                    }
                    icon={BarChart3}
                    hint="Decisions reversed on appeal"
                    tone={
                        (data?.appealStats.overturnRatePercent ?? 0) > 20
                            ? 'warning'
                            : 'default'
                    }
                    isLoading={isLoading}
                />
            </div>

            {/* --- Charts --- */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ChartCard
                    title="Report volume"
                    description={`Grouped by ${granularity}`}
                    isLoading={isLoading}
                    isEmpty={!data?.reportsOverTime?.length}
                    className="lg:col-span-2"
                >
                    <div
                        className="h-72"
                        role="img"
                        aria-label={`Report volume grouped by ${granularity}, showing created, upheld, dismissed and escalated counts.`}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.reportsOverTime ?? []}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    className="stroke-border"
                                />
                                <XAxis
                                    dataKey="bucket"
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    className="fill-muted-foreground"
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={32}
                                    className="fill-muted-foreground"
                                />
                                <Tooltip content={<ThemedTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                                <Line
                                    type="monotone"
                                    dataKey="created"
                                    name="Created"
                                    stroke="#0ea5e9"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="resolved"
                                    name="Upheld"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="dismissed"
                                    name="Dismissed"
                                    stroke="#94a3b8"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="escalated"
                                    name="Escalated"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                <ChartCard
                    title="Reports by content type"
                    description="What is being reported"
                    isLoading={isLoading}
                    isEmpty={!data?.reportsByType?.length}
                >
                    <div
                        className="h-64"
                        role="img"
                        aria-label={`Reports by content type: ${(data?.reportsByType ?? []).map((t) => `${t.name} ${t.value}`).join(', ')}`}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.reportsByType ?? []}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={50}
                                    outerRadius={82}
                                    paddingAngle={2}
                                >
                                    {(data?.reportsByType ?? []).map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<ThemedTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                <ChartCard
                    title="Severity mix"
                    description="How serious the incoming reports are"
                    isLoading={isLoading}
                    isEmpty={!data?.severityBreakdown?.length}
                >
                    <div
                        className="h-64"
                        role="img"
                        aria-label={`Severity mix: ${(data?.severityBreakdown ?? []).map((s) => `${s.name} ${s.value}`).join(', ')}`}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.severityBreakdown ?? []}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    className="stroke-border"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    className="fill-muted-foreground"
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={32}
                                    className="fill-muted-foreground"
                                />
                                <Tooltip content={<ThemedTooltip />} />
                                <Bar dataKey="value" name="Reports" radius={[4, 4, 0, 0]}>
                                    {(data?.severityBreakdown ?? []).map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={
                                                SEVERITY_TONE[
                                                    entry.name as keyof typeof SEVERITY_TONE
                                                ]?.hex ?? '#94a3b8'
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                <ChartCard
                    title="Content removal trends"
                    description="Hidden, deleted and restored over time"
                    isLoading={isLoading}
                    isEmpty={!data?.removalTrends?.length}
                    className="lg:col-span-2"
                >
                    <div
                        className="h-64"
                        role="img"
                        aria-label="Content actions over time: flagged, hidden, deleted and restored."
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.removalTrends ?? []}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    className="stroke-border"
                                />
                                <XAxis
                                    dataKey="bucket"
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    className="fill-muted-foreground"
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={32}
                                    className="fill-muted-foreground"
                                />
                                <Tooltip content={<ThemedTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                                <Bar dataKey="flagged" name="Flagged" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="hidden" name="Hidden" stackId="a" fill="#f97316" />
                                <Bar dataKey="deleted" name="Deleted" stackId="a" fill="#ef4444" />
                                <Bar dataKey="restored" name="Restored" stackId="a" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* --- Moderator scorecard --- */}
            <section
                aria-labelledby="scorecard-heading"
                className="overflow-hidden rounded-xl border bg-card shadow-sm"
            >
                <header className="border-b px-5 py-4">
                    <h2 id="scorecard-heading" className="text-sm font-semibold">
                        Moderator activity
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        “Accuracy” means decisions that were not overturned on
                        appeal. It is a proxy for quality, not a performance
                        target — an unappealed decision counts as sound because
                        nobody contested it.
                    </p>
                </header>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <caption className="sr-only">
                            Per-moderator throughput, workload, speed and appeal
                            outcomes for the selected period.
                        </caption>
                        <thead className="border-b bg-muted/40">
                            <tr>
                                {[
                                    'Moderator',
                                    'Role',
                                    'Handled',
                                    'Upheld',
                                    'Dismissed',
                                    'Pending',
                                    'Avg. time',
                                    'Overturned',
                                    'Accuracy',
                                ].map((header) => (
                                    <th
                                        key={header}
                                        scope="col"
                                        className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {scorecardLoading ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center">
                                        <Loader2
                                            className="mx-auto h-5 w-5 animate-spin text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    </td>
                                </tr>
                            ) : (scorecard?.length ?? 0) === 0 ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-4 py-12 text-center text-sm text-muted-foreground"
                                    >
                                        No moderator activity in this period.
                                    </td>
                                </tr>
                            ) : (
                                scorecard?.map((row) => (
                                    <tr key={row.moderatorId} className="hover:bg-accent/40">
                                        <td className="px-4 py-3 font-medium">
                                            {row.fullName}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {row.role}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums">
                                            {row.handled}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums">
                                            {row.upheld}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums">
                                            {row.dismissed}
                                        </td>
                                        <td
                                            className={cn(
                                                'px-4 py-3 tabular-nums',
                                                row.pending > 15 &&
                                                    'font-semibold text-amber-600 dark:text-amber-400',
                                            )}
                                        >
                                            {row.pending}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums">
                                            {formatDuration(
                                                row.averageResolutionSeconds,
                                            )}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums">
                                            {row.appealsOverturned}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums">
                                            {row.accuracyPercent === null
                                                ? '—'
                                                : `${row.accuracyPercent}%`}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Status legend, so the pie colours are decodable without hovering. */}
            <p className="sr-only">
                Status colours:{' '}
                {Object.entries(CASE_STATUS_TONE)
                    .map(([key, tone]) => `${key} is ${tone.label}`)
                    .join(', ')}
                .
            </p>
        </div>
    );
}
