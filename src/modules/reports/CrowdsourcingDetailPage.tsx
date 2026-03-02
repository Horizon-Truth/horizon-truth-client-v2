import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, Star, Share2, Flag, ThumbsUp, ThumbsDown, ExternalLink, Activity, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";

export default function CrowdsourcingDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data based on the Report types from old frontend
    const report = {
        id: id || "rep-101",
        title: "Viral Health Cure Claim",
        description: "A popular social media post claiming a miracle cure for respiratory illnesses using unconventional herbs without any medical evidence. This post has been shared over 50,000 times in the last 48 hours across various Facebook groups and WhatsApp circles.",
        longDescription: "The content originating from an unverified Facebook profile claims that a secret combination of regional herbs can cure severe respiratory viral infections faster than hospital treatments. Our analysis shows this claim lacks scientific backing and potentially discourages people from seeking professional medical help during critical stages of illness.",
        categories: ["Health", "False Information"],
        status: "UNDER_REVIEW",
        severity: "high",
        author: "User827",
        date: "2024-03-01T10:00:00Z",
        verificationCount: 24,
        credibilityScore: 15,
        sourceUrl: "https://social-platform.com/posts/viral-claim-123",
        evidence: [
            { type: "Article", title: "WHO Guidelines on Viral Treatments", url: "#" },
            { type: "Fact Check", title: "Regional Health Bureau Statement", url: "#" }
        ],
        verifications: [
            { id: 1, user: "ExpertMD", role: "Medical Professional", comment: "This contradicts all peer-reviewed studies on the subject.", status: "False", date: "2024-03-01T12:00:00Z" },
            { id: 2, user: "TruthSeeker", role: "Community Moderator", comment: "Post flagged as harmful by 150+ users.", status: "Verified False", date: "2024-03-01T14:30:00Z" }
        ]
    };

    const handleVote = (type: 'up' | 'down') => {
        toast.success(`Verification ${type === 'up' ? 'upvoted' : 'downvoted'}`);
    };

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen pt-16">
                {/* Header / Breadcrumbs */}
                <div className="bg-background border-b py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <button onClick={() => navigate("/crowdsourcing")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium">
                            <ChevronLeft size={18} /> Back to Listings
                        </button>
                    </div>
                </div>

                <section className="py-12 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-3 gap-12">

                            {/* Left Column: Report Details */}
                            <div className="lg:col-span-2 space-y-10">
                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-bold uppercase tracking-wider">
                                            High Severity
                                        </span>
                                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold">
                                            Under Review
                                        </span>
                                    </div>

                                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">{report.title}</h1>

                                    <div className="flex items-center gap-6 py-4 border-y">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border font-bold">U</div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Reported by</p>
                                                <p className="font-bold">{report.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 border-l pl-6 md:border-l md:pl-6 border-transparent">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border font-bold text-primary">
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Date Submitted</p>
                                                <p className="font-bold">{new Date(report.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                                        <h3 className="text-2xl font-bold">Case Summary</h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed">{report.longDescription}</p>

                                        <div className="p-6 bg-secondary/20 rounded-2xl border flex items-start gap-4">
                                            <ExternalLink size={24} className="text-primary shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-bold mb-1">Source URL</h4>
                                                <a href={report.sourceUrl} className="text-primary underline break-all font-medium" target="_blank" rel="noreferrer">
                                                    {report.sourceUrl}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Timeline */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold">Community Verification</h3>
                                        <Button className="rounded-xl">Verify This Report</Button>
                                    </div>

                                    <div className="space-y-6">
                                        {report.verifications.map((v) => (
                                            <div key={v.id} className="p-8 bg-card border rounded-3xl relative overflow-hidden group">
                                                <div className="flex items-start justify-between gap-4 mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20 font-bold text-primary">
                                                            {v.user[0]}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg">{v.user}</h4>
                                                            <p className="text-xs text-muted-foreground">{v.role}</p>
                                                        </div>
                                                    </div>
                                                    <span className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-widest">
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
                                                    <span className="text-xs text-muted-foreground ml-auto">{new Date(v.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Sidebar Stats & Actions */}
                            <div className="space-y-8">
                                <div className="p-8 bg-primary rounded-[2.5rem] text-primary-foreground shadow-2xl relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Activity size={24} className="opacity-80" />
                                            <h3 className="text-xl font-bold">Report Health</h3>
                                        </div>

                                        <div className="space-y-8 py-4">
                                            <div className="text-center">
                                                <p className="text-6xl font-black mb-2">{report.credibilityScore}%</p>
                                                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Credibility Score</p>
                                            </div>

                                            <div className="flex justify-between items-center text-sm border-t border-white/20 pt-6">
                                                <div className="text-center flex-1 border-r border-white/20">
                                                    <p className="text-2xl font-bold">{report.verificationCount}</p>
                                                    <p className="opacity-70">Verifiers</p>
                                                </div>
                                                <div className="text-center flex-1">
                                                    <p className="text-2xl font-bold">12</p>
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
                                            <Button className="w-full rounded-2xl py-7 bg-white text-primary hover:bg-secondary transition-all font-black text-lg">
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
                                            <span>AI Analysis</span>
                                            <span>Highly Suspicious</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 w-[15%]" />
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
