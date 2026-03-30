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
import { useAuthStore } from "@/store/auth.store";
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
import { useDevice } from "@/shared/hooks/useDevice";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function DashboardPage() {
    const { isLowEndDevice, prefersReducedMotion } = useDevice();
    const { data: stats, isLoading, isError } = useAnalyticsStats();
    const { user } = useAuthStore();

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
    const isSystemAdmin = user?.role === 'SYSTEM_ADMIN';
    const isOrgAdmin = user?.role === 'ORG_ADMIN';

    const cards = [
        { title: "Total Users", value: overviewData?.users, icon: Users, color: "text-blue-500", bg: "bg-blue-50/50" },
        { title: "Organizations", value: overviewData?.organizations, icon: Building2, color: "text-indigo-500", bg: "bg-indigo-50/50" },
        { title: "Players", value: overviewData?.players, icon: Gamepad2, color: "text-purple-500", bg: "bg-purple-50/50" },
    ];

    if (isSystemAdmin) {
        cards.push(
            { title: "Guest Plays", value: overviewData?.guestPlays, icon: PlayCircle, color: "text-pink-500", bg: "bg-pink-50/50" },
            { title: "Scenarios", value: overviewData?.scenarios, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50/50" },
            { title: "Feedback", value: overviewData?.feedback, icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-50/50" },
            { title: "Reports", value: overviewData?.reports, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50/50" },
            { title: "Blog Posts", value: overviewData?.blogs, icon: FileText, color: "text-cyan-500", bg: "bg-cyan-50/50" },
            { title: "Resources", value: overviewData?.resources, icon: BookOpen, color: "text-teal-500", bg: "bg-teal-50/50" },
            { title: "Contact reports", value: overviewData?.contacts, icon: Mail, color: "text-rose-500", bg: "bg-rose-50/50" },
        );
    } else if (isOrgAdmin) {
        cards.push(
            { title: "Scenarios", value: overviewData?.scenarios, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50/50" },
        );
    }

    const orgDist = Object.entries(stats?.distributions.organizations || {}).map(([name, value]) => ({ name, value }));
    const feedbackDist = Object.entries(stats?.distributions.feedback || {}).map(([name, value]) => ({ name, value }));

    const barData = [
        { name: 'Users', count: overviewData?.users },
        { name: 'Players', count: overviewData?.players },
    ];

    if (isSystemAdmin) {
        barData.push({ name: 'Guests', count: overviewData?.guestPlays });
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: isLowEndDevice ? 0 : 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: isLowEndDevice ? 0 : 20, opacity: 0 },
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
                {isSystemAdmin && (
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
                )}
            </div>

            {/* Stat Cards Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">