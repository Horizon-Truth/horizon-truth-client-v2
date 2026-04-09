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