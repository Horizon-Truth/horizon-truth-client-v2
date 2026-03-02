import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, BookOpen, ShieldCheck, FileText, Clock } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { Button } from "@/shared/components/ui/button";
import { adminService, type Resource } from "@/services/admin.service";
import { toast } from "sonner";

export default function ResourceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState<Resource | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const dataArray = await adminService.getResources();
                const found = dataArray.find((r: Resource) => r.id === id);
                setResource(found || null);
            } catch (error) {
                console.error("Failed to fetch resource:", error);
                toast.error("Failed to load resource");
            } finally {
                setIsLoading(false);
            }
        };
        fetchResource();
    }, [id]);

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Accessing Repository...</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    if (!resource) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Resource not found</h1>
                        <Button onClick={() => navigate("/resources")}>Back to Resources</Button>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    const Icon = (LucideIcons as any)[resource.icon] || FileText;

    return (
        <PublicLayout>
            <section className="py-20 bg-primary/5 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <Icon size={16} className="text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{resource.type}</span>
                    </div>
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6 line-clamp-2">
                        {resource.title}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {resource.description}
                    </p>
                </div>
            </section>

            <section className="py-24 bg-background">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Action Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <Button size="lg" className="px-8 py-7 rounded-2xl font-black text-xl hover:shadow-2xl transition-all gap-2 h-auto text-primary-foreground" onClick={() => resource.linkUrl && window.open(resource.linkUrl, '_blank')}>
                            <Download size={20} /> Access Asset
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 py-7 rounded-2xl font-black text-xl hover:bg-secondary/10 transition-all border-2 h-auto">
                            Full Access
                        </Button>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-10 rounded-[2.5rem] bg-secondary/5 border-2 border-primary/10 backdrop-blur-xl"
                            >
                                <h3 className="text-3xl font-black mb-8 flex items-center gap-3">
                                    <BookOpen className="text-primary" size={28} />
                                    Key Takeaways
                                </h3>
                                <ul className="space-y-6">
                                    {[
                                        "Learn to identify subtle bias in reporting.",
                                        "Master reverse image search techniques.",
                                        "Understand the psychological triggers of fake news.",
                                        "Collaborate with the community to verify claims."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <div className="mt-1.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            </div>
                                            <p className="text-lg text-muted-foreground font-medium">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <div className="space-y-6">
                                <h3 className="text-3xl font-black tracking-tighter">About this {resource.type}</h3>
                                <div className="text-xl text-muted-foreground leading-relaxed font-medium prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: resource.fullContent || "" }} />
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10"
                            >
                                <h4 className="text-lg font-black uppercase tracking-widest mb-6">Details</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                                        <span className="text-muted-foreground font-medium">Format</span>
                                        <span className="font-black text-primary uppercase">{resource.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                                        <span className="text-muted-foreground font-medium">Duration</span>
                                        <span className="font-black">{resource.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                                        <span className="text-muted-foreground font-medium">Level</span>
                                        <span className="font-black">Intermediate</span>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="p-8 rounded-[2rem] bg-secondary/5 border border-secondary/10">
                                <ShieldCheck className="text-secondary mb-4" size={32} />
                                <h4 className="text-xl font-black mb-2">Trust Verified</h4>
                                <p className="text-sm text-muted-foreground font-medium leading-normal">
                                    This resource has been vetted by our fact-checking community and educational experts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
