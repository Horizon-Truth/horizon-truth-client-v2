import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { Button } from "@/shared/components/ui/button";
import { adminService, type Blog } from "@/services/admin.service";
import { toast } from "sonner";

export default function BlogDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await adminService.getBlogById(id);
                setBlog(data);
            } catch (error) {