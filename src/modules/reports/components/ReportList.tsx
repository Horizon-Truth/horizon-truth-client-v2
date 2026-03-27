import { useEffect, useState } from "react";
import { reportService } from "@/services/report.service";
import { Badge } from "@/shared/components/ui/badge";
import { Loader2, AlertTriangle, Calendar, User, Globe } from "lucide-react";
import { toast } from "sonner";

interface Report {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    contentType: string;
    createdAt: string;
    user?: {
        username: string;
    };
}

export function ReportList() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReports() {
            try {
                const data = await reportService.getReports();
                setReports(data.data);
            } catch (error) {
                toast.error("Failed to load reports");
            } finally {
                setLoading(false);
            }
        }
        loadReports();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Scanning the integrity horizon...</p>
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-muted/20">
                <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">