import { useEffect, useState } from "react";
import { feedbackService, type Feedback } from "@/services/feedback.service";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { Calendar, User, Clock, MessageSquare, Filter } from "lucide-react";
import { toast } from "sonner";

interface ScenarioFeedbackListProps {
    scenarioId: string;
}

export default function ScenarioFeedbackList({ scenarioId }: ScenarioFeedbackListProps) {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
            const response = await feedbackService.getFeedbacks({ scenarioId, status: statusFilter || undefined });
            setFeedbacks(response.data || []);
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error);
            toast.error("Failed to load feedbacks");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [scenarioId, statusFilter]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await feedbackService.updateFeedback(id, { status: status as any });
            toast.success("Feedback status updated");
            fetchFeedbacks();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'text-red-500 bg-red-500/10';
            case 'MEDIUM': return 'text-amber-500 bg-amber-500/10';
            case 'LOW': return 'text-emerald-500 bg-emerald-500/10';
            default: return 'text-muted-foreground bg-muted';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" />
                    Internal Feedback ({feedbacks.length})
                </h4>
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-muted-foreground" />
                    <select
                        className="bg-transparent text-xs font-bold uppercase tracking-widest focus:outline-none"
                        value={statusFilter || ""}
                        onChange={(e) => setStatusFilter(e.target.value || null)}
                    >
                        <option value="">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed border-border/50">
                        <p className="text-sm text-muted-foreground">No circular feedback found for this scenario.</p>
                    </div>
                ) : (
                    feedbacks.map((item) => (
                        <div key={item.id} className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-all space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn("rounded-md text-[10px] font-black px-1.5 py-0", getPriorityColor(item.priority))}>
                                            {item.priority}
                                        </Badge>
                                        <span className="text-xs font-bold text-muted-foreground">{item.commentSource}</span>
                                    </div>
                                    <p className="text-sm font-medium">{item.commentText}</p>
                                </div>
                                <select
                                    className={cn(
                                        "text-[10px] font-black px-2 py-1 rounded-lg border-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer",
                                        item.status === 'RESOLVED' ? "bg-emerald-500 text-white" :
                                            item.status === 'IN_PROGRESS' ? "bg-amber-500 text-white" :
                                                "bg-muted text-muted-foreground"
                                    )}
                                    value={item.status}
                                    onChange={(e) => updateStatus(item.id, e.target.value)}
                                >
                                    <option value="OPEN">OPEN</option>
                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                </select>
                            </div>

                            {item.requiredAction && (
                                <div className="bg-muted/30 p-2.5 rounded-xl border border-border/50">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Required Action</p>
                                    <p className="text-xs italic text-muted-foreground">"{item.requiredAction}"</p>
                                </div>
                            )}

                            <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium pt-1 border-t border-border/50">
                                <div className="flex items-center gap-1">
                                    <User size={12} />
                                    {item.user?.fullName || "System Admin"}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                                {item.deadline && (
                                    <div className={cn("flex items-center gap-1", new Date(item.deadline) < new Date() ? "text-red-500" : "")}>
                                        <Clock size={12} />
                                        Due: {new Date(item.deadline).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
