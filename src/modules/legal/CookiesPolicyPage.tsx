import { useState } from 'react';
import { Cookie, ShieldCheck, BarChart3, Settings, Megaphone, Info, Save, Check } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from '@/shared/layouts/PublicLayout';

export default function CookiesPolicyPage() {
    const [activeSection, setActiveSection] = useState('what-are-cookies');
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: false,
        functional: false,
        marketing: false
    });

    const sections = [
        { id: 'what-are-cookies', title: 'Meaning', icon: Info },
        { id: 'types', title: 'Types of Cookies', icon: Cookie },
        { id: 'purpose', title: 'Why We Use Them', icon: ShieldCheck },
        { id: 'management', title: 'Management', icon: Settings }
    ];

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const togglePreference = (key: keyof typeof preferences) => {
        if (key === 'necessary') return;
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        toast.success("Preferences saved successfully!");
    };

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen">
                <section className="py-16 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Cookie className="mx-auto mb-6 text-primary" size={48} />
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4">Cookies <span className="text-primary">Policy</span></h1>
                        <p className="text-xl text-muted-foreground opacity-80 max-w-2xl mx-auto leading-relaxed">How we use small data files to improve your learning experience.</p>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Sidebar */}
                            <div className="lg:w-1/4 space-y-8">
                                <div className="sticky top-32 space-y-2">
                                    <h3 className="font-bold text-lg mb-6 px-4">Policy Sections</h3>
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeSection === section.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary text-muted-foreground"
                                                }`}
                                        >
                                            <section.icon size={18} />
                                            <span className="font-semibold">{section.title}</span>
                                        </button>
                                    ))}

                                    <div className="mt-12 p-6 bg-secondary/30 rounded-2xl border border-border">
                                        <h4 className="font-bold mb-4">Quick Control</h4>
                                        <div className="space-y-4">