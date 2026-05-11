import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Image as ImageIcon, User, Hash, Calendar, Loader2 } from "lucide-react";
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
import { SUPPORTED_LANGUAGE_CODES, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from "@/shared/i18n/languages";

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
    language: z.enum(SUPPORTED_LANGUAGE_CODES as unknown as [string, ...string[]], {
        message: "Please select a language",
    }),
    publishedAt: z.string().min(10, "Published date is required"),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function BlogEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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
            readTime: "",
            language: DEFAULT_LANGUAGE,
            publishedAt: "",
        },
    });

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                const blog = await adminService.getBlogById(id);
                form.reset({
                    title: blog.title,
                    slug: blog.slug,
                    excerpt: blog.excerpt,
                    content: blog.content,
                    authorName: blog.authorName,
                    authorRole: blog.authorRole,
                    authorAvatar: blog.authorAvatar || "",
                    imageUrl: blog.imageUrl || "",
                    category: blog.category,
                    readTime: blog.readTime,
                    language: blog.language || DEFAULT_LANGUAGE,
                    publishedAt: new Date(blog.publishedAt).toISOString().split("T")[0],
                });
            } catch (error) {
                console.error("Failed to fetch blog:", error);
                toast.error("Failed to load blog post data");
                navigate("/dashboard/resources/blogs");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [id, form, navigate]);

    const onSubmit = async (values: BlogFormValues) => {
        if (!id) return;
        setIsSaving(true);
        try {
            await adminService.updateBlog(id, { ...values, language: values.language as LanguageCode });
            toast.success("Blog post updated successfully");
            navigate("/dashboard/resources/blogs");
        } catch (error) {
            console.error("Failed to update blog:", error);
            toast.error("Failed to update blog post");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

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
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase text-primary">Edit <span className="text-foreground">Article</span></h2>
                        <p className="text-sm text-muted-foreground mt-1">Update metadata and content for the decentralized knowledge hub.</p>
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
                        disabled={isSaving}
                        className="flex-1 sm:flex-none rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
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