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

export default function CrowdsourcingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [verificationComment, setVerificationComment] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("NEEDS_REVIEW");
    const [verificationRating, setVerificationRating] = useState("3");

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

    const handleSubmitVerification = async () => {
        if (!id) return;
        if (!verificationComment.trim()) {
            toast.error("Please add a comment");
            return;
        }

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
            console.error("Error submitting verification:", error);
            toast.error("Failed to submit verification. Are you logged in?");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground font-medium text-lg">Loading report details...</p>
                </div>
            </PublicLayout>
        );
    }

    if (!report) {
        return (
            <PublicLayout>
                <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center">
                    <AlertCircle size={64} className="text-muted-foreground mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Report Not Found</h2>
                    <p className="text-muted-foreground max-w-md mb-8">The report you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate("/crowdsourcing")} variant="outline" className="rounded-xl px-8">Return to Listings</Button>
                </div>
            </PublicLayout>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'VERIFIED': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'UNDER_REVIEW': return 'bg-primary/10 text-primary border-primary/20';
            case 'NEW': return 'bg-accent/10 text-accent-foreground border-accent/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen">
                {/* Header / Breadcrumbs */}
                <div className="bg-background border-b py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/crowdsourcing")}
                            className="gap-2 rounded-xl hover:bg-primary/5 font-bold"
                        >
                            <ChevronLeft size={18} />
                            Back to Listings
                        </Button>
                    </div>
                </div>

                <section className="py-12 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-3 gap-12">

                            {/* Left Column: Report Details */}
                            <div className="lg:col-span-2 space-y-10">
                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full border text-sm font-bold uppercase tracking-wider ${report.priority === 'HIGH' || report.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-secondary text-secondary-foreground'
                                            }`}>
                                            {report.priority} Priority
                                        </span>
                                        <span className={`px-4 py-1.5 rounded-full border text-sm font-bold ${getStatusColor(report.status)}`}>
                                            {report.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">{report.title}</h1>

                                    <div className="flex items-center gap-6 py-4 border-y">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border font-bold">
                                                {report.reporter?.fullName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Reported by</p>
                                                <p className="font-bold">{report.reporter?.fullName || 'Anonymous'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 border-l pl-6">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border font-bold text-primary">
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Date Submitted</p>
                                                <p className="font-bold">{new Date(report.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                                        <h3 className="text-2xl font-bold">Case Summary</h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">{report.description}</p>

                                        {report.sourceUrl && (
                                            <div className="p-6 bg-secondary/20 rounded-2xl border flex items-start gap-4">
                                                <ExternalLink size={24} className="text-primary shrink-0 mt-1" />
                                                <div>
                                                    <h4 className="font-bold mb-1">Source URL</h4>
                                                    <a href={report.sourceUrl} className="text-primary underline break-all font-medium" target="_blank" rel="noreferrer">
                                                        {report.sourceUrl}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Verification Timeline */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold">Community Verification</h3>
                                        <Dialog open={isVerifying} onOpenChange={setIsVerifying}>
                                            <DialogTrigger asChild>
                                                <Button className="rounded-xl">Verify This Report</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md bg-card border-none shadow-2xl rounded-3xl p-8">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-bold">Submit Verification</DialogTitle>
                                                    <DialogDescription className="text-muted-foreground">
                                                        Help the community by providing your analysis of this report.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-6 py-4 text-left">
                                                    <div className="space-y-2">
                                                        <Label className="font-bold">Your Verdict</Label>
                                                        <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                                                            <SelectTrigger className="rounded-xl py-6">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="TRUE">True / Verified</SelectItem>
                                                                <SelectItem value="FALSE">False / Misinformation</SelectItem>
                                                                <SelectItem value="FAKE">Manipulated / Deepfake</SelectItem>
                                                                <SelectItem value="NEEDS_REVIEW">Needs Further Investigation</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="font-bold">Confidence Rating (1-5)</Label>
                                                        <Select value={verificationRating} onValueChange={setVerificationRating}>
                                                            <SelectTrigger className="rounded-xl py-6">
                                                                <SelectValue placeholder="Confidence" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1">1 - Very Low</SelectItem>
                                                                <SelectItem value="2">2 - Low</SelectItem>
                                                                <SelectItem value="3">3 - Moderate</SelectItem>
                                                                <SelectItem value="4">4 - High</SelectItem>
                                                                <SelectItem value="5">5 - expert</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="font-bold">Reasoning / Comments</Label>
                                                        <Textarea
                                                            placeholder="Explain why you chose this status. Provide links or technical details if possible."
                                                            className="rounded-xl min-h-[120px] bg-secondary/10 border-none focus-visible:ring-primary"
                                                            value={verificationComment}
                                                            onChange={(e) => setVerificationComment(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        onClick={handleSubmitVerification}
                                                        disabled={isSubmitting}
                                                        className="w-full rounded-xl py-6 font-bold"
                                                    >
                                                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" size={18} />}
                                                        Submit Verification
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="space-y-6">
                                        {report.verifications?.length > 0 ? (
                                            report.verifications.map((v: any) => (
                                                <div key={v.id} className="p-8 bg-card border rounded-3xl relative overflow-hidden group">
                                                    <div className="flex items-start justify-between gap-4 mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20 font-bold text-primary">
                                                                {v.user?.fullName?.[0] || 'U'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-lg">{v.user?.fullName || 'Anonymous'}</h4>
                                                                <p className="text-xs text-muted-foreground">{v.user?.role || 'Contributor'}</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest">
                                                            {v.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-muted-foreground leading-relaxed mb-6 italic">"{v.comment}"</p>
                                                    <div className="flex items-center gap-6 pt-6 border-t">
                                                        <button onClick={() => handleVote('up')} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                                                            <ThumbsUp size={16} /> Helpful
                                                        </button>
                                                        <button onClick={() => handleVote('down')} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors">
                                                            <ThumbsDown size={16} /> Not Helpful
                                                        </button>
                                                        <span className="text-xs text-muted-foreground ml-auto">{new Date(v.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-16 bg-secondary/5 rounded-3xl border border-dashed text-muted-foreground">
                                                No verifications yet. Be the first to verify this report!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Sidebar Stats & Actions */}
                            <div className="space-y-8">
                                <div className="p-8 bg-primary rounded-[2.5rem] text-primary-foreground shadow-2xl relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                    <div className="relative z-10 space-y-6 text-center">
                                        <div className="flex items-center gap-3 justify-center mb-4">
                                            <Activity size={24} className="opacity-80" />
                                            <h3 className="text-xl font-bold">Report Health</h3>
                                        </div>

                                        <div className="space-y-8 py-4">
                                            <div>
                                                <p className="text-7xl font-black mb-2">{report.credibilityScore}%</p>
                                                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Credibility Score</p>
                                            </div>

                                            <div className="flex justify-between items-center text-sm border-t border-white/20 pt-6">
                                                <div className="text-center flex-1 border-r border-white/20">
                                                    <p className="text-2xl font-bold">{report.verifications?.length || 0}</p>
                                                    <p className="opacity-70">Verifiers</p>
                                                </div>
                                                <div className="text-center flex-1">
                                                    <p className="text-2xl font-bold">{Math.floor(Math.random() * 20) + 5}</p>
                                                    <p className="opacity-70">Discussions</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 justify-center py-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={24} className={s <= Math.ceil(report.credibilityScore / 20) ? "fill-secondary text-secondary" : "text-white/20"} />
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <Button
                                                onClick={() => setIsVerifying(true)}
                                                className="w-full rounded-2xl py-7 bg-white text-primary hover:bg-secondary transition-all font-black text-lg"
                                            >
                                                ADD VERIFICATION
                                            </Button>
                                            <div className="flex gap-2">
                                                <Button variant="outline" className="flex-1 rounded-xl bg-transparent border-white/30 hover:bg-white/10 text-white">
                                                    <Share2 size={16} className="mr-2" /> Share
                                                </Button>
                                                <Button variant="outline" className="flex-1 rounded-xl bg-transparent border-white/30 hover:bg-white/10 text-white">
                                                    <Flag size={16} className="mr-2" /> Flag
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-card border rounded-[2rem] space-y-6 shadow-sm">
                                    <h4 className="font-bold text-xl flex items-center gap-2">
                                        <Info size={20} className="text-primary" /> Why this score?
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Credibility scores are calculated based on community feedback, medical expert verification, and automated AI source analysis. A score below 30% indicates highly suspicious content.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span>AI Confidence</span>
                                            <span>
                                                {report.credibilityScore > 70 ? 'High' : report.credibilityScore > 40 ? 'Moderate' : 'Suspicious'}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${report.credibilityScore > 70 ? 'bg-green-500' : report.credibilityScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${report.credibilityScore}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
