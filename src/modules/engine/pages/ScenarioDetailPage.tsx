import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { engineService, type Scenario } from "@/services/engine.service";
import { Badge } from "@/shared/components/ui/badge";
import SceneEditor from "../components/SceneEditor";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

export default function ScenarioDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchScenario = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await engineService.getScenarioById(id);
            setScenario(data);
        } catch (error) {
            console.error("Failed to fetch scenario:", error);
            toast.error("Failed to load scenario details");
            navigate("/dashboard/engine");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScenario();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!scenario) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard/engine")}
                    className="gap-2 rounded-xl hover:bg-primary/5 font-bold"
                >
                    <ArrowLeft size={18} />
                    Back to Scenarios
                </Button>
            </div>

            <div className="bg-card border border-border/50 rounded-[2.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Play size={120} className={scenario.isActive ? "fill-primary text-primary" : "text-muted-foreground"} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className={cn(
                        "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex-shrink-0 flex items-center justify-center bg-muted transition-colors",
                        scenario.isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                    )}>
                        <Play size={40} className={cn(scenario.isActive ? "fill-primary" : "")} />
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-4">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight italic uppercase tracking-wider">{scenario.title}</h2>
                            <Badge variant={scenario.isActive ? "default" : "secondary"} className="rounded-xl font-black tracking-[0.1em] text-[12px] uppercase px-4 py-1">
                                {scenario.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                            {scenario.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl border border-border/50">
                                <Info size={14} />
                                Protocol: {scenario.scenarioType}
                            </div>
                            <div className={cn(
                                "flex items-center gap-2 text-[12px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border",
                                scenario.difficulty === 'EASY' ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" :
                                    scenario.difficulty === 'MEDIUM' ? "bg-amber-500/5 text-amber-500 border-amber-500/20" :
                                        "bg-red-500/5 text-red-500 border-red-500/20"
                            )}>
                                Difficulty: {scenario.difficulty}
                            </div>
                            {scenario.theme && (
                                <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/20">
                                    Theme: {scenario.theme}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 mt-10 border-t border-border/50">
                    {scenario.learningObjective && (
                        <div className="p-5 rounded-3xl bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Learning Objective</h4>
                            <p className="text-sm font-bold leading-snug">{scenario.learningObjective}</p>
                        </div>
                    )}
                    {scenario.behavioralRisk && (
                        <div className="p-5 rounded-3xl bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Behavioral Risk</h4>
                            <p className="text-sm font-bold leading-snug">{scenario.behavioralRisk}</p>
                        </div>
                    )}
                    {scenario.psychologicalTrigger && (
                        <div className="p-5 rounded-3xl bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Psychological Trigger</h4>
                            <p className="text-sm font-bold leading-snug">{scenario.psychologicalTrigger}</p>
                        </div>
                    )}
                    {scenario.preventionLesson && (
                        <div className="p-5 rounded-3xl bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Prevention Lesson</h4>
                            <p className="text-sm font-bold leading-snug">{scenario.preventionLesson}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
                <SceneEditor scenarioId={scenario.id} />
            </div>
        </div>
    );
}
