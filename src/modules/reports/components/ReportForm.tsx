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