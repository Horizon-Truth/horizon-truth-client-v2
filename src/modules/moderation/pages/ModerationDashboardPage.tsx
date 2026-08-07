import { Link } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock,
    Flag,
    Gavel,
    Inbox,
    ShieldAlert,
    Timer,
    UserX,
    Users,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';

import {
    useModerationAnalytics,
    useModerationDashboard,
    useModerationPermissions,
    useModerationQueue,
} from '@/shared/hooks/useModeration';
import { Permission } from '@/services/moderation.service';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { CaseStatusBadge, SeverityBadge } from '../components/badges';
import { ThemedTooltip } from '../components/ThemedTooltip';
import {
    CASE_STATUS_TONE,
    CHART_COLORS,
    REPORT_REASON_LABEL,
    SEVERITY_TONE,
    formatDuration,
} from '../constants';

/**
 * The moderator's landing screen: the state of the queue at a glance, the
 * trends behind it, and the highest-priority work waiting.
 */
export default function ModerationDashboardPage() {
    const { data: overview, isLoading, isError } = useModerationDashboard();
    const { can } = useModerationPermissions();

    const { data: analytics, isLoading: analyticsLoading } =
        useModerationAnalytics({ granularity: 'day' });

    // The triage list: unowned work, most severe first.
    const { data: urgent, isLoading: urgentLoading } = useModerationQueue({
        unassigned: true,
        openOnly: true,
        sortBy: 'severity',
        sortOrder: 'DESC',
        limit: 6,
    });

    if (isError) {
        return (
            <div
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center"
            >
                <ShieldAlert
                    className="mx-auto mb-3 h-8 w-8 text-destructive"
                    aria-hidden="true"
                />
                <h2 className="text-lg font-semibold">
                    The moderation dashboard could not be loaded
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Your session may have expired, or your account may no longer
                    hold moderation permissions.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Moderation
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Queue health, trends, and the work waiting for an owner.
                        {overview?.generatedAt && (
                            <>
                                {' '}
                                Updated{' '}
                                {formatDistanceToNow(
                                    new Date(overview.generatedAt),
                                    { addSuffix: true },
                                )}
                                .
                            </>
                        )}
                    </p>
                </div>

                <Link
                    to="/dashboard/moderation/queue"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    Open the queue
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </header>

            {/* --- Overview cards --- */}
            <section aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="sr-only">
                    Queue overview
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Pending reports"
                        value={overview?.pendingReports ?? 0}
                        icon={Inbox}
                        hint="All cases still needing action"
                        tone={
                            (overview?.pendingReports ?? 0) > 25
                                ? 'warning'
                                : 'default'
                        }
                        to="/dashboard/moderation/queue?openOnly=true"
                        isLoading={isLoading}
                    />
                    <StatCard
                        label="Awaiting review"
                        value={overview?.awaitingReview ?? 0}
                        icon={Clock}
                        hint="Unopened, no owner yet"
                        tone={
                            (overview?.awaitingReview ?? 0) > 10
                                ? 'warning'
                                : 'default'
                        }
                        to="/dashboard/moderation/queue?status=OPEN"
                        isLoading={isLoading}
                    />
                    <StatCard
                        label="Escalated"
                        value={overview?.escalated ?? 0}
                        icon={AlertTriangle}
                        hint="Raised to senior review"
                        tone={
                            (overview?.escalated ?? 0) > 0
                                ? 'critical'
                                : 'default'
                        }
                        to="/dashboard/moderation/queue?status=ESCALATED"
                        isLoading={isLoading}
                    />
                    <StatCard
                        label="Flagged content"
                        value={overview?.flaggedContent ?? 0}
                        icon={Flag}
                        hint="Items carrying a live flag"
                        isLoading={isLoading}
                    />
                    <StatCard
                        label="Suspended users"
                        value={overview?.suspendedUsers ?? 0}
                        icon={UserX}
                        hint="Sanctions currently in force"
                        isLoading={isLoading}
                    />
                    <StatCard
                        label="Active moderators"
                        value={overview?.activeModerators ?? 0}
                        icon={Users}
                        hint="Took an action this week"
                        isLoading={isLoading}
                    />
                    <StatCard
                        label="Resolved today"
                        value={overview?.resolvedToday ?? 0}
                        icon={CheckCircle2}
                        hint={`${overview?.reportsThisWeek ?? 0} reports this week`}
                        tone="positive"
                        isLoading={isLoading}
                    />
                    <StatCard
                        label="Avg. resolution"
                        value={formatDuration(overview?.averageResolutionSeconds)}
                        icon={Timer}
                        hint="Rolling 7-day mean"
                        isLoading={isLoading}
                    />
                </div>
            </section>

            {/* --- Open appeals callout --- */}
            {can(Permission.REVIEW_APPEALS) && (overview?.openAppeals ?? 0) > 0 && (
                <Link
                    to="/dashboard/moderation/appeals"
                    className="flex items-center justify-between gap-4 rounded-xl border border-amber-300 bg-amber-50 p-4 transition-colors hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-amber-500/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/15"
                >
                    <span className="flex items-center gap-3">
                        <Gavel
                            className="h-5 w-5 text-amber-700 dark:text-amber-400"
                            aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
                            {overview?.openAppeals} appeal
                            {overview?.openAppeals === 1 ? '' : 's'} awaiting a
                            decision
                        </span>
                    </span>
                    <ArrowRight
                        className="h-4 w-4 text-amber-700 dark:text-amber-400"
                        aria-hidden="true"
                    />
                </Link>
            )}

            {/* --- Charts --- */}
            {can(Permission.VIEW_ANALYTICS) && (
                <section
                    aria-labelledby="trends-heading"
                    className="grid grid-cols-1 gap-4 lg:grid-cols-2"
                >
                    <h2 id="trends-heading" className="sr-only">
                        Moderation trends
                    </h2>

                    <ChartCard
                        title="Reports over time"
                        description="Created versus closed, last 30 days"
                        isLoading={analyticsLoading}
                        isEmpty={!analytics?.reportsOverTime?.length}
                        className="lg:col-span-2"
                    >
                        <div
                            className="h-64"
                            role="img"
                            aria-label={`Daily report volume over the last 30 days. ${analytics?.resolutionStats.total ?? 0} cases were closed in the period.`}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.reportsOverTime ?? []}>
                                    <defs>
                                        <linearGradient
                                            id="created"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#0ea5e9"
                                                stopOpacity={0.35}
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#0ea5e9"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        dataKey="bucket"
                                        tick={{ fontSize: 11 }}
                                        className="fill-muted-foreground"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fontSize: 11 }}
                                        className="fill-muted-foreground"
                                        tickLine={false}
                                        axisLine={false}
                                        width={32}
                                    />
                                    <Tooltip content={<ThemedTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: 12 }}
                                        iconType="circle"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="created"
                                        name="Created"
                                        stroke="#0ea5e9"
                                        strokeWidth={2}
                                        fill="url(#created)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="resolved"
                                        name="Upheld"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fill="transparent"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="dismissed"
                                        name="Dismissed"
                                        stroke="#94a3b8"
                                        strokeWidth={2}
                                        strokeDasharray="4 3"
                                        fill="transparent"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <ChartCard
                        title="Most common violations"
                        description="Flags applied by moderators"
                        isLoading={analyticsLoading}
                        isEmpty={!analytics?.violationCategories?.length}
                    >
                        <div
                            className="h-64"
                            role="img"
                            aria-label={`Most applied flags: ${(analytics?.violationCategories ?? [])
                                .slice(0, 3)
                                .map((c) => `${c.label ?? c.name} (${c.value})`)
                                .join(', ')}`}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={analytics?.violationCategories ?? []}
                                    layout="vertical"
                                    margin={{ left: 8, right: 16 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        horizontal={false}
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        type="number"
                                        allowDecimals={false}
                                        tick={{ fontSize: 11 }}
                                        className="fill-muted-foreground"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="label"
                                        width={130}
                                        tick={{ fontSize: 11 }}
                                        className="fill-muted-foreground"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip content={<ThemedTooltip />} />
                                    <Bar
                                        dataKey="value"
                                        name="Applications"
                                        radius={[0, 4, 4, 0]}
                                        barSize={18}
                                    >
                                        {(analytics?.violationCategories ?? []).map(
                                            (_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={
                                                        CHART_COLORS[
                                                            i % CHART_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ),
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <ChartCard
                        title="Queue composition"
                        description="Where every case currently sits"
                        isLoading={analyticsLoading}
                        isEmpty={!analytics?.statusBreakdown?.length}
                    >
                        <div
                            className="h-64"
                            role="img"
                            aria-label={`Case status breakdown: ${(analytics?.statusBreakdown ?? [])
                                .map((s) => `${s.name} ${s.value}`)
                                .join(', ')}`}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics?.statusBreakdown ?? []}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={2}
                                    >
                                        {(analytics?.statusBreakdown ?? []).map(
                                            (entry, i) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={
                                                        CASE_STATUS_TONE[
                                                            entry.name as keyof typeof CASE_STATUS_TONE
                                                        ]?.hex ??
                                                        CHART_COLORS[
                                                            i % CHART_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ),
                                        )}
                                    </Pie>
                                    <Tooltip content={<ThemedTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: 11 }}
                                        iconType="circle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </section>
            )}

            {/* --- Triage list --- */}
            <section
                aria-labelledby="triage-heading"
                className="rounded-xl border bg-card text-card-foreground shadow-sm"
            >
                <header className="flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <h2 id="triage-heading" className="text-sm font-semibold">
                            Waiting for an owner
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Unassigned open cases, most severe first
                        </p>
                    </div>
                    <Link
                        to="/dashboard/moderation/queue?unassigned=true&openOnly=true"
                        className="text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        View all
                    </Link>
                </header>

                {urgentLoading ? (
                    <ul className="divide-y">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <li key={i} className="px-5 py-4">
                                <div
                                    className="h-5 animate-pulse rounded bg-muted"
                                    aria-hidden="true"
                                />
                            </li>
                        ))}
                    </ul>
                ) : (urgent?.items.length ?? 0) === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                        Nothing unassigned. The queue is clear.
                    </p>
                ) : (
                    <ul className="divide-y">
                        {urgent?.items.map((c) => (
                            <li key={c.id}>
                                <Link
                                    to={`/dashboard/moderation/cases/${c.id}`}
                                    className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-accent/40 focus:outline-none focus-visible:bg-accent/40"
                                >
                                    <span
                                        className="mt-1 h-2 w-2 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor:
                                                SEVERITY_TONE[c.severity].hex,
                                        }}
                                        aria-hidden="true"
                                    />
                                    <span className="min-w-0 flex-1">
                                        <span className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-xs text-muted-foreground">
                                                {c.caseNumber}
                                            </span>
                                            <SeverityBadge
                                                severity={c.severity}
                                            />
                                            <CaseStatusBadge status={c.status} />
                                            <span className="text-xs text-muted-foreground">
                                                {REPORT_REASON_LABEL[
                                                    c.reportReason
                                                ] ?? c.reportReason}
                                            </span>
                                        </span>
                                        <span className="mt-1 block truncate text-sm">
                                            {c.description}
                                        </span>
                                    </span>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(c.createdAt),
                                            { addSuffix: true },
                                        )}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
