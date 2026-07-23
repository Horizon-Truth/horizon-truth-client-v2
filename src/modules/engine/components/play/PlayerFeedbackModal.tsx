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
        },
    });

    const onSubmit = async (data: FeedbackFormValues) => {
        try {
            await feedbackService.createFeedback({
                commentSource: "Player",
                commentText: data.commentText,
                priority: "MEDIUM",
                status: "OPEN",
                type: scenarioId ? "SCENARIO" : "OPERATION",
                scenarioId,
            });
            toast.success("Feedback submitted successfully");
            onSuccess();
        } catch (error) {
            console.error("Feedback submission error:", error);
            toast.error("Failed to submit feedback");
        }
    };

    return (
        <div className="bg-card border rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 w-full max-w-lg">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <MessageSquarePlus size={24} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-wider italic">Add Feedback</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
                    <X size={20} />
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="commentText" className="text-[10px] font-black uppercase tracking-widest ml-1">
                        Comment
                    </Label>
                    <textarea
                        id="commentText"
                        {...register("commentText")}
                        rows={3}
                        className="w-full rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary p-4 text-sm resize-none"
                        placeholder="Provide detailed feedback..."
                    />
                    {errors.commentText && (
                        <p className="text-xs text-destructive font-medium ml-1">{errors.commentText.message}</p>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1 rounded-xl h-12 font-bold">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl h-12 font-bold gap-2">
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                        ) : null}
                        Submit Feedback
                    </Button>
                </div>
            </form>
        </div>
    );
}
