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