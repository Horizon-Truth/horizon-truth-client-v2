import { Mail, Phone, MapPin, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { PageHero } from "@/shared/components/layout/PageHero";
import { useState } from "react";
import { contactService } from "@/services/contact.service";
import { useTranslation } from "@/shared/i18n/useTranslation";

export default function ContactPage() {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
    });