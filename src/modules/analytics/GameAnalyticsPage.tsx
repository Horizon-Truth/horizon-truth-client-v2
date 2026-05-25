import {
    Gamepad2,
    Users,
    Trophy,
    CheckCircle2,
    TrendingUp,
    BarChart3,
    PieChart as PieChartIcon,
    Loader2,
    AlertCircle,
    Download,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    Info
} from "lucide-react";
import { useGamePlayAnalytics, useRecentSessions } from "@/shared/hooks/useAnalytics";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import api from "@/services/api";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function GameAnalyticsPage() {
    const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useGamePlayAnalytics();
    const { data: recentSessions, isLoading: recentLoading } = useRecentSessions(10);

    const handleExport = async () => {
        try {
            const response = await api.get('/analytics/gameplay/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `gameplay-analytics-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Analytics exported successfully");
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to export analytics");
        }
    };

    if (statsLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (statsError) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h3 className="text-xl font-bold">Failed to load game analytics</h3>
                <p className="text-muted-foreground">Please try again later.</p>
                <Button onClick={() => refetchStats()}>Retry</Button>
            </div>
        );
    }

    const { overview, trend, popularity, distributions } = stats!;

    const cards = [
        { title: "Total Plays", value: overview.totalSessions, icon: Gamepad2, color: "text-blue-500", bg: "bg-blue-50/50" },
        { title: "Active Players", value: overview.uniquePlayers, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50/50" },
        { title: "Avg Score", value: overview.avgScore, icon: Trophy, color: "text-orange-500", bg: "bg-orange-50/50" },
        { title: "Completion Rate", value: `${overview.completionRate}%`, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50/50" },
    ];

    const outcomeData = Object.entries(distributions.outcomes).map(([name, value]) => ({ name, value }));
    const difficultyData = Object.entries(distributions.difficulties).map(([name, value]) => ({ name, value }));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="space-y-8 p-1"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                        Game Play Analytics
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                        Detailed insights into player performance and scenario engagement.
                    </p>
                </div>
                <Button 
                    onClick={handleExport}
                    className="rounded-xl font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <motion.div
                        key={card.title}
                        variants={itemVariants}
                        className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`rounded-xl p-3 ${card.bg} ${card.color}`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{card.title}</p>
                                <div className="text-3xl font-black mt-0.5">{card.value}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Play Trend Chart */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]"
                >
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Play Trend (Last 30 Days)
                    </h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trend}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    }}
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Popular Scenarios List */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]"
                >
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-indigo-500" />
                        Top Scenarios by Plays
                    </h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={popularity} layout="vertical" margin={{ left: 40, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" axisLine={false} tickLine={false} hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Distribution Charts */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Outcome Distribution */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]"
                >
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-pink-500" />
                        Outcome Distribution
                    </h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={outcomeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {outcomeData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Difficulty Distribution */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]"
                >
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                        Plays by Difficulty
                    </h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={difficultyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Additional Insight Card */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border bg-gradient-to-br from-primary to-indigo-600 p-8 text-white shadow-xl shadow-primary/20 flex flex-col justify-center gap-4"
                >
                    <h3 className="text-2xl font-bold italic tracking-tight">Performance Summary</h3>
                    <p className="font-medium opacity-90 leading-relaxed">
                        Currently, players are achieving an average score of <span className="text-white font-black">{overview.avgScore}</span> with a <span className="text-white font-black">{overview.completionRate}%</span> completion rate.
                    </p>
                    <div className="pt-4 text-center">
                        <p className="text-sm font-medium mb-2 opacity-80">Need deeper insights?</p>
                        <Button variant="outline" onClick={handleExport} className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl font-bold w-full h-12">
                            Download Detailed CSV
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Recent Sessions Table */}
            <motion.div
                variants={itemVariants}
                className="rounded-2xl border bg-card shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b flex items-center justify-between bg-muted/30">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Recent Game Sessions
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">Last 10 Sessions</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b">Player</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b">Scenario</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b">Score</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b">Outcome</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="p-4 border-b">
                                            <div className="h-4 bg-muted rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : recentSessions?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                                        No recent sessions found.
                                    </td>
                                </tr>
                            ) : (
                                recentSessions?.map((session) => (
                                    <tr key={session.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-4 border-b">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="font-bold text-sm">{session.playerName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Info className="h-3 w-3 text-indigo-400" />
                                                {session.scenarioTitle}
                                            </div>
                                        </td>
                                        <td className="p-4 border-b font-mono font-bold text-sm">
                                            {session.score}
                                        </td>
                                        <td className="p-4 border-b">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                                (session.outcome || '').toLowerCase().includes('success') 
                                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                    : "bg-amber-100 text-amber-700 border border-amber-200"
                                            )}>
                                                {(session.outcome || '').toLowerCase().includes('success') ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                {session.outcome || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="p-4 border-b text-xs text-muted-foreground font-medium">
                                            {new Date(session.createdAt).toLocaleDateString()} {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}
