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
    /** Called whenever the submission changes server-side (read / replied). */
    onUpdated: (submission: ContactSubmission) => void;
}

const formatDateTime = (value?: string | null) =>
    value ? new Date(value).toLocaleString() : "N/A";

export default function ContactDetailDialog({
    submission,
    open,
    onOpenChange,
    onUpdated,
}: ContactDetailDialogProps) {
    const [detail, setDetail] = useState<ContactSubmission | null>(submission);
    const [replySubject, setReplySubject] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setDetail(submission);
        setReplySubject(submission ? `Re: ${submission.subject}` : "");
        setReplyMessage("");