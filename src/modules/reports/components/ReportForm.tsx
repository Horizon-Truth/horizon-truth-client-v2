import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { reportService } from "@/services/report.service";
import type { ReportTag, Language } from "@/services/report.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const reportSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    contentType: z.string().min(1, { message: "Content type is required" }),
    sourceUrl: z.string().url().optional().or(z.literal("")),
    language: z.string().min(1, { message: "Language is required" }),
    tagIds: z.array(z.string()).min(1, { message: "Select at least one tag" }),
});

interface ReportFormProps {
    onSuccess: () => void;
    onRequireAuth: () => void;
    onCancel: () => void;
}

export function ReportForm({ onSuccess, onRequireAuth, onCancel }: ReportFormProps) {
    const { isAuthenticated } = useAuthStore();
    const [tags, setTags] = useState<ReportTag[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    const form = useForm<z.infer<typeof reportSchema>>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            title: "",
            description: "",
            contentType: "ARTICLE",
            sourceUrl: "",
            language: "en",
            tagIds: [],
        },
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [tagsRes, langsRes] = await Promise.all([
                    reportService.getReportTags(),
                    reportService.getLanguages()
                ]);
                setTags(tagsRes.data);
                setLanguages(langsRes.data);

                if (langsRes.data.length > 0) {
                    form.setValue("language", langsRes.data[0].code);
                }
            } catch (error) {
                toast.error("Failed to load form data");
            } finally {
                setFetchingData(false);
            }
        }
        loadData();
    }, []);

    async function onSubmit(values: z.infer<typeof reportSchema>) {
        if (!isAuthenticated) {
            toast.info("Please login or register to submit a report");
            onRequireAuth();
            return;
        }

        setLoading(true);
        try {
            await reportService.submitReport({
                ...values,
                sourceUrl: values.sourceUrl || undefined,
            });
            toast.success("Report submitted successfully!");
            form.reset();
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit report");
        } finally {
            setLoading(false);
        }
    }

    if (fetchingData) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Dossier Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Identify the incident..."
                                        className="bg-background/50 border-none ring-1 ring-border focus-visible:ring-primary h-14 rounded-2xl font-bold transition-all"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Narrative Context</FormLabel>
                                <FormControl>
                                    <textarea
                                        className="flex min-h-[160px] w-full rounded-[2rem] border-none ring-1 ring-border bg-background/50 px-5 py-4 text-sm font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                        placeholder="Provide comprehensive details regarding the reported content..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contentType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Intelligence Type</FormLabel>
                                <select
                                    className="flex h-14 w-full rounded-2xl border-none ring-1 ring-border bg-background/50 px-4 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 appearance-none cursor-pointer transition-all"
                                    {...field}
                                >
                                    <option value="ARTICLE">Online Article</option>
                                    <option value="POST">Social Media Post</option>
                                    <option value="VIDEO">Multimedia / Video</option>
                                    <option value="IMAGE">Visual Content / Image</option>
                                    <option value="COMMENT">Comment / Discussion</option>
                                </select>
                                <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Source Language</FormLabel>
                                <FormControl>
                                    <select
                                        className="flex h-14 w-full rounded-2xl border-none ring-1 ring-border bg-background/50 px-4 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 appearance-none cursor-pointer transition-all"
                                        {...field}
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.id} value={lang.code}>
                                                {lang.name.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sourceUrl"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Verification Link (URL)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://source-of-content.com/..."
                                        className="bg-background/50 border-none ring-1 ring-border focus-visible:ring-primary h-14 rounded-2xl font-bold transition-all"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tagIds"
                        render={() => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">Classification Tags</FormLabel>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => {
                                                const currentTags = form.getValues("tagIds");
                                                const newTags = currentTags.includes(tag.id)
                                                    ? currentTags.filter((id) => id !== tag.id)
                                                    : [...currentTags, tag.id];
                                                form.setValue("tagIds", newTags, { shouldValidate: true });
                                            }}
                                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${form.watch("tagIds").includes(tag.id)
                                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border/50"
                                                }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                                <FormMessage className="mt-4 text-[10px] font-bold uppercase tracking-tighter" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-border/30">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="w-full sm:flex-1 h-14 rounded-2xl font-black uppercase tracking-widest hover:bg-muted transition-all text-xs"
                        disabled={loading}
                    >
                        Abort Intake
                    </Button>
                    <Button
                        type="submit"
                        className="w-full sm:flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98] text-xs"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                Processing Dossier...
                            </>
                        ) : (
                            "Commit Intelligence Report"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
