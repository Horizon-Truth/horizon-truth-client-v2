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