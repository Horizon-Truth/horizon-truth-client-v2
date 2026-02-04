import { useEffect, useState } from "react";
import { Mail, Calendar, Tag, Send, CornerUpLeft, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import {
    contactService,
    type ContactSubmission,
} from "@/services/contact.service";
import { toast } from "sonner";

interface ContactDetailDialogProps {
    submission: ContactSubmission | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;