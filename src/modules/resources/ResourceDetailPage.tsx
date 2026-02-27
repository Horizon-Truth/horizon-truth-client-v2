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