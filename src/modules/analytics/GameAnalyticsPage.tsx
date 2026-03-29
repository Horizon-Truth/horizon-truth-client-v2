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