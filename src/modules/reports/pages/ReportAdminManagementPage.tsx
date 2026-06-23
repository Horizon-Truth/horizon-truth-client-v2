import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Eye,
    AlertCircle,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { reportService } from "@/services/report.service";

export default function ReportAdminManagementPage() {
    const navigate = useNavigate();
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await reportService.getReports();
            setReports(res.data || []);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            toast.error("Failed to load reports");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = reports.filter(report => {
        const title = report.title || "";
        const description = report.description || "";
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || report.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'NEW': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">NEW</Badge>;
            case 'UNDER_REVIEW': return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">UNDER REVIEW</Badge>;
            case 'VERIFIED_FALSE': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">VERIFIED FALSE</Badge>;
            case 'VERIFIED_TRUE': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">VERIFIED TRUE</Badge>;
            case 'NEEDS_MORE_EVIDENCE': return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">NEEDS MORE EVIDENCE</Badge>;
            case 'DUPLICATE': return <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">DUPLICATE</Badge>;
            case 'VERIFIED': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">VERIFIED</Badge>;
            case 'CLOSED': return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">CLOSED</Badge>;
            case 'REJECTED': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">REJECTED</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return <Badge className="bg-red-600">CRITICAL</Badge>;
            case 'HIGH': return <Badge className="bg-orange-500">HIGH</Badge>;
            case 'MEDIUM': return <Badge className="bg-blue-500">MEDIUM</Badge>;
            case 'LOW': return <Badge variant="secondary">LOW</Badge>;
            default: return <Badge variant="outline">{priority}</Badge>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight italic uppercase tracking-wider">Report Management</h2>
                    <p className="text-sm text-muted-foreground mt-1 text-premium-muted">Oversee and verify community crowdsourced reports.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search reports by title or description..."
                        className="pl-10 h-12 rounded-xl bg-card border-none ring-1 ring-border focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="h-12 px-4 rounded-xl bg-card border-none ring-1 ring-border text-sm font-bold focus:ring-2 focus:ring-primary outline-none min-w-[150px] appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="NEW">New</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="NEEDS_MORE_EVIDENCE">Needs More Evidence</option>
                        <option value="VERIFIED_FALSE">Verified False</option>
                        <option value="VERIFIED_TRUE">Verified True</option>
                        <option value="DUPLICATE">Duplicate</option>