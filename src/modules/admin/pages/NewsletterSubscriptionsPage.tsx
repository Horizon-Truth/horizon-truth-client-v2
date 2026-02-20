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