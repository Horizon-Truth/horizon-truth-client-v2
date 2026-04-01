import { useEffect, useState } from "react";
import { Mail, Trash2, Search, Calendar, MessageSquare, Tag, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { contactService, type ContactSubmission } from "@/services/contact.service";
import ContactDetailDialog from "../components/ContactDetailDialog";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
    new: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    read: "border-border bg-muted/50 text-muted-foreground",
    replied: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
};

export default function ContactSubmissionsPage() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState<ContactSubmission | null>(null);