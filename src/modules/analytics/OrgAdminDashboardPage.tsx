import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
    Building2, Users, Gamepad2, BookOpen, MessageSquare,
    TrendingUp, AlertCircle, Loader2, Shield
} from "lucide-react";
import { useAnalyticsStats } from "@/shared/hooks/useAnalytics";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from "framer-motion";
import { useDevice } from "@/shared/hooks/useDevice";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function OrgAdminDashboardPage() {
    const { isLowEndDevice, prefersReducedMotion } = useDevice();
    const { data: stats, isLoading, isError } = useAnalyticsStats();

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
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h3 className="text-xl font-bold">Failed to load dashboard</h3>
                <p className="text-muted-foreground">Please try again or contact a system administrator.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const o = stats?.overview;
    const orgDist = Object.entries(stats?.distributions.organizations || {}).map(([name, value]) => ({ name, value }));

    const cards = [
        { title: "Total Users", value: o?.users, icon: Users, color: "text-blue-500", bg: "bg-blue-50/50" },
        { title: "Organizations", value: o?.organizations, icon: Building2, color: "text-indigo-500", bg: "bg-indigo-50/50" },
        { title: "Players", value: o?.players, icon: Gamepad2, color: "text-purple-500", bg: "bg-purple-50/50" },
        { title: "Scenarios", value: o?.scenarios, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50/50" },
        { title: "Feedback", value: o?.feedback, icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-50/50" },
        { title: "Reports", value: o?.reports, icon: Shield, color: "text-red-500", bg: "bg-red-50/50" },
    ];

    const barData = [
        { name: 'Users', count: o?.users },
        { name: 'Players', count: o?.players },
    ];

    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: isLowEndDevice ? 0 : 0.1 } } };
    const item = { hidden: { y: isLowEndDevice ? 0 : 16, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.div className="space-y-8 p-1" initial="hidden" animate="visible" variants={container}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-primary">
                        Organisation Dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                        Overview of your organisation's users, moderation activity, and platform health.
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button asChild variant="outline" className="rounded-xl font-semibold border-2">
                        <Link to="/dashboard/moderation">Moderation</Link>
                    </Button>
                    <Button asChild className="rounded-xl font-bold shadow-lg shadow-primary/20">
                        <Link to="/dashboard/moderation/queue">
                            <Shield className="mr-2 h-4 w-4" />Review Queue
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3">
                {cards.map((card) => (
                    <motion.div key={card.title} variants={item}
                        whileHover={!isLowEndDevice && !prefersReducedMotion ? { scale: 1.02, translateY: -4 } : undefined}
                        className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <card.icon className="h-14 w-14" />
                        </div>
                        <div className={`rounded-xl p-2.5 ${card.bg} ${card.color} w-fit mb-3`}>
                            <card.icon className="h-5 w-5" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{card.title}</p>
                        <div className="text-2xl font-black mt-0.5">{card.value ?? '—'}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={item} className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[380px]">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />User Composition
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={item} className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[380px]">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-indigo-500" />Organizations by Status
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={orgDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={8} dataKey="value">
                                    {orgDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
                <Link to="/dashboard/moderation" className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-shield-500 group">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="font-bold group-hover:text-primary transition-colors">Moderation Dashboard</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Review flagged content, manage cases, and track moderation activity.</p>
                </Link>
                <Link to="/dashboard/moderation/queue" className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-orange-500 group">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <h3 className="font-bold group-hover:text-orange-600 transition-colors">Review Queue</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Open cases pending review. Respond to reports and player issues.</p>
                </Link>
                <Link to="/dashboard/moderation/analytics" className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-emerald-500 group">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <h3 className="font-bold group-hover:text-emerald-600 transition-colors">Moderation Analytics</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Track resolution times, case volumes, and moderator performance.</p>
                </Link>
            </motion.div>
        </motion.div>
    );
}
