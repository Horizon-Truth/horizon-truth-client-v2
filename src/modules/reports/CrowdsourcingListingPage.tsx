import { useState, useEffect } from "react";
import { Search, Filter, ShieldCheck, Star, ArrowUpRight, Info, Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { reportService } from "@/services/report.service";
import type { ReportTag } from "@/services/report.service";

export default function CrowdsourcingListingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [reports, setReports] = useState<any[]>([]);
    const [categories, setCategories] = useState<ReportTag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [reportsRes, tagsRes] = await Promise.all([
                    reportService.getReports({
                        tagId: activeCategory === 'all' ? undefined : activeCategory,
                        search: searchTerm || undefined
                    }),
                    reportService.getReportTags()
                ]);
                setReports(reportsRes.data);
                setCategories(tagsRes.data);
            } catch (error) {
                console.error("Error fetching crowdsourcing data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchData, searchTerm ? 500 : 0);
        return () => clearTimeout(timeoutId);
    }, [activeCategory, searchTerm]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'VERIFIED': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'UNDER_REVIEW': return 'bg-primary/10 text-primary border-primary/20';
            case 'NEW': return 'bg-accent/10 text-accent-foreground border-accent/20';
            case 'FLAGGED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL':
            case 'HIGH': return 'text-red-500';
            case 'MEDIUM': return 'text-accent-foreground';
            case 'LOW': return 'text-secondary';
            default: return 'text-gray-500';
        }
    };

    const renderIcon = (iconName: string | undefined) => {
        if (!iconName) return <Info size={18} />;
        const IconComponent = (LucideIcons as any)[iconName];
        return IconComponent ? <IconComponent size={18} /> : <Info size={18} />;
    };

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen">
                {/* Hero Section */}
                <section className="py-20 bg-primary/5 border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">Crowdsourced <span className="text-primary">Reports</span></h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Explore reported misinformation cases verified by our community. Join the effort to build a more truthful digital landscape.
                            </p>
                            <div className="relative pt-6">
                                <Search className="absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-muted-foreground" size={20} />
                                <input