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
