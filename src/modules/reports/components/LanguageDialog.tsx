import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { reportService, type Language } from "@/services/report.service";

const languageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code is too long"),
    isActive: z.boolean().default(true),
});

interface LanguageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    language?: Language | null;
    onSuccess: () => void;
}

export function LanguageDialog({ open, onOpenChange, language, onSuccess }: LanguageDialogProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof languageSchema>>({
        resolver: zodResolver(languageSchema),
        defaultValues: {
            name: "",
            code: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (open) {
            if (language) {
                form.reset({
                    name: language.name,
                    code: language.code,
                    isActive: language.isActive,
                });
            } else {
                form.reset({
                    name: "",
                    code: "",
                    isActive: true,
                });
            }
        }
    }, [open, language, form]);

    async function onSubmit(values: z.infer<typeof languageSchema>) {
        setLoading(true);
        try {
            if (language) {
                await reportService.updateLanguage(language.id, values);
                toast.success("Language updated successfully");
            } else {
                await reportService.createLanguage(values);
                toast.success("Language created successfully");
            }
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save language");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{language ? "Edit Language" : "Add Language"}</DialogTitle>
                    <DialogDescription>
                        {language ? "Make changes to the language here." : "Add a new language to the system."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="English" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="en" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active Status</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {language ? "Save Changes" : "Create Language"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
