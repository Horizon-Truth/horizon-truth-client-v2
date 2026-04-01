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