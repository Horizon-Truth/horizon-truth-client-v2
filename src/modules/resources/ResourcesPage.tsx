import { useState, useEffect } from "react";
import { BookOpen, Search, Clock, ArrowRight, Mail } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { adminService, type Resource } from "@/services/admin.service";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { useNavigate } from "react-router-dom";

export default function ResourcesPage() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            try {
                const data = await adminService.getResources();
                setResources(data || []);
            } catch (error) {
                console.error("Failed to fetch resources:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResources();
    }, []);

    useEffect(() => {
        let results = resources;
        if (activeFilter !== "all") {
            results = results.filter((r) => r.type === activeFilter);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            results = results.filter(
                (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
            );
        }
        setFilteredResources(results);
    }, [activeFilter, searchQuery, resources]);

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Restoring Asset Archive...</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }
