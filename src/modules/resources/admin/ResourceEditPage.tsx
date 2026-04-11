import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, BookOpen, ExternalLink, Type, Clock, Loader2 } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { SUPPORTED_LANGUAGE_CODES, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from "@/shared/i18n/languages";

const resourceSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    type: z.enum(["guide", "video", "course"]),
    description: z.string().min(10, "Description must be at least 10 characters"),
    duration: z.string().min(2, "Duration is required"),
    badge: z.string().optional().or(z.literal("")),
    icon: z.string().min(2, "Icon name is required"),
    fullContent: z.string().optional().or(z.literal("")),
    linkUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    language: z.enum(SUPPORTED_LANGUAGE_CODES as unknown as [string, ...string[]], {
        message: "Please select a language",
    }),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

export default function ResourceEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: "",
            slug: "",
            type: "guide",
            description: "",
            duration: "",
            badge: "",
            icon: "BookOpen",
            fullContent: "",
            linkUrl: "",
            language: DEFAULT_LANGUAGE,
        },
    });

    useEffect(() => {
        const fetchResource = async () => {
            if (!id) return;
            try {
                const resource = await adminService.getResourceById(id);
                form.reset({
                    title: resource.title,
                    slug: resource.slug,
                    type: resource.type,
                    description: resource.description,
                    duration: resource.duration,
                    badge: resource.badge || "",
                    icon: resource.icon,
                    fullContent: resource.fullContent || "",
                    linkUrl: resource.linkUrl || "",
                    language: resource.language || DEFAULT_LANGUAGE,
                });
            } catch (error) {
                console.error("Failed to fetch resource:", error);
                toast.error("Failed to load resource data");
                navigate("/dashboard/resources/library");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResource();
    }, [id, form, navigate]);

    const onSubmit = async (values: ResourceFormValues) => {
        if (!id) return;
        setIsSaving(true);
        try {
            await adminService.updateResource(id, { ...values, language: values.language as LanguageCode });
            toast.success("Resource updated successfully");
            navigate("/dashboard/resources/library");
        } catch (error) {
            console.error("Failed to update resource:", error);
            toast.error("Failed to update resource");
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