import { Mail, Phone, MapPin, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { PageHero } from "@/shared/components/layout/PageHero";
import { useState } from "react";
import { contactService } from "@/services/contact.service";

export default function ContactPage() {
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
            toast.success("Thank you! Your message has been sent successfully.");
            setIsSubmitted(true);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
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
                title="Connect With"
                subtitle="The Truth"
                description="Have questions? We're here to help you navigate the digital landscape."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-6 bg-secondary/10 rounded-2xl border border-border">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Email Us</h4>
                                        <p className="text-muted-foreground">info@horizontruth.com</p>
                                        <p className="text-muted-foreground">support@horizontruth.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-secondary/10 rounded-2xl border border-border">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Call Us</h4>
                                        <p className="text-muted-foreground">+251 911 234 567</p>
                                        <p className="text-muted-foreground">+251 116 789 012</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-secondary/10 rounded-2xl border border-border">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Visit Us</h4>
                                        <p className="text-muted-foreground">Bole Road, Addis Ababa</p>
                                        <p className="text-muted-foreground">Ethiopia</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-primary rounded-3xl text-primary-foreground shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="opacity-80" size={20} />
                                <h4 className="font-bold text-xl">Business Hours</h4>
                            </div>
                            <div className="space-y-2 opacity-90">
                                <p className="flex justify-between border-b border-white/20 pb-2"><span>Monday - Friday</span> <span>9:00 AM - 5:00 PM</span></p>
                                <p className="flex justify-between border-b border-white/20 pb-2"><span>Saturday</span> <span>10:00 AM - 2:00 PM</span></p>
                                <p className="flex justify-between"><span>Sunday</span> <span>Closed</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card p-8 md:p-12 rounded-[2rem] border shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        {isSubmitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500 py-12">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                                    <CheckCircle size={48} className="text-primary relative z-10" />
                                </div>
                                <h3 className="text-3xl font-black italic uppercase tracking-wider">Transmission Received</h3>
                                <p className="text-muted-foreground max-w-sm leading-relaxed">
                                    Our operatives have secured your transmission. We will review the data and respond via your provided channel within the next briefing cycle.
                                </p>
                                <Button
                                    onClick={() => setIsSubmitted(false)}
                                    variant="outline"
                                    className="rounded-2xl px-10 h-14 font-bold text-lg border-primary/20 hover:bg-primary/5 transition-all"
                                >
                                    Send New Message
                                </Button>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Send a Message</h2>
                                    <p className="text-muted-foreground">Initialize a direct communication vector with our team.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                                            <Input
                                                name="firstName"
                                                placeholder="Caspian"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                                            <Input
                                                name="lastName"
                                                placeholder="Miller"
                                                required
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Comms Email</label>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="miller@truthwatch.io"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject Vector</label>
                                        <Input
                                            name="subject"
                                            placeholder="Technical Support / Partnership"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message Payload</label>
                                        <Textarea
                                            name="message"
                                            placeholder="Enter your message transmission..."
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="min-h-[150px] rounded-2xl bg-muted/30 border-none font-bold italic resize-none"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-16 rounded-2xl text-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all border-none"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Transmitting..." : "Send Message"}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
