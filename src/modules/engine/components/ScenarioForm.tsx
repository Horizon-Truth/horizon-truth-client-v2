import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { engineService, type Scenario } from "@/services/engine.service";
import { toast } from "sonner";
import { X } from "lucide-react";
import SceneEditor from "./SceneEditor";

const scenarioSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    type: z.enum(["SOCIAL_POST", "NEWS_STORY", "CHAT_CONVERSATION"]),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    isActive: z.boolean(),
});

type ScenarioFormValues = z.infer<typeof scenarioSchema>;

interface ScenarioFormProps {
    scenario?: Scenario;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ScenarioForm({ scenario, onSuccess, onCancel }: ScenarioFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ScenarioFormValues>({
        resolver: zodResolver(scenarioSchema),
        defaultValues: scenario || {
            title: "",
            description: "",
            type: "SOCIAL_POST",
            difficulty: "EASY",
            isActive: true,
        },
    });

    const onSubmit = async (data: ScenarioFormValues) => {
        try {
            if (scenario) {
                await engineService.updateScenario(scenario.id, data);
                toast.success("Scenario updated successfully");
            } else {
                await engineService.createScenario(data);
                toast.success("Scenario created successfully");
            }
            onSuccess();
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("Failed to save scenario");
        }
    };

    return (
        <div className="bg-card border rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black uppercase tracking-wider italic">
                    {scenario ? "Edit Scenario" : "New Scenario Protocol"}
                </h3>
                <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
                    <X size={20} />
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest ml-1">Title</Label>
                    <Input
                        id="title"
                        {...register("title")}
                        placeholder="e.g. The Deepfake Dilemma"
                        className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    {errors.title && <p className="text-xs text-destructive font-medium ml-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest ml-1">Description</Label>
                    <textarea
                        id="description"
                        {...register("description")}
                        rows={3}
                        className="w-full rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary p-4 text-sm resize-none"
                        placeholder="Describe the mission objectives and context..."
                    />
                    {errors.description && <p className="text-xs text-destructive font-medium ml-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest ml-1">Type</Label>
                        <select
                            id="type"
                            {...register("type")}
                            className="w-full h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary px-3 text-sm appearance-none"
                        >
                            <option value="SOCIAL_POST">Social Post</option>
                            <option value="NEWS_STORY">News Story</option>
                            <option value="CHAT_CONVERSATION">Chat Conversation</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="difficulty" className="text-[10px] font-black uppercase tracking-widest ml-1">Difficulty</Label>
                        <select
                            id="difficulty"
                            {...register("difficulty")}
                            className="w-full h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary px-3 text-sm appearance-none"
                        >
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-4">
                    <input
                        type="checkbox"
                        id="isActive"
                        {...register("isActive")}
                        className="w-4 h-4 rounded-md border-primary text-primary focus:ring-primary"
                    />
                    <Label htmlFor="isActive" className="text-sm font-bold">Publish Scenario Immediately</Label>
                </div>

                <div className="flex gap-3 pt-4 border-b border-primary/5 pb-8">
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1 rounded-xl h-12 font-bold">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl h-12 font-bold gap-2">
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                        ) : null}
                        {scenario ? "Update Protocol" : "Initialize Protocol"}
                    </Button>
                </div>
            </form>

            {scenario && <SceneEditor scenarioId={scenario.id} />}
        </div>
    );
}
