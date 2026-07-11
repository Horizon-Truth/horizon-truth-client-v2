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
                                        <p>
                                            This Privacy Policy describes how Dabbal Software Development PLC ("we," "our," or "us") collects, uses,
                                            and shares your personal information when you use the Horizon Truth platform ("Platform"). Horizon Truth
                                            is a gamified digital literacy platform combined with a crowdsourced content verification system, enhanced by AI.
                                        </p>
                                        <p>
                                            We are committed to protecting your privacy and ensuring the security of your personal information.
                                            By using our Platform, you agree to the collection and use of information in accordance with this policy.
                                        </p>
                                    </div>
                                </div>

                                <div id="collection" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Information We Collect</h2>
                                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                                        <div className="p-8 bg-secondary/20 rounded-2xl border border-border">
                                            <h4 className="font-bold text-xl mb-4 text-foreground">Personal Information</h4>
                                            <ul className="space-y-4 text-muted-foreground">
                                                <li>• Basic profile information (username, email address)</li>
                                                <li>• Demographic information (age, location - if voluntarily provided)</li>
                                                <li>• Language preferences (Amharic, Afaan Oromo, English)</li>
                                                <li>• Game progress, scores, and achievements</li>
                                                <li>• Content you report or verify through our crowdsourced system</li>
                                            </ul>
                                        </div>
                                        <div className="p-8 bg-secondary/20 rounded-2xl border border-border">
                                            <h4 className="font-bold text-xl mb-4 text-foreground">Automatically Collected</h4>
                                            <ul className="space-y-4 text-muted-foreground">
                                                <li>• Device information (type, operating system, browser type)</li>
                                                <li>• Log data (IP address, access times, pages viewed)</li>
                                                <li>• Usage patterns and gameplay statistics</li>
                                                <li>• Interaction with educational content and verification tools</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div id="usage" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">How We Use Your Information</h2>
                                    <div className="prose prose-lg dark:prose-invert text-muted-foreground space-y-4">
                                        <p>We use the information we collect for the following purposes:</p>
                                        <ul className="space-y-4">
                                            <li>• To provide, maintain, and improve our Platform and services</li>
                                            <li>• To personalize your experience and educational content</li>
                                            <li>• To develop and enhance our AI-powered misinformation detection system</li>
                                            <li>• To track and reward your progress in the gamified learning system</li>
                                            <li>• To analyze usage patterns and improve our Platform's effectiveness</li>
                                            <li>• To communicate with you about updates, features, and educational content</li>