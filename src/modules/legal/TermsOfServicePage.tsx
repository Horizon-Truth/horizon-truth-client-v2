import { useState } from 'react';
import { Scale, CheckCircle, AlertTriangle, Copyright, UserCheck, Trash2, Gavel } from 'lucide-react';
import { PublicLayout } from '@/shared/layouts/PublicLayout';

export default function TermsOfServicePage() {
    const [activeSection, setActiveSection] = useState('acceptance');

    const sections = [
        { id: 'acceptance', title: 'Acceptance', icon: UserCheck },
        { id: 'eligibility', title: 'Eligibility', icon: Scale },
        { id: 'responsibilities', title: 'Responsibilities', icon: CheckCircle },
        { id: 'content', title: 'Content Guidelines', icon: Copyright },
        { id: 'termination', title: 'Termination', icon: Trash2 },
        { id: 'liability', title: 'Liability', icon: AlertTriangle },
        { id: 'law', title: 'Governing Law', icon: Gavel }
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
                        <Scale className="mx-auto mb-6 text-primary" size={48} />
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4">Terms of <span className="text-primary">Service</span></h1>
                        <p className="text-xl text-muted-foreground opacity-80">Last Updated: January 1, 2025</p>