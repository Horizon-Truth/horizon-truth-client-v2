import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, BookOpen, ShieldCheck, FileText } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { Button } from "@/shared/components/ui/button";
import { adminService, type Resource } from "@/services/admin.service";
import { toast } from "sonner";

export default function ResourceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState<Resource | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await adminService.getResourceById(id);
                setResource(data);
            } catch (error) {
                console.error("Failed to fetch resource:", error);
                toast.error("Failed to load resource");
            } finally {
                setIsLoading(false);
            }
        };
        fetchResource();
    }, [id]);

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Accessing Repository...</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    if (!resource) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Resource not found</h1>
                        <Button onClick={() => navigate("/resources")}>Back to Resources</Button>
                    </div>