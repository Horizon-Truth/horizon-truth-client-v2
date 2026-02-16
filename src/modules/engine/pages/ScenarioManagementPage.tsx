import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Play, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { engineService, type Scenario } from "@/services/engine.service";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

export default function ScenarioManagementPage() {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchScenarios = async () => {
        setIsLoading(true);
        try {
            const response = await engineService.getScenarios();
            // The backend returns { data: Scenario[], meta: ... }
            setScenarios(response.data || []);
        } catch (error) {
            console.error("Failed to fetch scenarios:", error);
            toast.error("Failed to load scenarios");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScenarios();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this scenario? This will remove all associated scenes.")) return;

        try {
            await engineService.deleteScenario(id);
            toast.success("Scenario deleted successfully");
            fetchScenarios();
        } catch (error) {
            toast.error("Failed to delete scenario");
        }
    };

    const toggleStatus = async (scenario: Scenario) => {
        try {
            await engineService.updateScenario(scenario.id, { isActive: !scenario.isActive });
            toast.success(`Scenario ${!scenario.isActive ? 'activated' : 'deactivated'} successfully`);
            fetchScenarios();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight italic uppercase tracking-wider">Scenario Engine</h2>
                    <p className="text-muted-foreground mt-1">Design and manage truth-verification missions for players.</p>
                </div>
                <Button className="rounded-2xl h-12 px-6 font-bold gap-2">
                    <Plus size={20} />
                    Create New Scenario
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : scenarios.length === 0 ? (
                    <div className="bg-card border border-dashed rounded-[2rem] py-20 text-center flex flex-col items-center gap-4">
                        <div className="p-6 rounded-full bg-muted/50">
                            <Plus size={40} className="text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold">No scenarios found</h3>
                            <p className="text-muted-foreground">Start by creating your first truth-verification mission.</p>
                        </div>
                        <Button variant="outline" className="rounded-xl font-bold">Initialize First Protocol</Button>
                    </div>
                ) : (
                    scenarios.map((scenario) => (
                        <div key={scenario.id} className="group bg-card border border-border/50 rounded-[2rem] p-6 hover:border-primary/50 transition-all hover:bg-accent/5 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center bg-muted transition-colors group-hover:bg-primary/10",
                                    scenario.isActive ? "text-primary" : "text-muted-foreground"
                                )}>
                                    <Play size={24} className={scenario.isActive ? "fill-primary" : ""} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors">{scenario.title}</h3>
                                        <Badge variant={scenario.isActive ? "default" : "secondary"} className="rounded-lg font-black tracking-[0.1em] text-[10px] uppercase">
                                            {scenario.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">{scenario.description}</p>
                                    <div className="flex items-center gap-4 pt-1">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 bg-muted/30 px-2.5 py-1 rounded-md">
                                            <Info size={12} />
                                            {scenario.scenarioType}
                                        </div>
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md",
                                            scenario.difficulty === 'EASY' ? "bg-emerald-500/10 text-emerald-500" :
                                                scenario.difficulty === 'MEDIUM' ? "bg-amber-500/10 text-amber-500" :
                                                    "bg-red-500/10 text-red-500"
                                        )}>
                                            {scenario.difficulty}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
                                    onClick={() => toggleStatus(scenario)}
                                >
                                    {scenario.isActive ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary">
                                    <Edit2 size={18} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => handleDelete(scenario.id)}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
