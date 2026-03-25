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
    isActive: z.boolean(),
});

interface LanguageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    language?: Language | null;
    onSuccess: () => void;
}

export function LanguageDialog({ open, onOpenChange, language, onSuccess }: LanguageDialogProps) {
    const [loading, setLoading] = useState(false);

    type LanguageFormValues = z.infer<typeof languageSchema>;

    const form = useForm<LanguageFormValues>({
        resolver: zodResolver(languageSchema),
        defaultValues: {
            name: "",
            code: "",
            isActive: true,