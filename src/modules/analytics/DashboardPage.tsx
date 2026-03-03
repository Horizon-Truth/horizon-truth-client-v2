import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
    Users,
    Building2,
    Gamepad2,
    BookOpen,
    MessageSquare,
    FileText,
    Mail,
    PlayCircle,
    TrendingUp,
    AlertCircle,
    Loader2
} from "lucide-react";
import { useAnalyticsStats } from "@/shared/hooks/useAnalytics";
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
    Legend
} from 'recharts';
import { motion } from "framer-motion";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function DashboardPage() {
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
                <h3 className="text-xl font-bold">Failed to load analytics</h3>
                <p className="text-muted-foreground">Please make sure you have admin permissions and try again.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const overviewData = stats?.overview;

    const cards = [
        { title: "Total Users", value: overviewData?.users, icon: Users, color: "text-blue-500", bg: "bg-blue-50/50" },
        { title: "Organizations", value: overviewData?.organizations, icon: Building2, color: "text-indigo-500", bg: "bg-indigo-50/50" },
        { title: "Players", value: overviewData?.players, icon: Gamepad2, color: "text-purple-500", bg: "bg-purple-50/50" },
        { title: "Guest Plays", value: overviewData?.guestPlays, icon: PlayCircle, color: "text-pink-500", bg: "bg-pink-50/50" },
        { title: "Scenarios", value: overviewData?.scenarios, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50/50" },
        { title: "Feedback", value: overviewData?.feedback, icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-50/50" },
        { title: "Blog Posts", value: overviewData?.blogs, icon: FileText, color: "text-cyan-500", bg: "bg-cyan-50/50" },
        { title: "Resources", value: overviewData?.resources, icon: BookOpen, color: "text-teal-500", bg: "bg-teal-50/50" },
        { title: "Contact reports", value: overviewData?.contacts, icon: Mail, color: "text-rose-500", bg: "bg-rose-50/50" },
    ];

    const orgDist = Object.entries(stats?.distributions.organizations || {}).map(([name, value]) => ({ name, value }));
    const feedbackDist = Object.entries(stats?.distributions.feedback || {}).map(([name, value]) => ({ name, value }));

    const barData = [
        { name: 'Users', count: overviewData?.users },
        { name: 'Players', count: overviewData?.players },
        { name: 'Guests', count: overviewData?.guestPlays },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
                        Admin Dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                        Real-time overview of the Horizon Truth ecosystem.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" className="rounded-xl font-semibold border-2">
                        <Link to="/dashboard/reports">View Reports</Link>
                    </Button>
                    <Button asChild className="rounded-xl font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95">
                        <Link to="/dashboard/health">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            System Health
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cards.map((card) => (
                    <motion.div
                        key={card.title}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className={`absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20`}>
                            <card.icon className="h-16 w-16" />
                        </div>
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

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* User Composition Bar Chart */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]"
                >
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        User Composition
                    </h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Organization Types Pie Chart */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]"
                >
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-indigo-500" />
                        Organizations by Status
                    </h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orgDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {orgDist.map((_, index) => (
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

                {/* Feedback Distribution Radar/Pie - Let's use Pie for clarity */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]"
                >
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-orange-500" />
                        Feedback Summary
                    </h3>
                    <div className="flex-1 w-full text-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={feedbackDist}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {feedbackDist.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Section - Content Overview */}
            <motion.div
                variants={itemVariants}
                className="grid gap-6 md:grid-cols-3"
            >
                <div className="md:col-span-2 rounded-2xl border bg-gradient-to-br from-indigo-500 to-primary p-8 text-white shadow-xl shadow-primary/20">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-2xl font-bold">Content Growth</h3>
                            <p className="opacity-90 leading-relaxed font-medium">
                                Your platform content is growing steadily. You have {overviewData?.blogs} blog posts and {overviewData?.resources} resources published to date.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <Button asChild className="bg-white text-primary hover:bg-white/90 rounded-xl font-bold">
                                    <Link to="/admin/blogs">Manage Blog</Link>
                                </Button>
                                <Button asChild variant="outline" className="border-white/30 hover:bg-white/10 rounded-xl font-bold">
                                    <Link to="/admin/resources" className="text-primary">Manage Resources</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="hidden lg:flex gap-4">
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center w-32">
                                <div className="text-3xl font-black">{overviewData?.blogs}</div>
                                <div className="text-xs font-bold uppercase mt-1 opacity-80">Blogs</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center w-32">
                                <div className="text-3xl font-black">{overviewData?.resources}</div>
                                <div className="text-xs font-bold uppercase mt-1 opacity-80">Resources</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm border-l-4 border-l-rose-500">
                    <div className="flex items-center gap-3 mb-4">
                        <Mail className="h-5 w-5 text-rose-500" />
                        <h3 className="font-bold">Latest Inquiries</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                            <p className="text-sm font-medium">Total Contact Submissions</p>
                            <div className="text-2xl font-black mt-1">{overviewData?.contacts}</div>
                        </div>
                        <Button asChild variant="ghost" className="w-full justify-between rounded-xl hover:bg-rose-50 hover:text-rose-600 font-bold">
                            <Link to="/admin/contacts">
                                View Inquiry List
                                <TrendingUp className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
