import { useState, useEffect } from "react";
import { Search, Filter, ShieldCheck, Star, ArrowUpRight, Info, Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { reportService } from "@/services/report.service";
import type { ReportTag } from "@/services/report.service";

export default function CrowdsourcingListingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [reports, setReports] = useState<any[]>([]);
    const [categories, setCategories] = useState<ReportTag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [reportsRes, tagsRes] = await Promise.all([
                    reportService.getReports({
                        tagId: activeCategory === 'all' ? undefined : activeCategory,
                        search: searchTerm || undefined
                    }),
                    reportService.getReportTags()
                ]);
                setReports(reportsRes.data);
                setCategories(tagsRes.data);
            } catch (error) {
                console.error("Error fetching crowdsourcing data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchData, searchTerm ? 500 : 0);
        return () => clearTimeout(timeoutId);
    }, [activeCategory, searchTerm]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'VERIFIED': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'UNDER_REVIEW': return 'bg-primary/10 text-primary border-primary/20';
            case 'NEW': return 'bg-accent/10 text-accent-foreground border-accent/20';
            case 'FLAGGED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL':
            case 'HIGH': return 'text-red-500';
            case 'MEDIUM': return 'text-accent-foreground';
            case 'LOW': return 'text-secondary';
            default: return 'text-gray-500';
        }
    };

    const renderIcon = (iconName: string | undefined) => {
        if (!iconName) return <Info size={18} />;
        const IconComponent = (LucideIcons as any)[iconName];
        return IconComponent ? <IconComponent size={18} /> : <Info size={18} />;
    };

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen">
                {/* Hero Section */}
                <section className="py-20 bg-primary/5 border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">Crowdsourced <span className="text-primary">Reports</span></h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Explore reported misinformation cases verified by our community. Join the effort to build a more truthful digital landscape.
                            </p>
                            <div className="relative pt-6">
                                <Search className="absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search reports by title or content..."
                                    className="w-full pl-12 pr-4 py-5 rounded-2xl border bg-background shadow-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-12">

                            {/* Sidebar Filters */}
                            <div className="lg:w-1/4 space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <Filter size={18} /> Categories
                                    </h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setActiveCategory("all")}
                                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeCategory === 'all' ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary text-muted-foreground"}`}
                                        >
                                            <Info size={18} />
                                            <span className="font-semibold">All Categories</span>
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setActiveCategory(cat.id)}
                                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeCategory === cat.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary text-muted-foreground"
                                                    }`}
                                            >
                                                {renderIcon(cat.icon)}
                                                <span className="font-semibold">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                    <h4 className="font-bold mb-2">Want to report?</h4>
                                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Seen something suspicious online? Submit it for community review.</p>
                                    <Button onClick={() => navigate("/crowdsourcing/submit")} className="w-full rounded-xl py-6 font-bold">New Report</Button>
                                </div>
                            </div>

                            {/* Main Listing */}
                            <div className="lg:w-3/4">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-32">
                                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                        <p className="text-muted-foreground font-medium">Loading reports...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-10">
                                            <h2 className="text-2xl font-bold">{reports.length} Reports Found</h2>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>Sort by:</span>
                                                <select className="bg-transparent font-bold text-foreground focus:outline-none">
                                                    <option>Most Recent</option>
                                                    <option>Highest Credibility</option>
                                                    <option>Most Verified</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {reports.length > 0 ? (
                                                reports.map((report) => (
                                                    <div
                                                        key={report.id}
                                                        onClick={() => navigate(`/crowdsourcing/${report.id}`)}
                                                        className="group p-8 bg-card border rounded-3xl hover:border-primary hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                                                    >
                                                        {/* Credibility Badge (Trustpilot-style) */}
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -rotate-12 translate-x-8 -translate-y-8 group-hover:bg-primary/10 transition-colors" />

                                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                                                            <div className="space-y-4 max-w-2xl">
                                                                <div className="flex items-center gap-3">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                                                                        {report.status.replace('_', ' ')}
                                                                    </span>
                                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${getPriorityColor(report.priority).replace('text-', 'bg-').replace('500', '500/10')} ${getPriorityColor(report.priority)}`}>
                                                                        {report.priority} Priority
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</span>
                                                                </div>

                                                                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{report.title}</h3>
                                                                <p className="text-muted-foreground line-clamp-2 leading-relaxed">{report.description}</p>

                                                                <div className="flex flex-wrap items-center gap-6 pt-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex -space-x-2">
                                                                            {[1, 2, 3].map(i => (
                                                                                <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-[10px] font-bold">
                                                                                    {String.fromCharCode(64 + i)}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-sm font-medium text-muted-foreground">+{report.verificationCount} verifications</span>
                                                                    </div>

                                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/30 rounded-lg">
                                                                        <ShieldCheck size={16} className="text-primary" />
                                                                        <span className="text-sm font-bold">{report.credibilityScore}% Credibility</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col items-end gap-4 min-w-[120px]">
                                                                <div className="flex items-center gap-1">
                                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                                        <Star
                                                                            key={s}
                                                                            size={16}
                                                                            className={s <= Math.ceil(report.credibilityScore / 20) ? "fill-primary text-primary" : "text-muted"}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <Button variant="ghost" className="rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                                                                    View Details <ArrowUpRight className="ml-2" size={16} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-32 bg-secondary/10 rounded-3xl border border-dashed">
                                                    <Search size={48} className="mx-auto text-muted-foreground mb-6" />
                                                    <h3 className="text-2xl font-bold mb-2">No reports found</h3>
                                                    <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                                                    <Button variant="outline" className="mt-8" onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}>Clear all filters</Button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Pagination (Simplified) */}
                                {!isLoading && reports.length > 0 && (
                                    <div className="mt-16 flex items-center justify-center gap-4">
                                        <Button variant="outline" disabled className="rounded-xl px-8">Previous</Button>
                                        <div className="flex gap-2">
                                            <Button variant="secondary" className="w-10 h-10 p-0 rounded-lg">1</Button>
                                        </div>
                                        <Button variant="outline" disabled className="rounded-xl px-8">Next</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
