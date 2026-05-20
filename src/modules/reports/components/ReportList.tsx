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
                    <AlertTriangle className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No incidents reported yet</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                    The horizon is currently clear. Be the first to report an incident if you spot one.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {reports.map((report) => (
                <div
                    key={report.id}
                    className="group bg-card p-6 rounded-2xl border hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 active:scale-[0.99]"
                >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <Badge variant="outline" className="rounded-full bg-primary/5 border-primary/10 text-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                    {report.contentType}
                                </Badge>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${report.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                                        report.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    {report.priority}
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    {report.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">{report.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                                {report.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t flex flex-wrap items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-primary/50" />
                            {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-primary/50" />
                            {report.user?.username || 'ANONYMOUS'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe size={14} className="text-primary/50" />
                            VERIFIED SOURCE
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
