import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { engineService, type Scenario } from "@/services/engine.service";
import { toast } from "sonner";
import { X, Lock } from "lucide-react";
import SceneEditor from "./SceneEditor";
import { useEffect, useState } from "react";

const scenarioSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    type: z.enum(["SOCIAL_POST", "NEWS_STORY", "CHAT_CONVERSATION"]),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    isActive: z.boolean(),
    learningObjective: z.string().optional(),
    behavioralRisk: z.string().optional(),
    psychologicalTrigger: z.string().optional(),
    preventionLesson: z.string().optional(),
    theme: z.string().optional(),
    minimumScore: z.number().min(0).max(100),
    totalScenes: z.number().min(1),
    unlockScenarioId: z.string().nullable().optional(),
    campaignTag: z.string().optional(),
    order: z.number().min(0).optional(),
    isArchived: z.boolean().optional(),
});

type ScenarioFormValues = z.infer<typeof scenarioSchema>;

interface ScenarioFormProps {
    scenario?: Scenario;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ScenarioForm({ scenario, onSuccess, onCancel }: ScenarioFormProps) {
    const [allScenarios, setAllScenarios] = useState<Scenario[]>([]);

    useEffect(() => {
        engineService.getScenarios({ limit: 100 } as any).then((res) => {
            const data = Array.isArray(res) ? res : (res.data || []);
            setAllScenarios(data);
        }).catch(() => { });
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<ScenarioFormValues>({
        resolver: zodResolver(scenarioSchema),
        defaultValues: {
            title: scenario?.title || "",
            description: scenario?.description || "",
            type: scenario?.type || "SOCIAL_POST",
            difficulty: scenario?.difficulty || "EASY",
            isActive: scenario?.isActive ?? true,
            minimumScore: scenario?.minimumScore ?? 70,
            totalScenes: scenario?.totalScenes ?? 1,
            unlockScenarioId: scenario?.unlockScenarioId || null,
            campaignTag: (scenario as any)?.campaignTag || "",
            order: (scenario as any)?.order ?? 0,
            isArchived: scenario?.isArchived ?? false,
        },
    });

    const selectedPrereq = watch("unlockScenarioId");
    // Filter out current scenario from prerequisite options
    const prereqOptions = allScenarios.filter(s => s.id !== scenario?.id);

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
        <div className="bg-card border rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider italic">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="minimumScore" className="text-[10px] font-black uppercase tracking-widest ml-1">Minimum Pass Score (%)</Label>
                        <div className="relative">
                            <Input
                                id="minimumScore"
                                type="number"
                                min={0}
                                max={100}
                                {...register("minimumScore", { valueAsNumber: true })}
                                className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary pr-10"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground ml-1">Player must reach this score percentage to pass and unlock the next scenario</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="totalScenes" className="text-[10px] font-black uppercase tracking-widest ml-1">Total Scenes</Label>
                        <Input
                            id="totalScenes"
                            type="number"
                            {...register("totalScenes", { valueAsNumber: true })}
                            className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                    </div>
                </div>

                {/* Prerequisite & Campaign */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                    <div className="space-y-2">
                        <Label htmlFor="unlockScenarioId" className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1.5">
                            <Lock size={10} /> Prerequisite Scenario
                        </Label>
                        <select
                            id="unlockScenarioId"
                            value={selectedPrereq || ""}
                            onChange={(e) => setValue("unlockScenarioId", e.target.value || null)}
                            className="w-full h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary px-3 text-sm appearance-none"
                        >
                            <option value="">None (Always Available)</option>
                            {prereqOptions.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.title} ({s.minimumScore}%)
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-muted-foreground ml-1">
                            Player must pass the prerequisite with its minimum accuracy rate (%) to unlock this scenario
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="campaignTag" className="text-[10px] font-black uppercase tracking-widest ml-1">Campaign Tag</Label>
                        <Input
                            id="campaignTag"
                            {...register("campaignTag")}
                            placeholder="e.g. MISINFORMATION_101"
                            className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                        <p className="text-[10px] text-muted-foreground ml-1">
                            Group scenarios into a campaign for themed progression
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="order" className="text-[10px] font-black uppercase tracking-widest ml-1">Display Order</Label>
                        <Input
                            id="order"
                            type="number"
                            {...register("order", { valueAsNumber: true })}
                            placeholder="e.g. 10"
                            className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                        <p className="text-[10px] text-muted-foreground ml-1">
                            Lower numbers appear first in the list
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-primary/5">
                    <div className="space-y-2">
                        <Label htmlFor="learningObjective" className="text-[10px] font-black uppercase tracking-widest ml-1">Learning Objective</Label>
                        <Input
                            id="learningObjective"
                            {...register("learningObjective")}
                            placeholder="e.g. Critical Thinking"
                            className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="behavioralRisk" className="text-[10px] font-black uppercase tracking-widest ml-1">Behavioral Risk</Label>
                        <Input
                            id="behavioralRisk"
                            {...register("behavioralRisk")}
                            placeholder="e.g. Social Engineering"
                            className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="psychologicalTrigger" className="text-[10px] font-black uppercase tracking-widest ml-1">Psychological Trigger</Label>
                        <Input
                            id="psychologicalTrigger"
                            {...register("psychologicalTrigger")}
                            placeholder="e.g. Fear of Missing Out"
                            className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="preventionLesson" className="text-[10px] font-black uppercase tracking-widest ml-1">Prevention Lesson</Label>
                        <Input
                            id="preventionLesson"
                            {...register("preventionLesson")}
                            placeholder="e.g. Verify before sharing"
                            className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="theme" className="text-[10px] font-black uppercase tracking-widest ml-1">Broad Theme</Label>
                        <Input
                            id="theme"
                            {...register("theme")}
                            placeholder="e.g. Health, Financial Fraud, etc."
                            className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-b border-primary/5 pb-8">
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:flex-1 rounded-xl h-12 font-bold">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:flex-1 rounded-xl h-12 font-bold gap-2">
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
