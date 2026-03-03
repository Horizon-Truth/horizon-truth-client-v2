import { useEffect, useState } from "react";
import { feedbackService, type FeedbackStats, type Feedback } from "@/services/feedback.service";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    MessageSquare,
    BarChart3,
    AlertTriangle,
    ArrowRight,
    Search
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

export default function FeedbackDashboardPage() {
    const [stats, setStats] = useState<FeedbackStats | null>(null);
    const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState({
        status: "",
        priority: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, listRes] = await Promise.all([
                feedbackService.getStats(),
                feedbackService.getFeedbacks({ limit: 5, ...filter })
            ]);
            setStats(statsRes);
            setRecentFeedback(listRes.data || []);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            toast.error("Failed to load feedback dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    const statsCards = [
        {
            title: "Total Open",
            value: stats?.totalOpen || 0,
            icon: MessageSquare,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            description: "Awaiting resolution"
        },
        {
            title: "High Priority",
            value: stats?.byPriority.HIGH || 0,
            icon: AlertTriangle,
            color: "text-red-500",
            bg: "bg-red-500/10",
            description: "Critical action required"
        },
        {
            title: "Overdue Items",
            value: stats?.overdueItems || 0,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            description: "Past deadline"
        },
        {
            title: "Performance",
            value: "92%",
            icon: BarChart3,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            description: "Resolution rate"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase tracking-wider">Feedback Dashboard</h2>
                    <p className="text-sm text-muted-foreground mt-1">Track, measure, and resolve internal and player feedback.</p>