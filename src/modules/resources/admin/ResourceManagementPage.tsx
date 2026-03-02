import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Search, Filter, MoreVertical, Trash2, Edit2, Calendar, Tag, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type Resource } from "@/services/admin.service";
import { toast } from "sonner";

export default function ResourceManagementPage() {
    const navigate = useNavigate();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getResources();
            setResources(data || []);
        } catch (error) {
            console.error("Failed to fetch resources:", error);
            toast.error("Failed to load resource library");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleDelete = async (resource: Resource) => {
        if (!confirm(`Are you sure you want to delete "${resource.title}"?`)) return;
        try {
            await adminService.deleteResource(resource.id);
            toast.success("Resource deleted successfully");
            fetchResources();
        } catch (error) {
            toast.error("Failed to delete resource");
        }
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || resource.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const types = Array.from(new Set(resources.map(r => r.type)));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase tracking-wider text-secondary">Asset <span className="text-foreground">Library</span></h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage educational toolkits, guides, and multimeda training assets.</p>
                </div>
                <Button
                    onClick={() => navigate("/dashboard/resources/library/create")}
                    className="w-full sm:w-auto rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                    <Plus size={20} />
                    Onboard New Asset
                </Button>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-card border border-border/50 p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search assets by title, description, or type..."
                        className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-secondary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 px-4 h-12 border-t md:border-t-0 md:border-l border-border/50">
                    <Filter size={18} className="text-muted-foreground" />
                    <select
                        className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-bold uppercase tracking-wider outline-none"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        {types.map(type => (
                            <option key={type} value={type}>{type.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Identity</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration/Effort</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Scanning Archive...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredResources.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <BookOpen size={40} className="text-muted-foreground/30" />
                                            <p className="text-sm font-bold text-muted-foreground">No asset records found in this sector.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredResources.map((resource) => (
                                <tr key={resource.id} className="group hover:bg-accent/5 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black transition-transform group-hover:rotate-12 group-hover:scale-110">
                                                <BookOpen size={24} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-extrabold text-lg tracking-tight truncate group-hover:text-secondary transition-colors">{resource.title}</p>
                                                <p className="text-xs text-muted-foreground font-medium line-clamp-1 italic">{resource.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <Badge variant="outline" className="rounded-lg h-7 px-3 w-fit font-black tracking-widest text-[9px] uppercase border-secondary/20 bg-secondary/5 text-secondary">
                                                <Tag size={10} className="mr-1.5" />
                                                {resource.type}
                                            </Badge>
                                            {resource.badge && (
                                                <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-500 ml-1">{resource.badge}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            <Clock size={14} className="text-secondary/60" />
                                            {resource.duration}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <Calendar size={14} className="text-secondary/60" />
                                            {new Date(resource.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2 text-secondary">
                                            {resource.linkUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-xl hover:bg-secondary/10 transition-colors"
                                                    onClick={() => window.open(resource.linkUrl, '_blank')}
                                                    title="Open Link"
                                                >
                                                    <ExternalLink size={18} />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl hover:bg-secondary/10 transition-colors"
                                                title="Edit Asset"
                                                onClick={() => navigate(`/dashboard/resources/library/edit/${resource.id}`)}
                                            >
                                                <Edit2 size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                onClick={() => handleDelete(resource)}
                                                title="Delete Asset"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
