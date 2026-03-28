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