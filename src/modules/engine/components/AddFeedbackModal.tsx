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
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddFeedbackModal({ scenarioId, onSuccess, onCancel }: AddFeedbackModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            commentSource: "Internal Team",
            commentText: "",
            requiredAction: "",
            priority: "MEDIUM",
            status: "OPEN",
        },
    });

    const onSubmit = async (data: FeedbackFormValues) => {
        try {
            await feedbackService.createFeedback({
                ...data,
                scenarioId,
                type: scenarioId ? "SCENARIO" : "OPERATION",
                deadline: data.deadline || undefined,
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
                    <h3 className="text-2xl font-black uppercase tracking-wider italic">
                        Add Feedback
                    </h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
                    <X size={20} />
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="commentSource" className="text-[10px] font-black uppercase tracking-widest ml-1">Comment Source</Label>
                    <Input
                        id="commentSource"
                        {...register("commentSource")}
                        placeholder="e.g. Reviewer / Team / Brand Consistency"
                        className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    {errors.commentSource && <p className="text-xs text-destructive font-medium ml-1">{errors.commentSource.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="commentText" className="text-[10px] font-black uppercase tracking-widest ml-1">Comment</Label>
                    <textarea
                        id="commentText"
                        {...register("commentText")}
                        rows={3}
                        className="w-full rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary p-4 text-sm resize-none"
                        placeholder="Provide detailed feedback..."
                    />
                    {errors.commentText && <p className="text-xs text-destructive font-medium ml-1">{errors.commentText.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="requiredAction" className="text-[10px] font-black uppercase tracking-widest ml-1">Required Action</Label>
                    <Input
                        id="requiredAction"
                        {...register("requiredAction")}
                        placeholder="e.g. Edit the scene content"
                        className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="priority" className="text-[10px] font-black uppercase tracking-widest ml-1">Priority</Label>
                        <select
                            id="priority"
                            {...register("priority")}
                            className="w-full h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary px-3 text-sm appearance-none"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest ml-1">Status</Label>
                        <select
                            id="status"
                            {...register("status")}
                            className="w-full h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary px-3 text-sm appearance-none"
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-[10px] font-black uppercase tracking-widest ml-1">Deadline</Label>
                    <Input
                        id="deadline"
                        type="date"
                        {...register("deadline")}
                        className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
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
