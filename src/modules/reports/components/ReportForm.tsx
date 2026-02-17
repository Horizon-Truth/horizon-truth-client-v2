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
import type { ReportTag } from "@/services/report.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const reportSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    contentType: z.string().min(1, { message: "Content type is required" }),
    sourceUrl: z.string().url().optional().or(z.literal("")),
    language: z.string().min(2, { message: "Language is required" }),
    tagIds: z.array(z.string()).min(1, { message: "Select at least one tag" }),
});

interface ReportFormProps {
    onSuccess: () => void;
    onRequireAuth: () => void;
}

export function ReportForm({ onSuccess, onRequireAuth }: ReportFormProps) {
    const { isAuthenticated } = useAuthStore();
    const [tags, setTags] = useState<ReportTag[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingTags, setFetchingTags] = useState(true);

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
        async function loadTags() {
            try {
                const data = await reportService.getReportTags();
                setTags(data.data);
            } catch (error) {
                toast.error("Failed to load report tags");
            } finally {
                setFetchingTags(false);
            }
        }
        loadTags();
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

    if (fetchingTags) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card/50 p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="What are you reporting?" className="bg-background/50 border-white/10 h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</FormLabel>
                                <FormControl>
                                    <textarea
                                        className="flex min-h-[120px] w-full rounded-xl border border-white/10 bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Provide more details..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contentType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content Type</FormLabel>
                                <select
                                    className="flex h-11 w-full rounded-xl border border-white/10 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                                    {...field}
                                >
                                    <option value="ARTICLE">Article</option>
                                    <option value="POST">Social Media Post</option>
                                    <option value="VIDEO">Video</option>
                                    <option value="IMAGE">Image</option>
                                    <option value="COMMENT">Comment</option>
                                </select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Language</FormLabel>
                                <Input placeholder="e.g. en, fr, es" className="bg-background/50 border-white/10 h-11" {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sourceUrl"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Source URL (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." className="bg-background/50 border-white/10 h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="md:col-span-2">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">Tags</FormLabel>
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
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${form.watch("tagIds").includes(tag.id)
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/5"
                                        }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                        <FormMessage className="mt-2">
                            {form.formState.errors.tagIds?.message}
                        </FormMessage>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting Report...
                        </>
                    ) : (
                        "Submit Report"
                    )}
                </Button>
            </form>
        </Form>
    );
}
