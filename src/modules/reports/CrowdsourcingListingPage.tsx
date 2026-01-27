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