import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Search, Filter, MoreVertical, Trash2, Edit2, Calendar, User, Tag, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type Blog } from "@/services/admin.service";
import { toast } from "sonner";

export default function BlogManagementPage() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getBlogs();
            setBlogs(data || []);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
            toast.error("Failed to load blog posts");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (blog: Blog) => {
        if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) return;
        try {
            await adminService.deleteBlog(blog.id);
            toast.success("Blog post deleted successfully");
            fetchBlogs();
        } catch (error) {
            toast.error("Failed to delete blog post");
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" || blog.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(blogs.map(b => b.category)));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase tracking-wider text-primary">Content <span className="text-foreground">Engine</span></h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage platform blog posts and informative articles.</p>
                </div>
                <Button
                    onClick={() => navigate("/dashboard/resources/blogs/create")}
                    className="w-full sm:w-auto rounded-2xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-black uppercase tracking-widest text-[10px]"
                >
                    <Plus size={20} />
                    Create New Article
                </Button>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-card border border-border/50 p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search articles by title, author, or category..."
                        className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 px-4 h-12 border-t md:border-t-0 md:border-l border-border/50">
                    <Filter size={18} className="text-muted-foreground" />
                    <select
                        className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-bold uppercase tracking-wider outline-none"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Article Metadata</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classification</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Metrics</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timeline</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Retrieving Assets...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBlogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <FileText size={40} className="text-muted-foreground/30" />
                                            <p className="text-sm font-bold text-muted-foreground">No blog records found in the current vector.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBlogs.map((blog) => (
                                <tr key={blog.id} className="group hover:bg-accent/5 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-14 rounded-xl overflow-hidden border border-border/50 shrink-0 shadow-sm">
                                                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-extrabold text-lg tracking-tight truncate group-hover:text-primary transition-colors">{blog.title}</p>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium grayscale group-hover:grayscale-0 transition-all">
                                                    <User size={12} />
                                                    {blog.authorName} ({blog.authorRole})
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className="rounded-lg h-7 px-3 font-black tracking-widest text-[9px] uppercase border-primary/20 bg-primary/5 text-primary">
                                            <Tag size={10} className="mr-1.5" />
                                            {blog.category}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            <Clock size={14} className="text-primary/60" />
                                            {blog.readTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <Calendar size={14} className="text-primary/60" />
                                            {new Date(blog.publishedAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2 text-primary">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl hover:bg-primary/10 transition-colors"
                                                title="Edit Article"
                                                onClick={() => navigate(`/dashboard/resources/blogs/edit/${blog.id}`)}
                                            >
                                                <Edit2 size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                onClick={() => handleDelete(blog)}
                                                title="Delete Article"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
