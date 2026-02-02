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