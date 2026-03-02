import { useState, useEffect } from "react";
import { BookOpen, Search, Video, GraduationCap, FileText, CheckCircle, Clock, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";

const resourcesData = [
    {
        id: 1,
        title: "The Misinformation Handbook",
        type: "guide",
        description: "Learn essential steps to verify social media posts and identify fake news effectively.",
        duration: "15 min read",
        badge: "Most Popular",
        icon: FileText
    },
    {
        id: 2,
        title: "Solution Overview",
        type: "guide",
        description: "How gamified learning and crowdsource reporting combine to protect digital integrity.",
        duration: "10 min read",
        badge: "New",
        icon: CheckCircle
    },
    {
        id: 3,
        title: "Empowering Youth with Truth",
        type: "guide",
        description: "Why Horizon Truth focuses on youth and how we're building a more resilient generation.",
        duration: "5 min read",
        icon: GraduationCap
    },
    {
        id: 4,
        title: "How Fake News Spreads",
        type: "video",
        description: "A visual guide to the viral nature of misinformation across digital platforms.",
        duration: "6 min",
        icon: Video
    },
    {
        id: 5,
        title: "Defending Truth",
        type: "course",
        description: "A comprehensive course on why digital honesty matters in the modern era.",
        duration: "45 min",
        icon: BookOpen
    },
    {
        id: 6,
        title: "Think Before You Share",
        type: "course",
        description: "Practical exercises to build the habit of verification before social interaction.",
        duration: "30 min",
        icon: GraduationCap
    }
];

export default function ResourcesPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResources, setFilteredResources] = useState(resourcesData);

    useEffect(() => {
        let results = resourcesData;
        if (activeFilter !== "all") {
            results = results.filter((r) => r.type === activeFilter);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            results = results.filter(
                (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
            );
        }
        setFilteredResources(results);
    }, [activeFilter, searchQuery]);

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen pt-16">
                {/* Hero Section */}
                <section className="py-20 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <BookOpen size={16} className="text-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Weekly Updates & New Content</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
                            Digital Literacy <span className="text-primary">Resources</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                            Empowering you with tools, guides, and knowledge to identify and combat misinformation effectively.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="rounded-xl px-8 py-7 text-lg font-bold" onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })}>
                                Explore Resources
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-xl px-8 py-7 text-lg font-bold" onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}>
                                Get Updates
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Filter & Search Section */}
                <section id="library" className="py-12 bg-background border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex flex-wrap gap-2">
                                {["all", "guide", "video", "course"].map((filter) => (
                                    <Button
                                        key={filter}
                                        variant={activeFilter === filter ? "default" : "outline"}
                                        onClick={() => setActiveFilter(filter)}
                                        className="rounded-full px-6 capitalize"
                                    >
                                        {filter}
                                    </Button>
                                ))}
                            </div>
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resource Grid */}
                <section className="py-20 bg-secondary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredResources.length > 0 ? (
                                filteredResources.map((resource) => (
                                    <div key={resource.id} className="group bg-card border rounded-2xl overflow-hidden hover:border-primary transition-all shadow-sm hover:shadow-md">
                                        <div className="h-48 bg-secondary/20 flex items-center justify-center relative overflow-hidden">
                                            <resource.icon size={64} className="text-primary/20 group-hover:scale-110 transition-transform" />
                                            {resource.badge && (
                                                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                                    {resource.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                <span className="px-2 py-1 bg-secondary rounded text-secondary-foreground">{resource.type}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} /> {resource.duration}</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{resource.title}</h3>
                                            <p className="text-muted-foreground mb-6 line-clamp-2">{resource.description}</p>
                                            <Button variant="link" className="p-0 h-auto font-bold text-primary group-hover:gap-2 transition-all">
                                                View Resource <ArrowRight size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <div className="bg-secondary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={32} className="text-muted-foreground" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">No resources found</h3>
                                    <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                                    <Button variant="outline" className="mt-6" onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}>Clear all filters</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section id="newsletter" className="py-20 bg-primary text-primary-foreground">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Mail size={48} className="mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Stay Ahead of the Curve</h2>
                        <p className="text-xl opacity-80 mb-10">Get the latest digital literacy guides and misinformation alerts delivered straight to your inbox.</p>
                        <form onSubmit={(e) => { e.preventDefault(); toast.success("Successfully subscribed!"); }} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <Button variant="secondary" size="lg" className="rounded-xl px-8 font-bold">Subscribe</Button>
                        </form>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
