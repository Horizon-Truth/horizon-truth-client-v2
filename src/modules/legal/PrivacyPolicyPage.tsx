import { useState } from 'react';
import { Shield, Lock, Eye, FileText, Globe, Scale, Mail } from 'lucide-react';
import { PublicLayout } from '@/shared/layouts/PublicLayout';

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState('introduction');

    const sections = [
        { id: 'introduction', title: 'Introduction', icon: FileText },
        { id: 'collection', title: 'Data Collection', icon: Eye },
        { id: 'usage', title: 'How We Use Data', icon: Globe },
        { id: 'security', title: 'Data Security', icon: Lock },
        { id: 'rights', title: 'Your Rights', icon: Scale },
        { id: 'contact', title: 'Contact Us', icon: Mail }
    ];

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen">
                <section className="py-16 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Shield className="mx-auto mb-6 text-primary" size={48} />
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4">Privacy <span className="text-primary">Policy</span></h1>
                        <p className="text-xl text-muted-foreground opacity-80">Last Updated: January 1, 2025</p>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Sidebar */}
                            <div className="lg:w-1/4">
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
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:w-3/4 max-w-none space-y-20">
                                <div id="introduction" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Introduction</h2>
                                    <div className="prose prose-lg dark:prose-invert text-muted-foreground space-y-4">