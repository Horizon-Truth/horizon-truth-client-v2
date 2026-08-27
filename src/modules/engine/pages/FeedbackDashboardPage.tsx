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
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                                    <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 font-medium">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem]">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-8 pt-8">
                        <CardTitle className="text-lg sm:text-xl font-black uppercase tracking-wider italic">Recent Feedback Activity</CardTitle>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <select
                                className="w-full sm:w-auto bg-muted/50 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-widest"
                                value={filter.status}
                                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : recentFeedback.length === 0 ? (
                            <div className="text-center py-20 bg-muted/20 rounded-[2rem] border border-dashed">
                                <p className="text-muted-foreground">No recent feedback matches your filters.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentFeedback.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                                        <div className="flex items-start gap-4 w-full">
                                            <div className={cn(
                                                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0",
                                                item.priority === 'HIGH' ? "bg-red-500/10 text-red-500" :
                                                    item.priority === 'MEDIUM' ? "bg-amber-500/10 text-amber-500" :
                                                        "bg-emerald-500/10 text-emerald-500"
                                            )}>
                                                <AlertCircle size={20} className="sm:size-24" />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                                    <h4 className="font-bold flex flex-wrap items-center gap-2">
                                                        <span className="truncate max-w-[150px] sm:max-w-none">{item.scenario?.title || item.commentSource}</span>
                                                        <Badge variant="outline" className="text-[10px] font-black uppercase rounded-md border-primary/20">
                                                            {item.type}
                                                        </Badge>
                                                    </h4>
                                                    <span className="text-[10px] sm:text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full sm:w-auto space-y-2 mt-1 sm:mt-0">
                                            <p className="text-sm line-clamp-2">{item.commentText}</p>
                                            <div className="flex items-center justify-between sm:justify-start gap-4 mt-2">
                                                <Badge className={cn(
                                                    "rounded-md text-[10px] font-black uppercase",
                                                    item.status === 'RESOLVED' ? "bg-emerald-500" :
                                                        item.status === 'IN_PROGRESS' ? "bg-amber-500" :
                                                            "bg-blue-500"
                                                )}>
                                                    {item.status}
                                                </Badge>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    By {item.user?.fullName}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            {item.status !== 'RESOLVED' && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    disabled={isLoading}
                                                    onClick={async () => {
                                                        try {
                                                            await feedbackService.updateFeedback(item.id, { status: 'RESOLVED' });
                                                            toast.success("Feedback marked as resolved");
                                                            fetchData();
                                                        } catch (err) {
                                                            toast.error("Failed to update feedback");
                                                        }
                                                    }}
                                                    className="rounded-xl px-4 h-9 font-bold text-[10px] uppercase border-emerald-500/30 text-emerald-600 hover:bg-emerald-50"
                                                >
                                                    Resolve
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="rounded-xl group-hover:translate-x-1 transition-transform">
                                                <ArrowRight size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full rounded-2xl h-12 font-bold border-dashed mt-4">
                                    View All Feedback
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-none shadow-sm rounded-[2rem] bg-primary text-primary-foreground overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black uppercase tracking-wider italic">Quality Check</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            <p className="text-sm text-primary-foreground/80 font-medium">
                                Maintain quality standards by ensuring all high-priority feedback is resolved before scenario deployment.
                            </p>
                            <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Success Rate</p>
                                    <h4 className="text-2xl font-black">88%</h4>
                                </div>
                                <CheckCircle2 size={32} className="opacity-40" />
                            </div>
                            <Button variant="secondary" className="w-full rounded-xl font-black uppercase tracking-widest h-12">
                                Run Quality Check
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-[2rem]">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black uppercase tracking-wider italic">Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Priority</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setFilter(prev => ({ ...prev, priority: prev.priority === p ? "" : p }))}
                                            className={cn(
                                                "py-2 rounded-xl text-[10px] font-black transition-all border",
                                                filter.priority === p
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search feedback..."
                                        className="w-full h-11 bg-muted/50 border-none rounded-xl pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
