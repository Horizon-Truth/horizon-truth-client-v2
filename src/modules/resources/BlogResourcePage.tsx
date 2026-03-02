import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Clock, ArrowRight, GraduationCap, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { Button } from "@/shared/components/ui/button";
import { adminService, type Blog, type Resource } from "@/services/admin.service";
import * as LucideIcons from "lucide-react";

export default function BlogResourcePage() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [blogsData, resourcesData] = await Promise.all([
                    adminService.getBlogs(),
                    adminService.getResources()
                ]);
                setBlogs(blogsData || []);
                setResources(resourcesData || []);
            } catch (error) {
                console.error("Failed to fetch knowledge hub data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Synchronizing Knowledge Base...</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <section className="py-20 bg-primary/5 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Knowledge <span className="text-primary">Hub</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Explore our latest insights, research, and educational resources dedicated to digital integrity and misinformation defense.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-16">

                        {/* Blog List (2/3 Column) */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="flex items-center justify-between border-b pb-8">
                                <h2 className="text-4xl font-black tracking-tighter">Latest <span className="text-primary italic">Articles</span></h2>
                                <div className="relative w-full max-w-xs hidden md:block">
                                    <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border bg-secondary/5 focus:ring-2 focus:ring-primary focus:outline-none text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-12">
                                {blogs.map((blog, i) => (
                                    <motion.div
                                        key={blog.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="group cursor-pointer"
                                        onClick={() => navigate(`/blog/${blog.id}`)}
                                    >
                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="md:w-1/3 aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl">
                                                <img
                                                    src={blog.imageUrl}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="md:w-2/3 space-y-4">
                                                <div className="flex items-center gap-4 text-xs font-black text-primary uppercase tracking-widest">
                                                    <span>{blog.category}</span>
                                                    <span className="w-1 h-1 bg-primary/30 rounded-full" />
                                                    <span>{blog.readTime}</span>
                                                </div>
                                                <h3 className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-lg text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                                    {blog.excerpt}
                                                </p>
                                                <div className="flex items-center gap-3 pt-2">
                                                    {blog.authorAvatar && <img src={blog.authorAvatar} alt={blog.authorName} className="w-8 h-8 rounded-full object-cover" />}
                                                    <span className="text-sm font-black">{blog.authorName}</span>
                                                    <span className="text-sm text-muted-foreground ml-auto flex items-center gap-1">
                                                        Read More <LucideIcons.ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Resources Sidebar (1/3 Column) */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-32 space-y-12">
                                <div className="p-10 rounded-[2.5rem] bg-secondary/5 border-2 border-secondary/10 backdrop-blur-xl">
                                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                        <LucideIcons.GraduationCap className="text-secondary" size={24} />
                                        Resources
                                    </h3>

                                    <div className="space-y-6">
                                        {resources.slice(0, 4).map((resource, i) => {
                                            const Icon = (LucideIcons as any)[resource.icon] || LucideIcons.FileText;
                                            return (
                                                <motion.div
                                                    key={resource.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                                    className="group p-5 rounded-2xl bg-white dark:bg-white/5 border border-transparent hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer"
                                                    onClick={() => navigate(`/resource/${resource.id}`)}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0 group-hover:scale-110 transition-transform">
                                                            <Icon size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{resource.type}</span>
                                                                {resource.badge && (
                                                                    <span className="text-[10px] bg-secondary/20 text-secondary font-black px-1.5 py-0.5 rounded leading-none">{resource.badge}</span>
                                                                )}
                                                            </div>
                                                            <h4 className="font-black text-sm group-hover:text-primary transition-colors line-clamp-1">{resource.title}</h4>
                                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                                                                <LucideIcons.Clock size={10} /> {resource.duration}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full mt-10 rounded-2xl py-6 font-black border-2 group"
                                        onClick={() => navigate("/resources/library")}
                                    >
                                        View All Library <LucideIcons.ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={18} />
                                    </Button>
                                </div>

                                {/* Newsletter Card */}
                                <div className="p-10 rounded-[2.5rem] bg-primary text-primary-foreground shadow-2xl overflow-hidden relative group">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                    <h3 className="text-2xl font-black mb-4 relative z-10">Stay Alerted.</h3>
                                    <p className="font-medium opacity-80 mb-8 relative z-10">Get the latest misinformation alerts and verification guides weekly.</p>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 mb-4 relative z-10"
                                    />
                                    <Button variant="secondary" className="w-full rounded-xl py-6 font-black relative z-10">Subscribe</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
