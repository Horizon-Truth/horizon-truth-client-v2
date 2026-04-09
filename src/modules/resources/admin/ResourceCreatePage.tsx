import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, BookOpen, ExternalLink, Type, Clock } from "lucide-react";
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
import { SUPPORTED_LANGUAGE_CODES, SUPPORTED_LANGUAGES, type LanguageCode } from "@/shared/i18n/languages";
import { useLanguageStore } from "@/store/language.store";

const resourceSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    type: z.enum(["guide", "video", "course"]),
    description: z.string().min(10, "Description must be at least 10 characters"),
    duration: z.string().min(2, "Duration is required"),
    badge: z.string().optional().or(z.literal("")),
    icon: z.string().min(2, "Icon name is required (e.g. FileText)"),
    fullContent: z.string().optional().or(z.literal("")),
    linkUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    language: z.enum(SUPPORTED_LANGUAGE_CODES as unknown as [string, ...string[]], {
        message: "Please select a language",
    }),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

export default function ResourceCreatePage() {
    const navigate = useNavigate();
    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: "",
            slug: "",
            type: "guide",
            description: "",
            duration: "10 min read",
            badge: "",
            icon: "FileText",
            fullContent: "",
            linkUrl: "",
            language: useLanguageStore.getState().language,
        },
    });

    const onSubmit = async (values: ResourceFormValues) => {