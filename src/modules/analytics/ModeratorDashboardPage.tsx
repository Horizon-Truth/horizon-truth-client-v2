import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
    Shield, Inbox, AlertTriangle, Clock, CheckCircle,
    Loader2, FileText, BarChart3
} from "lucide-react";
import { useModerationDashboard } from "@/shared/hooks/useModeration";
import type { DashboardOverview } from "@/services/moderation.service";
import { motion } from "framer-motion";
import { useDevice } from "@/shared/hooks/useDevice";

export default function ModeratorDashboardPage() {
    const { isLowEndDevice } = useDevice();
    const { data: dashboard, isLoading, isError } = useModerationDashboard();

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <h3 className="text-xl font-bold">Failed to load moderation dashboard</h3>
                <p className="text-muted-foreground">You may not have permission. Contact an administrator.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const d: DashboardOverview = dashboard || {} as DashboardOverview;

    const cards = [
        { title: "Pending Reports", value: d.pendingReports ?? 0, icon: Inbox, color: "text-orange-500", bg: "bg-orange-50/50" },
        { title: "Awaiting Review", value: d.awaitingReview ?? 0, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50/50" },
        { title: "Resolved Today", value: d.resolvedToday ?? 0, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50/50" },
        { title: "Reports This Week", value: d.reportsThisWeek ?? 0, icon: FileText, color: "text-blue-500", bg: "bg-blue-50/50" },
        { title: "Escalated", value: d.escalated ?? 0, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50/50" },
        { title: "Flagged Content", value: d.flaggedContent ?? 0, icon: Shield, color: "text-purple-500", bg: "bg-purple-50/50" },
        { title: "Open Appeals", value: d.openAppeals ?? 0, icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-50/50" },
        { title: "Active Moderators", value: d.activeModerators ?? 0, icon: Shield, color: "text-teal-500", bg: "bg-teal-50/50" },
    ];

    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: isLowEndDevice ? 0 : 0.08 } } };
    const item = { hidden: { y: isLowEndDevice ? 0 : 16, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.div className="space-y-8 p-1" initial="hidden" animate="visible" variants={container}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-primary">
                        Moderation Dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                        Your moderation workload — cases, queues, and quick actions.
                    </p>
                </div>
                <Button asChild className="rounded-xl font-bold shadow-lg shadow-primary/20">
                    <Link to="/dashboard/moderation/queue">
                        <Inbox className="mr-2 h-4 w-4" />Open Queue
                    </Link>
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {cards.map((card) => (
                    <motion.div key={card.title} variants={item}
                        className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <card.icon className="h-14 w-14" />
                        </div>
                        <div className={`rounded-xl p-2.5 ${card.bg} ${card.color} w-fit mb-3`}>
                            <card.icon className="h-5 w-5" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{card.title}</p>
                        <div className="text-2xl font-black mt-0.5">{card.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Link to="/dashboard/moderation/queue" className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-orange-500 group">
                    <div className="flex items-center gap-3 mb-2">
                        <Inbox className="h-5 w-5 text-orange-500" />
                        <h3 className="font-bold group-hover:text-orange-600 transition-colors text-sm">Review Queue</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">Cases pending your review and assignment.</p>
                </Link>
                <Link to="/dashboard/moderation" className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary group">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="font-bold group-hover:text-primary transition-colors text-sm">Case Overview</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">All cases with status and severity filters.</p>
                </Link>
                <Link to="/dashboard/moderation/analytics" className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-emerald-500 group">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                        <h3 className="font-bold group-hover:text-emerald-600 transition-colors text-sm">My Analytics</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">Your resolution stats and response times.</p>
                </Link>
                <Link to="/dashboard/my-record" className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500 group">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <h3 className="font-bold group-hover:text-blue-600 transition-colors text-sm">My Record</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">Your personal moderation history and decisions.</p>
                </Link>
            </motion.div>
        </motion.div>
    );
}
