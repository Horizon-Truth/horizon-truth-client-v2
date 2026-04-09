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