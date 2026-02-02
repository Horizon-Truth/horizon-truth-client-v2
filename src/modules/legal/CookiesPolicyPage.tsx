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