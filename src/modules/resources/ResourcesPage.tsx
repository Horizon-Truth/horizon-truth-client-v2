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