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