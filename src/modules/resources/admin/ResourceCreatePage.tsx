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
        try {
            await adminService.createResource({ ...values, language: values.language as LanguageCode });
            toast.success("Resource created successfully");
            navigate("/dashboard/resources/assets");
        } catch (error) {
            console.error("Failed to create resource:", error);
            toast.error("Failed to create resource");
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
                        onClick={() => navigate("/dashboard/resources/assets")}
                        className="rounded-xl hover:bg-secondary/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase text-secondary">Onboard <span className="text-foreground">New Asset</span></h2>
                        <p className="text-sm text-muted-foreground mt-1">Register new educational toolkits, guides, or training assets.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/resources/assets")}
                        className="flex-1 sm:flex-none rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]"
                    >
                        Abort
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="flex-1 sm:flex-none rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                        <Save size={16} />
                        Sync to Registry
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Classification */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card border border-border/50 p-6 rounded-[2rem] shadow-sm space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary/60 flex items-center gap-2">
                                <Type size={14} /> Classification
                            </h3>

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Asset Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none font-bold uppercase tracking-widest text-[10px]">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-border/50 shadow-xl">
                                                <SelectItem value="guide" className="font-bold uppercase tracking-widest text-[10px]">Guide</SelectItem>
                                                <SelectItem value="video" className="font-bold uppercase tracking-widest text-[10px]">Video</SelectItem>
                                                <SelectItem value="course" className="font-bold uppercase tracking-widest text-[10px]">Course</SelectItem>
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
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Duration / Effort</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                                <Input {...field} placeholder="e.g. 15 min read" className="pl-9 h-11 rounded-xl bg-muted/30 border-none" />
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
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Success Badge (Optional)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. Most Popular" className="h-11 rounded-xl bg-muted/30 border-none" />
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
                        </div>

                        <div className="bg-card border border-border/50 p-6 rounded-[2rem] shadow-sm space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary/60 flex items-center gap-2">
                                <BookOpen size={14} /> UI Identity
                            </h3>

                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Lucide Icon Identifier</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="FileText, Video, GraduationCap..." className="h-11 rounded-xl bg-muted/30 border-none font-mono text-xs" />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="linkUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">External Resource URI</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                                <Input {...field} placeholder="https://..." className="pl-9 h-11 rounded-xl bg-muted/30 border-none" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Right Column: Narrative Definition */}
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
                                                    placeholder="The Misinformation Playbook"
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
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Registry Identifier (Slug)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="the-misinformation-playbook" className="font-mono text-xs h-10 rounded-xl bg-muted/30 border-none" />
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
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Brief Abstract</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Concise description for the component grid..."
                                                className="min-h-[100px] rounded-2xl bg-muted/20 border-border/30 resize-none font-medium leading-relaxed"
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
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Extended Content (MD/HTML Supported)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Detailed asset information..."
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
