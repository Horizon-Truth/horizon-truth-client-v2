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
import { AiVerificationCard } from "@/modules/reports/components/AiVerificationCard";

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
            await reportService.addEvidence(id, {
                evidenceType: 'LINK',
                content: evidenceText,
                sourceType: 'EXTERNAL',
                credibilityScore: 60,
                verificationStatus: 'PENDING',
            });
            toast.success('Evidence added');
            setEvidenceText('');
            fetchReport();
        } catch (error) {
            console.error('Error adding evidence:', error);
            toast.error('Failed to add evidence');
        }
    };

    const handleDelete = async () => {
        if (!id || !confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;
        setIsDeleting(true);
        try {
            await reportService.deleteReport(id);
            toast.success("Report deleted successfully");
            navigate("/dashboard/reports");
        } catch (error) {
            console.error("Error deleting report:", error);
            toast.error("Failed to delete report");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Accessing intelligence dossier...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-muted/20">
                <ShieldAlert className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
                <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Report dossier not found</h2>
                <Button onClick={() => navigate("/dashboard/reports")} variant="link" className="mt-4 font-black text-primary">RETURN TO MANAGEMENT</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex items-center justify-between">
                <button onClick={() => navigate("/dashboard/reports")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-black text-xs uppercase tracking-widest group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Dashboard
                </button>
                <div className="flex gap-3">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-xl font-bold px-6 bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} className="mr-2" />}
                        Purge Entry
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[2rem] border shadow-2xl overflow-hidden bg-card/40 backdrop-blur-xl border-border/50">
                        <CardHeader className="bg-muted/30 pb-8 pt-10 px-10">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <Badge variant="outline" className="rounded-full bg-primary/5 border-primary/20 text-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                                    {report.contentType}
                                </Badge>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${report.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        report.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    }`}>
                                    {report.priority} PRIORITY
                                </span>
                            </div>
                            <CardTitle className="text-4xl font-black leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                {report.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-10 py-10 space-y-10">
                            <div className="flex flex-wrap items-center gap-8 py-8 border-y border-border/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/20">
                                        <User size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50 mb-0.5">Reporter</p>
                                        <p className="font-bold text-sm tracking-tight">{report.reporter?.fullName || 'Anonymous Identity'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/20">
                                        <Calendar size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50 mb-0.5">Date Entered</p>
                                        <p className="font-bold text-sm tracking-tight">{new Date(report.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/20">
                                        <Globe size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50 mb-0.5">Language</p>
                                        <p className="font-bold text-sm tracking-tight uppercase">{report.language}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-xl font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-primary rounded-full" /> Narrative Dossier
                                </h3>
                                <div className="p-8 bg-black/20 rounded-3xl border border-white/5 text-lg leading-relaxed text-muted-foreground/90 whitespace-pre-wrap italic font-medium shadow-inner">
                                    "{report.description}"
                                </div>
                            </div>

                            {report.sourceUrl && (
                                <div className="p-6 bg-primary/5 rounded-[1.5rem] border border-primary/20 flex items-start gap-4 hover:bg-primary/10 transition-colors group cursor-pointer">
                                    <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                                        <ExternalLink size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-black text-xs uppercase tracking-widest mb-1 opacity-70">External Intelligence Link</h4>
                                        <a href={report.sourceUrl} className="text-primary underline break-all font-bold text-sm block" target="_blank" rel="noreferrer">
                                            {report.sourceUrl}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* AI analysis is shown to moderators as evidence with full
                        provenance — it never sets the report status itself. */}
                    <AiVerificationCard
                        reportId={report.id}
                        initialVerification={report.aiVerification}
                        variant="moderator"
                        className="rounded-[2rem] shadow-xl bg-card/40 backdrop-blur-sm border-border/50"
                    />

                    <Card className="rounded-[2rem] border shadow-xl bg-card/20 backdrop-blur-sm border-border/40">
                        <CardHeader className="px-10 pt-10">
                            <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
                                <MessageSquare size={24} className="text-primary" /> Community Verifications
                                <Badge variant="secondary" className="ml-2 font-black">{report.verifications?.length || 0}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 space-y-6">
                            {report.verifications?.length > 0 ? (
                                report.verifications.map((v: any) => (
                                    <div key={v.id} className="p-6 bg-card/60 rounded-3xl border border-border/50 group transition-all hover:border-primary/30">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-sm border">
                                                    {v.user?.fullName?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm">{v.user?.fullName || 'Anonymous agent'}</h4>
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">{v.user?.role || 'Verifier'}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${v.status === 'TRUE' || v.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {v.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium italic">"{v.comment}"</p>
                                        <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                                            <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-tighter">Entry timestamp: {new Date(v.createdAt).toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Confidence: {v.rating}/5</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-muted/5 rounded-3xl border border-dashed border-border/50 text-muted-foreground">
                                    No verifications recorded for this dossier.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-2xl border-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
                        <CardHeader className="relative z-10 px-8 pt-10">
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                <ShieldAlert size={28} className="opacity-80" /> Operational Control
                            </CardTitle>
                            <CardDescription className="text-primary-foreground/70 font-bold text-xs uppercase tracking-widest pt-2">Modify dossier classification</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 px-8 pb-10 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-80 pl-1">Operational Status</label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-14 rounded-2xl bg-white/10 border-white/20 text-white font-bold ring-0 focus:ring-2 focus:ring-white/40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border rounded-2xl">
                                        <SelectItem value="NEW" className="font-bold">NEW Dossier</SelectItem>
                                        <SelectItem value="UNDER_REVIEW" className="font-bold">UNDER REVIEW</SelectItem>
                                        <SelectItem value="NEEDS_MORE_EVIDENCE" className="font-bold">NEEDS MORE EVIDENCE</SelectItem>
                                        <SelectItem value="VERIFIED_FALSE" className="font-bold text-red-500">VERIFIED FALSE</SelectItem>
                                        <SelectItem value="VERIFIED_TRUE" className="font-bold text-emerald-500">VERIFIED TRUE</SelectItem>
                                        <SelectItem value="DUPLICATE" className="font-bold opacity-80">DUPLICATE</SelectItem>
                                        <SelectItem value="REJECTED" className="font-bold text-red-500">REJECTED Falsehood</SelectItem>
                                        <SelectItem value="ARCHIVED" className="font-bold opacity-50">ARCHIVED / CLOSED</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-80 pl-1">Intelligence Priority</label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger className="h-14 rounded-2xl bg-white/10 border-white/20 text-white font-bold ring-0 focus:ring-2 focus:ring-white/40">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border rounded-2xl">
                                        <SelectItem value="CRITICAL" className="font-black text-red-600">CRITICAL Response</SelectItem>
                                        <SelectItem value="HIGH" className="font-bold text-red-400">HIGH Priority</SelectItem>
                                        <SelectItem value="MEDIUM" className="font-bold">MEDIUM Priority</SelectItem>
                                        <SelectItem value="LOW" className="font-bold opacity-70">LOW Priority</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-80 pl-1">Moderator Notes</label>
                                <Textarea
                                    value={moderatorNotes}
                                    onChange={(e) => setModeratorNotes(e.target.value)}
                                    placeholder="Private moderator notes"
                                    className="min-h-[120px] rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                />
                            </div>

                            <Button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className="w-full h-16 rounded-2xl bg-white text-primary hover:bg-white/90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 font-black text-lg gap-3"
                            >
                                {isUpdating ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                COMMIT CHANGES
                            </Button>

                            <div className="space-y-3 border-t border-white/10 pt-4">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-80 pl-1">Add Evidence</label>
                                <Textarea
                                    value={evidenceText}
                                    onChange={(e) => setEvidenceText(e.target.value)}
                                    placeholder="Paste a link, citation, or supporting note"
                                    className="min-h-[100px] rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                />
                                <Button onClick={handleAddEvidence} className="w-full rounded-2xl bg-white/15 border border-white/20">Add Evidence</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border shadow-xl bg-card border-border/50 overflow-hidden">
                        <CardHeader className="bg-muted/30 px-8 py-6">
                            <CardTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary" /> Intelligence Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 py-8 space-y-6 text-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/20 rounded-2xl border">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1 opacity-50">Score</p>
                                    <p className="text-3xl font-black text-primary">{report.credibilityScore}%</p>
                                </div>
                                <div className="p-4 bg-muted/20 rounded-2xl border">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1 opacity-50">Trust rank</p>
                                    <p className="text-3xl font-black text-primary">#Analysis Pending</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border/30">
                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-4 opacity-50">Truth Probability Analysis</p>
                                <div className="h-4 w-full bg-muted/50 rounded-full overflow-hidden p-1 border">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${report.credibilityScore > 70 ? 'bg-emerald-500' :
                                                report.credibilityScore > 40 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
                                                    'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                            }`}
                                        style={{ width: `${report.credibilityScore}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
