import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { feedbackService } from "@/services/feedback.service";
import { toast } from "sonner";
import { X, MessageSquarePlus } from "lucide-react";

const feedbackSchema = z.object({
    commentSource: z.string().min(2, "Source is required"),
    commentText: z.string().min(5, "Comment must be at least 5 characters"),
    requiredAction: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
    deadline: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface AddFeedbackModalProps {
    scenarioId?: string;
    isGuest?: boolean;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddFeedbackModal({ scenarioId, isGuest, onSuccess, onCancel }: AddFeedbackModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FeedbackFormValues>({