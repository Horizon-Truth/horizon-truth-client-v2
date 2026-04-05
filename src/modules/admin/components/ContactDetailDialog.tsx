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
            await contactService.reply(detail.id, {
                subject: replySubject.trim() || undefined,
                message,
            });
            const refreshed = await contactService.getOne(detail.id);
            setDetail(refreshed);
            onUpdated(refreshed);
            setReplyMessage("");
            toast.success(`Reply sent to ${detail.email}`);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                "Failed to send the reply. Check the mail server configuration."
            );
        } finally {
            setIsSending(false);
        }
    };

    if (!detail) return null;

    const replies = detail.replies ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[1.5rem] sm:rounded-[2rem] p-0 gap-0">
                <DialogHeader className="p-6 sm:p-8 pb-5 border-b border-border/50 space-y-4">
                    <div className="flex items-start gap-4 pr-8">
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg uppercase">
                            {detail.firstName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-lg font-black tracking-tight text-left">
                                {detail.firstName} {detail.lastName}
                            </DialogTitle>
                            <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px]">
                                <span className="flex items-center gap-1.5">
                                    <Mail size={11} />
                                    <a
                                        href={`mailto:${detail.email}`}
                                        className="hover:text-primary transition-colors break-all"
                                    >
                                        {detail.email}
                                    </a>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={11} />
                                    {formatDateTime(detail.createdAt)}
                                </span>
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant="outline"
                            className="rounded-lg h-6 px-2 font-black tracking-widest text-[9px] uppercase border-primary/20 bg-primary/5 text-primary"
                        >
                            <Tag size={10} className="mr-1.5" />
                            {detail.subject}
                        </Badge>
                        {detail.status === "replied" && (
                            <Badge
                                variant="outline"
                                className="rounded-lg h-6 px-2 font-black tracking-widest text-[9px] uppercase border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                            >
                                Replied {formatDateTime(detail.repliedAt)}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <div className="p-6 sm:p-8 space-y-8">
                    <section className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Message
                        </h4>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words rounded-2xl bg-muted/30 p-5">
                            {detail.message}
                        </p>
                    </section>

                    {replies.length > 0 && (
                        <section className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Replies ({replies.length})
                            </h4>
                            <div className="space-y-3">
                                {replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className="rounded-2xl border border-primary/15 bg-primary/5 p-5 space-y-2"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <CornerUpLeft size={11} />
                                                {reply.sentByEmail}
                                            </span>
                                            <span>{formatDateTime(reply.createdAt)}</span>
                                        </div>
                                        <p className="text-xs font-extrabold tracking-tight">
                                            {reply.subject}
                                        </p>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                            {reply.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Reply by email
                        </h4>
                        <Input
                            value={replySubject}
                            onChange={(e) => setReplySubject(e.target.value)}
                            placeholder={`Re: ${detail.subject}`}
                            className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                        <Textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder={`Write your reply to ${detail.firstName}…`}
                            rows={6}
                            className="rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary resize-y"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-[10px] text-muted-foreground">
                                Sent to <span className="font-bold">{detail.email}</span> from the
                                platform mailbox.
                            </p>
                            <Button
                                onClick={handleSendReply}
                                disabled={isSending || !replyMessage.trim()}
                                className="rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px]"
                            >
                                {isSending ? (
                                    <Loader2 size={15} className="mr-2 animate-spin" />
                                ) : (
                                    <Send size={15} className="mr-2" />
                                )}
                                {isSending ? "Sending…" : "Send reply"}
                            </Button>
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
