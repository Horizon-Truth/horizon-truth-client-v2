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
            <div className="flex flex-col min-h-screen pt-16">
                <section className="py-16 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Scale className="mx-auto mb-6 text-primary" size={48} />
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4">Terms of <span className="text-primary">Service</span></h1>
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
                                <div id="acceptance" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">1. Acceptance of Terms</h2>
                                    <div className="prose prose-lg dark:prose-invert text-muted-foreground space-y-4">
                                        <p>
                                            These Terms of Service ("Terms") govern your access to and use of the Horizon Truth platform
                                            ("Platform"), website, and services (collectively, "Services") provided by Dabbal Software
                                            Development PLC ("we," "us," or "our").
                                        </p>
                                        <p>
                                            By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.
                                            If you disagree with any part of these Terms, you may not access or use our Services.
                                        </p>
                                    </div>
                                </div>

                                <div id="eligibility" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">2. Eligibility</h2>
                                    <div className="prose prose-lg dark:prose-invert text-muted-foreground space-y-4">
                                        <p>To use our Services, you must:</p>
                                        <ul className="space-y-2">
                                            <li>• Be at least 13 years of age.</li>
                                            <li>• Have the legal capacity to enter into binding contracts.</li>
                                            <li>• Not be prohibited from receiving our Services under applicable laws.</li>
                                        </ul>
                                        <p className="bg-secondary/20 p-6 rounded-xl border-l-4 border-primary mt-6 text-sm italic">
                                            Note: If you are under 18, you must have parental or guardian consent to use this platform.
                                        </p>
                                    </div>
                                </div>

                                <div id="responsibilities" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">3. User Responsibilities</h2>
                                    <div className="grid md:grid-cols-2 gap-8 mt-8 text-sm">
                                        <div className="p-8 bg-secondary/20 rounded-2xl border border-border">
                                            <h4 className="font-bold text-xl mb-4 text-foreground">Prohibited Acts</h4>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li>• Submitting false verification data</li>
                                                <li>• Harassing other community members</li>
                                                <li>• Attempting to circumvent AI detection</li>
                                                <li>• Using automation to scrape content</li>
                                            </ul>
                                        </div>
                                        <div className="p-8 bg-secondary/20 rounded-2xl border border-border">
                                            <h4 className="font-bold text-xl mb-4 text-foreground">Account Security</h4>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li>• Keep your password confidential</li>
                                                <li>• Provide accurate profile details</li>
                                                <li>• Notify us of unauthorized access</li>
                                                <li>• One account per individual user</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div id="content" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">4. Intellectual Property</h2>
                                    <div className="prose prose-lg dark:prose-invert text-muted-foreground space-y-4">
                                        <p>All original content, features, and platform functionality are the exclusive property of Dabbal Software Development PLC. For any content you submit for verification:</p>
                                        <p className="bg-secondary/30 p-6 rounded-xl border-l-4 border-primary italic">"You grant us a worldwide, royalty-free license to use, reproduce, and adapt such content for educational and research purposes intended to combat misinformation."</p>
                                    </div>
                                </div>

                                <div id="termination" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">5. Termination</h2>
                                    <p className="text-muted-foreground leading-relaxed">We reserve the right to suspend or terminate your access immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the Services will cease entirely.</p>
                                </div>

                                <div id="liability" className="scroll-mt-32 p-10 bg-secondary/10 rounded-3xl border border-border">
                                    <h2 className="text-3xl font-bold mb-6">6. Disclaimer & Liability</h2>
                                    <p className="text-muted-foreground leading-relaxed mb-6">Horizon Truth provides educational resources "AS IS." While we strive for absolute accuracy, our AI and community verification results are for informational purposes and should not be considered absolute truth.</p>
                                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest border-t pt-4">Maximum liability is limited to the amount paid (if any) in the 6 months prior to the claim.</p>
                                </div>

                                <div id="law" className="scroll-mt-32 p-10 bg-primary rounded-3xl text-primary-foreground shadow-xl">
                                    <h2 className="text-3xl font-bold mb-6 text-white text-center">7. Governing Law & Contact</h2>
                                    <div className="grid md:grid-cols-2 gap-8 items-center">
                                        <div className="space-y-4">
                                            <p className="opacity-80">These Terms are governed by the laws of Ethiopia. Any disputes shall be resolved in the courts of Addis Ababa or Jimma, Ethiopia.</p>
                                        </div>
                                        <div className="space-y-2 font-bold text-sm bg-white/10 p-6 rounded-2xl">
                                            <p>Legal Department: legal@horizontruth.com</p>
                                            <p>Dabbal Software Development PLC</p>
                                            <p>Addis Ababa, Ethiopia</p>
                                        </div>
                                    </div>
                                    <p className="mt-8 text-center text-xs opacity-60">Last Updated: January 1, 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
