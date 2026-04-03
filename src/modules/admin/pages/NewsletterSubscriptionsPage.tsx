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