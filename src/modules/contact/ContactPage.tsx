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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await contactService.submit(formData);
            toast.success(t("contact.successToast"));
            setIsSubmitted(true);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("contact.errorToast"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <PublicLayout>
            <PageHero
                title={t("contact.heroTitle")}
                subtitle={t("contact.heroSubtitle")}
                description={t("contact.heroDesc")}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">{t("contact.infoTitle")}</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-6 bg-secondary/10 rounded-2xl border border-border">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{t("contact.emailUs")}</h4>
                                        <p className="text-muted-foreground">info@horizontruth.com</p>
                                        <p className="text-muted-foreground">support@horizontruth.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-secondary/10 rounded-2xl border border-border">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{t("contact.callUs")}</h4>
                                        <p className="text-muted-foreground">+251 941 667 729</p>
                                        <p className="text-muted-foreground">+251 921 859 449</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-secondary/10 rounded-2xl border border-border">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{t("contact.visitUs")}</h4>
                                        <p className="text-muted-foreground">{t("contact.visitLine1")}</p>
                                        <p className="text-muted-foreground">{t("contact.visitLine2")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
