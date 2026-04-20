import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { Button } from "@/shared/components/ui/button";
import { adminService, type Blog, type Resource } from "@/services/admin.service";
import { useLanguageStore } from "@/store/language.store";
import * as LucideIcons from "lucide-react";

export default function BlogResourcePage() {
    const navigate = useNavigate();
    const language = useLanguageStore((s) => s.language);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Public knowledge hub: show only content in the visitor's
                // currently selected language.
                const [blogsData, resourcesData] = await Promise.all([
                    adminService.getBlogs({ language }),
                    adminService.getResources({ language })
                ]);
                setBlogs(blogsData || []);
                setResources(resourcesData || []);
            } catch (error) {
                console.error("Failed to fetch knowledge hub data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [language]);

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Synchronizing Knowledge Base...</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <section className="py-20 bg-primary/5 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Knowledge <span className="text-primary">Hub</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Explore our latest insights, research, and educational resources dedicated to digital integrity and misinformation defense.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-background">