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