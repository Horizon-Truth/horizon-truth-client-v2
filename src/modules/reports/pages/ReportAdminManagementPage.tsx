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