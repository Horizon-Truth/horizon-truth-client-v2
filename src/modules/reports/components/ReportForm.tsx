import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useLanguageStore } from "@/store/language.store";
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
    reason: z.string().optional(),
    category: z.string().optional(),
    reportedContentReference: z.string().optional(),
    evidenceLinks: z.array(z.string()).optional(),
    tagIds: z.array(z.string()).min(1, { message: "Select at least one tag" }),
    consent: z.boolean().refine(val => val === true, {
        message: "You must confirm before submitting",
    }),
});

interface ReportFormProps {
    onSuccess: () => void;
    onRequireAuth: () => void;
    onCancel: () => void;
    /** Increments each time authentication completes, so a pending submission can resume. */
    authResolvedSignal?: number;
}

/**
 * Resolve the navbar/system language code (en/am/om) to the matching option in
 * the report `languages` table. Codes can differ (e.g. Afaan Oromo is `om` in
 * the UI language store but seeded as `or` here), so fall back through known
 * aliases before defaulting to the first available language.
 */
function resolveReportLanguageCode(
    systemLanguage: string,
    available: Language[],
): string | undefined {
    if (available.length === 0) return undefined;
    const aliases: Record<string, string[]> = {
        om: ["om", "or"],
        or: ["or", "om"],
    };
    const candidates = aliases[systemLanguage] ?? [systemLanguage];
    const match = available.find((l) => candidates.includes(l.code));
    return (match ?? available[0]).code;
}

export function ReportForm({ onSuccess, onRequireAuth, onCancel, authResolvedSignal }: ReportFormProps) {
    const { isAuthenticated } = useAuthStore();
    const systemLanguage = useLanguageStore((s) => s.language);
    const [tags, setTags] = useState<ReportTag[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    // Holds the form values captured when a guest tried to submit, so we can resume after login.
    const [pendingValues, setPendingValues] = useState<z.infer<typeof reportSchema> | null>(null);

    const form = useForm<z.infer<typeof reportSchema>>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            title: "",
            description: "",
            contentType: "ARTICLE",
            sourceUrl: "",
            language: systemLanguage,
            reason: "",
            category: "False Information",
            reportedContentReference: "",
            evidenceLinks: [],
            tagIds: [],
            consent: false,
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
                // Language defaulting is handled by the system-language sync effect below.
                setLanguages(langsRes.data);
            } catch (error) {
                toast.error("Failed to load form data");
            } finally {
                setFetchingData(false);
            }
        }
        loadData();
    }, []);

    // Keep the report language in sync when the user switches the navbar language.
    useEffect(() => {
        const resolved = resolveReportLanguageCode(systemLanguage, languages);
        if (resolved) {
            form.setValue("language", resolved, { shouldValidate: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [systemLanguage, languages]);

    async function submitReport(values: z.infer<typeof reportSchema>) {
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

    function onSubmit(values: z.infer<typeof reportSchema>) {
        // Guests can fill out the form; auth is only enforced at submission time.
        if (!isAuthenticated) {
            setPendingValues(values); // keep the entered data so we can resume after login
            toast.info("Please login or register to submit your report");
            onRequireAuth();
            return;
        }
        submitReport(values);
    }

    // Resume the held submission once the user has authenticated via the modal.
    useEffect(() => {
        if (isAuthenticated && pendingValues) {
            const values = pendingValues;
            setPendingValues(null);
            submitReport(values);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authResolvedSignal]);

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
                        name="reason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Report Reason</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Example: False Information"
                                        className="bg-background/50 border-none ring-1 ring-border focus-visible:ring-primary h-14 rounded-2xl font-bold transition-all"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Category</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="False Information"
                                        className="bg-background/50 border-none ring-1 ring-border focus-visible:ring-primary h-14 rounded-2xl font-bold transition-all"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="reportedContentReference"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Reported Content Reference</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Claim, post, profile, or URL"
                                        className="bg-background/50 border-none ring-1 ring-border focus-visible:ring-primary h-14 rounded-2xl font-bold transition-all"
                                        {...field}
                                    />
                                </FormControl>
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

                <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-border/50 p-4 bg-background/30 backdrop-blur-sm transition-all hover:bg-background/50">
                            <FormControl>
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </div>
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-[11px] font-medium leading-relaxed text-muted-foreground cursor-pointer select-none">
                                    I confirm that this report is based on my genuine belief about the content described, and that any evidence I have attached does not contain other people's personal data without their consent. I understand this report and any attached evidence will be stored and reviewed as described in the{" "}
                                    <button
                                        type="button"
                                        className="text-primary font-bold hover:underline underline-offset-4"
                                    >
                                        Privacy Policy
                                    </button>
                                    .
                                </FormLabel>
                                <FormMessage className="text-[10px] font-bold" />
                            </div>
                        </FormItem>
                    )}
                />

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
