import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    Calendar,
    User,
    Globe,
    ExternalLink,
    ShieldAlert,
    MessageSquare,
    Trash2,
    Save,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { reportService } from "@/services/report.service";

export default function ReportAdminDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state for admin actions
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [moderatorNotes, setModeratorNotes] = useState("");
    const [evidenceText, setEvidenceText] = useState("");

    const fetchReport = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await reportService.getReportById(id);
            setReport(data);
            setStatus(data.status);
            setPriority(data.priority);
            setModeratorNotes(data.moderatorNotes || "");
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

    const handleUpdate = async () => {
        if (!id) return;
        setIsUpdating(true);
        try {
            await reportService.updateReport(id, { status, priority, moderatorNotes });
            toast.success("Report updated successfully");
            fetchReport();
        } catch (error) {
            console.error("Error updating report:", error);
            toast.error("Failed to update report");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddEvidence = async () => {
        if (!id || !evidenceText.trim()) return;
        try {