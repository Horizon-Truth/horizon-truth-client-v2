import { useEffect, useState } from "react";
import { Mail, Trash2, Search, Calendar, Megaphone, CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { newsletterService, type NewsletterSubscription } from "@/services/newsletter.service";
import { toast } from "sonner";

export default function NewsletterSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        try {
            const data = await newsletterService.getAll();
            setSubscriptions(data);
        } catch (error) {
            console.error("Failed to fetch newsletter subscriptions:", error);
            toast.error("Failed to load subscriptions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this subscription?")) return;
        try {
            await newsletterService.delete(id);
            toast.success("Subscription removed successfully");
            fetchSubscriptions();
        } catch (error) {
            toast.error("Failed to remove subscription");
        }
    };

    const filteredSubscriptions = subscriptions.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase tracking-wider">Newsletter Network</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage the digital defender subscriber base.</p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-card border border-border/50 p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search subscribers..."
                        className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subscriber Email</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Enrolled On</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Syncing Network Base...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Megaphone size={40} className="text-muted-foreground/30" />
                                            <p className="text-sm font-bold text-muted-foreground">No subscribers found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSubscriptions.map((s) => (
                                <tr key={s.id} className="group hover:bg-accent/5 transition-colors">