import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Search, Filter, MoreVertical, Trash2, Edit2, Calendar, User, Tag, Clock, Languages } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type Blog } from "@/services/admin.service";
import { toast } from "sonner";
import { LanguageBadge } from "@/shared/i18n/components/LanguageBadge";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/shared/i18n/languages";

export default function BlogManagementPage() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [languageFilter, setLanguageFilter] = useState<"all" | LanguageCode>("all");

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            // Language filtering is applied server-side so admins can scope the
            // list to one language; "all" omits the param to show every language.
            const data = await adminService.getBlogs(
                languageFilter === "all" ? undefined : { language: languageFilter },
            );
            setBlogs(data || []);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
            toast.error("Failed to load blog posts");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [languageFilter]);

    const handleDelete = async (blog: Blog) => {
        if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) return;
        try {