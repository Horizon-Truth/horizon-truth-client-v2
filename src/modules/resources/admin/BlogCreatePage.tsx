import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Image as ImageIcon, User, Hash, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

const blogSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
    content: z.string().min(20, "Content must be at least 20 characters"),
    authorName: z.string().min(2, "Author name is required"),
    authorRole: z.string().min(2, "Author role is required"),
    authorAvatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    category: z.string().min(2, "Category is required"),
    readTime: z.string().min(2, "Read time is required"),
    publishedAt: z.string().min(10, "Published date is required"),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function BlogCreatePage() {
    const navigate = useNavigate();
    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            authorName: "",
            authorRole: "",
            authorAvatar: "",
            imageUrl: "",
            category: "",
            readTime: "5 min read",
            publishedAt: new Date().toISOString().split("T")[0],
        },
    });

    const onSubmit = async (values: BlogFormValues) => {
        try {
            await adminService.createBlog(values);
            toast.success("Blog post created successfully");
            navigate("/dashboard/resources/blogs");
        } catch (error) {
            console.error("Failed to create blog:", error);
            toast.error("Failed to create blog post");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/dashboard/resources/blogs")}
                        className="rounded-xl hover:bg-primary/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase text-primary">Draft <span className="text-foreground">New Article</span></h2>
                        <p className="text-sm text-muted-foreground mt-1">Configure metadata and content for the decentralized knowledge hub.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/resources/blogs")}
                        className="flex-1 sm:flex-none rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="flex-1 sm:flex-none rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20"
                    >
                        <Save size={16} />
                        Publish Article
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Metadata */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card border border-border/50 p-6 rounded-[2rem] shadow-sm space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
                                <Hash size={14} /> Taxonomy & Details
                            </h3>

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Category</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. Technology" className="h-11 rounded-xl bg-muted/30 border-none" />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="readTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Read Time</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. 5 min read" className="h-11 rounded-xl bg-muted/30 border-none" />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="publishedAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Publish Date</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                                <Input {...field} type="date" className="pl-9 h-11 rounded-xl bg-muted/30 border-none" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-card border border-border/50 p-6 rounded-[2rem] shadow-sm space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
                                <User size={14} /> Author Profile
                            </h3>

                            <FormField
                                control={form.control}
                                name="authorName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Sarah Chen" className="h-11 rounded-xl bg-muted/30 border-none" />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="authorRole"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Professional Role</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="AI Researcher" className="h-11 rounded-xl bg-muted/30 border-none" />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="authorAvatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Avatar URI</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="https://..." className="h-11 rounded-xl bg-muted/30 border-none" />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Right Column: Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-card border border-border/50 p-8 rounded-[2.5rem] shadow-sm space-y-8">
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Article Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="The Future of Synthetic Reality"
                                                    className="text-2xl font-black h-16 rounded-2xl bg-muted/20 border-border/30 focus:bg-background transition-all"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        form.setValue("slug", e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">URL Semantic (Slug)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="the-future-of-synthetic-reality" className="font-mono text-xs h-10 rounded-xl bg-muted/30 border-none" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Featured Graphics URI</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <Input {...field} placeholder="https://unsplash.com/..." className="pl-12 h-14 rounded-2xl bg-muted/20 border-border/30" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="excerpt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Executive Summary</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Brief overview for the knowledge grid card..."
                                                className="min-h-[100px] rounded-2xl bg-muted/20 border-border/30 resize-none font-medium leading-relaxed"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Full Discourse (HTML Enabled)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="<p>Begin the narrative here...</p>"
                                                className="min-h-[400px] rounded-[2rem] bg-muted/10 border-border/30 font-mono text-sm leading-relaxed p-6"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
