import { useState, useEffect } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { Button } from "@/shared/components/ui/button";
import { adminService, type Resource } from "@/services/admin.service";
import { useLanguageStore } from "@/store/language.store";
import { motion, AnimatePresence } from "framer-motion";

export default function ResourceLibraryPage() {
    const navigate = useNavigate();
    const language = useLanguageStore((s) => s.language);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            try {
                const data = await adminService.getResources({ language });
                setResources(data || []);
            } catch (error) {
                console.error("Failed to fetch resources:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResources();
    }, [language]);

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = activeFilter === "all" || resource.type === activeFilter;
        return matchesSearch && matchesType;
    });

    const filters = ["all", "guide", "video", "course"];

    return (
        <PublicLayout>
            <section className="py-20 bg-primary/5 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Resource <span className="text-primary">Library</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Access our full collection of educational materials, verification guides, and media resources to sharpen your digital literacy.
                    </p>
                </div>
            </section>

            {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Decrypting Repository...</p>
                </div>
            ) : (
                <section className="py-16 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Filters & Search */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                            <div className="flex flex-wrap gap-2">
                                {filters.map((filter) => (
                                    <Button
                                        key={filter}
                                        variant={activeFilter === filter ? "default" : "outline"}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`rounded-full px-6 capitalize font-black ${activeFilter === filter ? 'bg-primary' : 'hover:border-primary/50'}`}
                                    >
                                        {filter}
                                    </Button>
                                ))}
                            </div>
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search the library..."
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-secondary/5 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>