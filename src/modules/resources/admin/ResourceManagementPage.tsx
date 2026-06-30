import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Search, Filter, MoreVertical, Trash2, Edit2, Calendar, Tag, Clock, ExternalLink, Languages } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type Resource } from "@/services/admin.service";
import { toast } from "sonner";
import { LanguageBadge } from "@/shared/i18n/components/LanguageBadge";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/shared/i18n/languages";

export default function ResourceManagementPage() {
    const navigate = useNavigate();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [languageFilter, setLanguageFilter] = useState<"all" | LanguageCode>("all");

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getResources(
                languageFilter === "all" ? undefined : { language: languageFilter },
            );
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [languageFilter]);

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
                <div className="flex items-center gap-2 px-4 h-12 border-t md:border-t-0 md:border-l border-border/50">
                    <Languages size={18} className="text-muted-foreground" />
                    <select
                        className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-bold uppercase tracking-wider outline-none"
                        value={languageFilter}