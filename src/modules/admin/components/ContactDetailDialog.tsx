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
    }, [submission]);

    // Opening a submission is what marks it read — do it once per open.
    useEffect(() => {
        if (!open || !submission?.id || submission.status !== "new") return;
        contactService
            .markAsRead(submission.id)
            .then((updated) => {
                setDetail((current) => ({ ...current, ...updated }));
                onUpdated(updated);
            })
            .catch(() => {
                /* Non-critical: the message is still fully readable. */
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, submission?.id]);

    const handleSendReply = async () => {
        if (!detail?.id) return;

        const message = replyMessage.trim();
        if (!message) {
            toast.error("Write a message before sending.");
            return;
        }

        setIsSending(true);
        try {