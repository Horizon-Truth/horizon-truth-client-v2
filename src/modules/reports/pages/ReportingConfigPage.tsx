import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Languages, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { reportService, type Language, type ReportTag } from "@/services/report.service";
import { LanguageDialog } from "../components/LanguageDialog";
import { TagDialog } from "../components/TagDialog";

export default function ReportingConfigPage() {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [tags, setTags] = useState<ReportTag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);