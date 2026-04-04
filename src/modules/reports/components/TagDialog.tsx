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
import { reportService, type ReportTag } from "@/services/report.service";

const tagSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    isActive: z.boolean(),
});

interface TagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tag?: ReportTag | null;
    onSuccess: () => void;
}

export function TagDialog({ open, onOpenChange, tag, onSuccess }: TagDialogProps) {
    const [loading, setLoading] = useState(false);

    type TagFormValues = z.infer<typeof tagSchema>;

    const form = useForm<TagFormValues>({
        resolver: zodResolver(tagSchema),
        defaultValues: {
            name: "",
            slug: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (open) {
            if (tag) {
                form.reset({
                    name: tag.name,
                    slug: tag.slug,
                    isActive: tag.isActive,
                });
            } else {
                form.reset({
                    name: "",
                    slug: "",
                    isActive: true,
                });
            }
        }
    }, [open, tag, form]);

    async function onSubmit(values: z.infer<typeof tagSchema>) {
        setLoading(true);
        try {
            if (tag) {
                await reportService.updateReportTag(tag.id, values);
                toast.success("Tag updated successfully");
            } else {
                await reportService.createReportTag(values);
                toast.success("Tag created successfully");
            }
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save tag");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{tag ? "Edit Tag" : "Add Tag"}</DialogTitle>
                    <DialogDescription>