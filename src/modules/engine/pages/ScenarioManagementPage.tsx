import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Play, Info, MessageSquare, Eye, Download, Upload, CheckSquare, Square, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { engineService, type Scenario } from "@/services/engine.service";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import ScenarioForm from "../components/ScenarioForm";
import ScenarioFeedbackList from "../components/ScenarioFeedbackList";

export default function ScenarioManagementPage() {
    const navigate = useNavigate();
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFeedbackListOpen, setIsFeedbackListOpen] = useState(false);
    const [editingScenario, setEditingScenario] = useState<Scenario | undefined>(undefined);
    const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isImporting, setIsImporting] = useState(false);

    const fetchScenarios = async () => {
        setIsLoading(true);
        try {
            const response = await engineService.getAdminScenarios({ 
                isArchived: activeTab === 'archived',
                limit: 100 
            } as any);
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
    }, [activeTab]);

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

    const toggleArchive = async (scenario: Scenario) => {
        try {
            const newArchivedStatus = !scenario.isArchived;
            await engineService.updateScenario(scenario.id, { isArchived: newArchivedStatus });
            toast.success(`Scenario ${newArchivedStatus ? 'archived' : 'restored'} successfully`);
            fetchScenarios();
        } catch (error) {
            toast.error("Failed to update archive status");
        }
    };

    const handleExport = async () => {
        if (selectedIds.length === 0) {
            toast.error("Please select at least one scenario to export");
            return;
        }

        try {
            const data = await engineService.exportScenarios(selectedIds);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `scenarios-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success(`${selectedIds.length} scenarios exported successfully`);
        } catch (error) {
            toast.error("Failed to export scenarios");
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);
                const result = await engineService.importScenarios(data);
                toast.success(`Import complete: ${result.imported} imported, ${result.skipped} skipped/duplicates`);
                fetchScenarios();
            } catch (error) {
                toast.error("Failed to import scenarios. Ensure the file is a valid JSON export.");
            } finally {
                setIsImporting(false);
                event.target.value = ''; // Reset input
            }
        };
        reader.readAsText(file);
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === scenarios.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(scenarios.map(s => s.id));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative min-h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-3xl font-black tracking-tight italic uppercase tracking-wider">Scenario Engine</h2>
                    <p className="text-sm text-muted-foreground mt-1">Design and manage truth-verification missions for players.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex p-1 bg-muted/50 rounded-2xl border border-border/50">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={cn(
                                "px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === 'active' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab('archived')}
                            className={cn(
                                "px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === 'archived' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Archived
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {}}
                            className="relative rounded-xl border-dashed hover:border-primary transition-colors"
                            title="Import Scenarios"
                            disabled={isImporting}
                        >
                            <label className="flex items-center justify-center w-full h-full cursor-pointer">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    className="hidden"
                                />
                                {isImporting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                            </label>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleExport}
                            className={cn(
                                "rounded-xl border-dashed transition-colors",
                                selectedIds.length > 0 ? "border-primary text-primary bg-primary/5" : "hover:border-primary"
                            )}
                            title="Export Selected"
                        >
                            <Download size={18} />
                            {selectedIds.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[8px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-background">
                                    {selectedIds.length}
                                </span>
                            )}
                        </Button>
                    </div>

                    <Button
                        onClick={() => { setEditingScenario(undefined); setIsFormOpen(true); }}
                        className="flex-1 sm:flex-none rounded-2xl h-10 sm:h-12 px-4 sm:px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-xs sm:text-sm"
                    >
                        <Plus size={20} />
                        <span className="hidden xs:inline">Create New</span>
                        <span className="xs:hidden">New</span>
                    </Button>
                </div>
            </div>

            {scenarios.length > 0 && (
                <div className="flex items-center gap-2 px-2">
                    <button
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                    >
                        {selectedIds.length === scenarios.length ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />}
                        {selectedIds.length === 0 ? 'Select All' : `Selected ${selectedIds.length}`}
                    </button>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setSelectedIds([])}
                            className="text-[10px] font-black uppercase tracking-widest text-destructive hover:underline ml-2"
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
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
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold"
                            onClick={() => { setEditingScenario(undefined); setIsFormOpen(true); }}
                        >
                            Initialize First Protocol
                        </Button>
                    </div>
                ) : (
                    scenarios.map((scenario) => (
                        <div key={scenario.id} className="group bg-card border border-border/50 rounded-[2rem] p-4 sm:p-6 hover:border-primary/50 transition-all hover:bg-accent/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                            <div className="flex items-start sm:items-center gap-4 sm:gap-6 w-full">
                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => toggleSelection(scenario.id)}
                                        className={cn(
                                            "transition-colors",
                                            selectedIds.includes(scenario.id) ? "text-primary" : "text-muted-foreground/30 hover:text-muted-foreground"
                                        )}
                                    >
                                        {selectedIds.includes(scenario.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </button>
                                    <div className={cn(
                                        "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0 flex items-center justify-center bg-muted transition-colors group-hover:bg-primary/10",
                                        scenario.isActive ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        <Play size={20} className={cn("sm:w-6 sm:h-6", scenario.isActive ? "fill-primary" : "")} />
                                    </div>
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors truncate">
                                            <span className="text-primary/40 mr-2 text-sm">#{scenario.order}</span>
                                            {scenario.title}
                                        </h3>
                                        <Badge variant={scenario.isActive ? "default" : "secondary"} className="rounded-lg font-black tracking-[0.1em] text-[10px] uppercase">
                                            {scenario.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1 max-w-xl">{scenario.description}</p>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1">
                                        <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 bg-muted/30 px-2 sm:px-2.5 py-1 rounded-md">
                                            <Info size={10} className="sm:w-3 sm:h-3" />
                                            {scenario.scenarioType}
                                        </div>
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-1 rounded-md",
                                            scenario.difficulty === 'EASY' ? "bg-emerald-500/10 text-emerald-500" :
                                                scenario.difficulty === 'MEDIUM' ? "bg-amber-500/10 text-amber-500" :
                                                    "bg-red-500/10 text-red-500"
                                        )}>
                                            {scenario.difficulty}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
                                    onClick={() => toggleStatus(scenario)}
                                    title={scenario.isActive ? "Deactivate" : "Activate"}
                                >
                                    {scenario.isActive ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl hover:bg-amber-500/10 hover:text-amber-500"
                                    onClick={() => toggleArchive(scenario)}
                                    title={scenario.isArchived ? "Restore" : "Archive"}
                                >
                                    {scenario.isArchived ? <Plus size={18} className="rotate-45" /> : <Trash2 size={18} className="text-muted-foreground" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl hover:bg-primary/10 hover:text-primary"
                                    onClick={() => navigate(`/dashboard/engine/${scenario.id}`)}
                                    title="View Detail"
                                >
                                    <Eye size={18} />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl hover:bg-primary/10 hover:text-primary"
                                    onClick={() => { setActiveScenarioId(scenario.id); setIsFeedbackListOpen(true); }}
                                    title="View Feedback"
                                >
                                    <MessageSquare size={18} />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl hover:bg-primary/10 hover:text-primary"
                                    onClick={() => { setEditingScenario(scenario); setIsFormOpen(true); }}
                                >
                                    <Edit2 size={18} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => handleDelete(scenario.id)}
                                    title="Delete Permanently"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Feedback List Overlay */}
            {isFeedbackListOpen && activeScenarioId && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsFeedbackListOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-card border rounded-[2rem] p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black uppercase tracking-wider italic">Scenario Feedback</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsFeedbackListOpen(false)} className="rounded-full">
                                <XCircle size={24} />
                            </Button>
                        </div>
                        <ScenarioFeedbackList scenarioId={activeScenarioId} />
                    </div>
                </div>
            )}



            {/* Form Overlay */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsFormOpen(false)}
                    />
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
                        <ScenarioForm
                            scenario={editingScenario}
                            onSuccess={() => {
                                setIsFormOpen(false);
                                fetchScenarios();
                            }}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
