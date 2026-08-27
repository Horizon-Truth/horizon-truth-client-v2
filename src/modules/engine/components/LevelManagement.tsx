import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Info, Trophy, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { engineService } from "@/services/engine.service";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

interface GameLevel {
    id: string;
    levelNumber: number;
    name: string;
    description: string;
    estimatedDurationMinutes: number;
    isActive: boolean;
}

interface LevelManagementProps {
    onClose: () => void;
}

export default function LevelManagement({ onClose }: LevelManagementProps) {
    const [levels, setLevels] = useState<GameLevel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLevel, setEditingLevel] = useState<GameLevel | null>(null);

    const [formData, setFormData] = useState({
        levelNumber: 1,
        name: "",
        description: "",
        estimatedDurationMinutes: 15,
        isActive: true
    });

    const fetchLevels = async () => {
        setIsLoading(true);
        try {
            const data = await engineService.getLevels();
            setLevels(data || []);
        } catch (error) {
            toast.error("Failed to load levels");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, []);

    const handleEdit = (level: GameLevel) => {
        setEditingLevel(level);
        setFormData({
            levelNumber: level.levelNumber,
            name: level.name,
            description: level.description || "",
            estimatedDurationMinutes: level.estimatedDurationMinutes || 15,
            isActive: level.isActive
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this level? It must not have any associated scenarios.")) return;
        try {
            await engineService.deleteLevel(id);
            toast.success("Level deleted successfully");
            fetchLevels();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete level");
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingLevel) {
                await engineService.updateLevel(editingLevel.id, formData);
                toast.success("Level updated successfully");
            } else {
                await engineService.createLevel(formData);
                toast.success("Level created successfully");
            }
            setIsFormOpen(false);
            setEditingLevel(null);
            fetchLevels();
        } catch (error) {
            toast.error("Failed to save level");
        }
    };

    return (
        <div className="bg-card border rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-wider italic">Game Level Architecture</h3>
                    <p className="text-sm text-muted-foreground mt-1">Define the progression structure for mission levels.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        onClick={() => { setEditingLevel(null); setFormData({ levelNumber: levels.length + 1, name: "", description: "", estimatedDurationMinutes: 15, isActive: true }); setIsFormOpen(true); }}
                        className="rounded-xl h-10 font-bold gap-2"
                    >
                        <Plus size={18} />
                        Add Level
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X size={24} />
                    </Button>
                </div>
            </div>

            {isFormOpen && (
                <div className="mb-8 p-6 bg-muted/30 rounded-2xl border border-primary/10 animate-in fade-in duration-300">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Level Number</Label>
                                <Input 
                                    type="number"
                                    value={formData.levelNumber}
                                    onChange={e => setFormData({...formData, levelNumber: parseInt(e.target.value)})}
                                    className="rounded-xl h-11"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Level Name</Label>
                                <Input 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Media Literacy Fundamentals"
                                    className="rounded-xl h-11"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Description</Label>
                            <textarea 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full rounded-2xl bg-background border p-4 text-sm resize-none focus:ring-1 focus:ring-primary outline-none"
                                rows={2}
                                placeholder="What will players learn in this level?"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Est. Duration (Min)</Label>
                                <Input 
                                    type="number"
                                    value={formData.estimatedDurationMinutes}
                                    onChange={e => setFormData({...formData, estimatedDurationMinutes: parseInt(e.target.value)})}
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <input 
                                    type="checkbox"
                                    id="levelActive"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                    className="w-4 h-4 rounded-md border-primary text-primary"
                                />
                                <Label htmlFor="levelActive" className="text-sm font-bold">Active for Players</Label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="rounded-xl h-11 font-bold">Cancel</Button>
                            <Button type="submit" className="rounded-xl h-11 px-8 font-bold">Save Level</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-12 text-center text-muted-foreground animate-pulse font-bold tracking-widest uppercase">Initializing Level Stream...</div>
                ) : levels.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed rounded-3xl border-muted">
                        <Trophy size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                        <p className="font-bold text-muted-foreground">No levels defined yet.</p>
                    </div>
                ) : (
                    levels.map((level) => (
                        <div key={level.id} className="group bg-muted/20 border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-all flex items-center justify-between gap-4">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl italic">
                                    {level.levelNumber}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-black uppercase tracking-tight text-lg italic">{level.name}</h4>
                                        <div className={cn(
                                            "flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                                            level.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                        )}>
                                            {level.isActive ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                            {level.isActive ? "Active" : "Disabled"}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-widest overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                                            <Info size={12} /> {level.description || "No description"}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-widest">
                                            <Clock size={12} /> {level.estimatedDurationMinutes || 0}m
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(level)} className="rounded-lg h-9 w-9 hover:bg-primary/10 hover:text-primary">
                                    <Edit2 size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(level.id)} className="rounded-lg h-9 w-9 hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
