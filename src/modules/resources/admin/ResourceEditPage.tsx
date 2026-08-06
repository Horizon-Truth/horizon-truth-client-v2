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
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/dashboard/resources/library")}
                        className="rounded-xl hover:bg-secondary/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase text-secondary">Edit <span className="text-foreground">Asset</span></h2>
                        <p className="text-sm text-muted-foreground mt-1">Update specifications and link intelligence for the resource library.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/resources/library")}
                        className="flex-1 sm:flex-none rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Properties */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card border border-border/50 p-6 rounded-[2rem] shadow-sm space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary/60 flex items-center gap-2">
                                <BookOpen size={14} /> Classification
                            </h3>

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Asset Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="guide">Technical Guide</SelectItem>
                                                <SelectItem value="video">Intelligence Briefing (Video)</SelectItem>
                                                <SelectItem value="course">Training Course</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Asset Duration</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                                <Input {...field} placeholder="e.g. 15 min" className="pl-9 h-11 rounded-xl bg-muted/30 border-none" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="badge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Access Level (Badge)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. Clearance Level 1" className="h-11 rounded-xl bg-muted/30 border-none" />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Language *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none font-bold uppercase tracking-widest text-[10px]">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-border/50 shadow-xl">
                                                {SUPPORTED_LANGUAGES.map((lang) => (
                                                    <SelectItem key={lang.code} value={lang.code} className="font-bold uppercase tracking-widest text-[10px]">
                                                        {lang.englishName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Lucide Icon Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                                <Input {...field} placeholder="BookOpen, Video, Shield..." className="pl-9 h-11 rounded-xl bg-muted/30 border-none" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-card border border-border/50 p-6 rounded-[2rem] shadow-sm space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary/60 flex items-center gap-2">
                                <ExternalLink size={14} /> External Links
                            </h3>

                            <FormField
                                control={form.control}
                                name="linkUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Reference URL</FormLabel>
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
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Asset Designation (Title)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Quantum Encryption Fundamentals"
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
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Protocol Identifier (Slug)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="quantum-encryption-fundamentals" className="font-mono text-xs h-10 rounded-xl bg-muted/30 border-none" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Asset Abstract</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Executive summary of the intelligence asset..."
                                                className="min-h-[120px] rounded-2xl bg-muted/20 border-border/30 resize-none font-medium leading-relaxed"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fullContent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Technical Documentation (HTML Enabled)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="<p>Full technical documentation details...</p>"
                                                className="min-h-[300px] rounded-[2rem] bg-muted/10 border-border/30 font-mono text-sm leading-relaxed p-6"
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
