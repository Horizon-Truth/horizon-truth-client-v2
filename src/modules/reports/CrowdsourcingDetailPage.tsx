import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, Star, Share2, Flag, ThumbsUp, ThumbsDown, ExternalLink, Activity, Info, Loader2, Send, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { reportService } from "@/services/report.service";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { AuthModal } from "@/shared/components/auth/AuthModal";
import { useAuthStore } from "@/store/auth.store";

export default function CrowdsourcingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [verificationComment, setVerificationComment] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("NEEDS_REVIEW");
    const [verificationRating, setVerificationRating] = useState("3");

    // Auth gating — verification can be filled out by guests, but submitting requires login.
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);

    const fetchReport = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await reportService.getReportById(id);
            setReport(data);
        } catch (error) {
            console.error("Error fetching report details:", error);
            toast.error("Failed to load report details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [id]);

    const handleVote = (type: 'up' | 'down') => {
        toast.info(`Verification ${type === 'up' ? 'upvoted' : 'downvoted'} (Simulation)`);
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy link");
        }
    };

    const submitVerification = async () => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            await reportService.addVerification(id, {
                comment: verificationComment,
                status: verificationStatus,
                rating: parseInt(verificationRating)
            });
            toast.success("Verification submitted successfully!");
            setIsVerifying(false);
            setVerificationComment("");
            fetchReport(); // Refresh data
        } catch (error) {