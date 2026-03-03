import { useEffect, useState } from "react";
import { Mail, Trash2, Search, Calendar, MessageSquare, Tag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { contactService, type ContactSubmission } from "@/services/contact.service";
import { toast } from "sonner";

export default function ContactSubmissionsPage() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const data = await contactService.getAll();
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch contact submissions:", error);
            toast.error("Failed to load submissions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this submission?")) return;
        try {
            await contactService.delete(id);
            toast.success("Submission deleted successfully");
            fetchSubmissions();
        } catch (error) {
            toast.error("Failed to delete submission");
        }
    };

    const filteredSubmissions = submissions.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase tracking-wider">Contact Submissions</h2>
                <p className="text-sm text-muted-foreground mt-1">Review and manage communications from the public.</p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-card border border-border/50 p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search submissions..."
                        className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sender</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Message</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accessing Comms Database...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <MessageSquare size={40} className="text-muted-foreground/30" />
                                            <p className="text-sm font-bold text-muted-foreground">No submissions found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSubmissions.map((s) => (
                                <tr key={s.id} className="group hover:bg-accent/5 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                                                {s.firstName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-sm tracking-tight">{s.firstName} {s.lastName}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <Mail size={10} />
                                                    {s.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className="rounded-lg h-6 px-2 font-black tracking-widest text-[9px] uppercase border-primary/20 bg-primary/5 text-primary">
                                            <Tag size={10} className="mr-1.5" />
                                            {s.subject}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs text-muted-foreground max-w-xs truncate" title={s.message}>
                                            {s.message}
                                        </p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                            <Calendar size={12} />
                                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => s.id && handleDelete(s.id)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
