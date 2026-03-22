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
