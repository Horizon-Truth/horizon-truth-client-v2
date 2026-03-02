import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { Button } from "@/shared/components/ui/button";
import { blogs } from "./mockData";
import { toast } from "sonner";

export default function BlogDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const blog = blogs.find(b => b.id === id);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    if (!blog) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Blog not found</h1>
                        <Button onClick={() => navigate("/resources")}>Back to Resources</Button>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <PublicLayout>
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-[0%]"
                style={{ scaleX }}
            />

            <article className="pt-32 pb-20 bg-background overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/resources")}
                            className="group gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Hub
                        </Button>

                        <div className="flex items-center gap-4 text-sm font-black text-primary uppercase tracking-[0.2em]">
                            <span className="px-3 py-1 bg-primary/10 rounded-full">{blog.category}</span>
                            <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {blog.readTime}</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1]">
                            {blog.title}
                        </h1>

                        <div className="flex items-center gap-4 py-8 border-y">
                            <img src={blog.author.avatar} className="w-12 h-12 rounded-full object-cover shadow-lg" alt={blog.author.name} />
                            <div>
                                <p className="font-black text-foreground">{blog.author.name}</p>
                                <p className="text-sm text-muted-foreground font-medium">{blog.author.role}</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full" onClick={copyLink}>
                                    <LinkIcon size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Twitter size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Facebook size={18} />
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="my-12 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <img src={blog.image} alt={blog.title} className="w-full aspect-video object-cover" />
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-blockquote:font-black prose-blockquote:italic prose-blockquote:text-primary prose-blockquote:border-primary/20"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>
            </article>
        </PublicLayout>
    );
}
