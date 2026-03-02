import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";

import { Label } from "@/shared/components/ui/label";
import { feedbackService } from "@/services/feedback.service";
import { toast } from "sonner";
import { X, MessageSquarePlus } from "lucide-react";

// Minimal feedback form for players – only comment text is required.
const feedbackSchema = z.object({
    commentText: z.string().min(5, "Comment must be at least 5 characters"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface PlayerFeedbackModalProps {
    scenarioId?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function PlayerFeedbackModal({ scenarioId, onSuccess, onCancel }: PlayerFeedbackModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            commentText: "",