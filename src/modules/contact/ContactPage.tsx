import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Thank you! Your message has been sent successfully.");
    };

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen">
                {/* Hero Section */}
                <section className="py-20 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <MessageSquare size={16} className="text-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Typically responds within 24 hours</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">Get in <span className="text-primary">Touch</span></h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Have questions about misinformation? Want to collaborate? We're here to help and would love to hear from you.
                        </p>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16">
                            {/* Contact Information */}
                            <div className="space-y-12">
                                <div>
                                    <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 p-6 bg-secondary/20 rounded-2xl border border-border">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Mail className="text-primary" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">Email Us</h4>
                                                <p className="text-muted-foreground">info@horizontruth.com</p>
                                                <p className="text-muted-foreground">support@horizontruth.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-6 bg-secondary/20 rounded-2xl border border-border">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Phone className="text-primary" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">Call Us</h4>
                                                <p className="text-muted-foreground">+251 911 234 567</p>
                                                <p className="text-muted-foreground">+251 116 789 012</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-6 bg-secondary/20 rounded-2xl border border-border">
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
                            <div className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm">
                                <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">First Name</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none" placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Last Name</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Doe" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Email Address</label>
                                        <input required type="email" className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none" placeholder="john@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Subject</label>
                                        <select className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none">
                                            <option>General Inquiry</option>
                                            <option>Partnership Interest</option>
                                            <option>Technical Support</option>
                                            <option>Report an Issue</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Message</label>
                                        <textarea required rows={5} className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none" placeholder="How can we help you?"></textarea>
                                    </div>
                                    <Button size="lg" className="w-full rounded-xl py-7 font-bold text-lg group">
                                        Send Message <Send className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
