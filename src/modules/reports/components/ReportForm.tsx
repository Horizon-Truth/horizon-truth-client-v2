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