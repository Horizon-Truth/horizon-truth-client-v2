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
            <div className="flex flex-col min-h-screen pt-16">
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
                                            {[
                                                { key: 'necessary', label: 'Necessary', locked: true },
                                                { key: 'analytics', label: 'Analytics', locked: false },
                                                { key: 'functional', label: 'Functional', locked: false }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                    <button
                                                        onClick={() => !item.locked && togglePreference(item.key as any)}
                                                        className={`w-10 h-6 rounded-full transition-all relative ${preferences[item.key as keyof typeof preferences] ? "bg-primary" : "bg-muted"}`}
                                                    >
                                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${preferences[item.key as keyof typeof preferences] ? "right-1" : "left-1"}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button onClick={handleSave} className="w-full mt-6 rounded-xl flex items-center gap-2">
                                            <Save size={16} /> Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:w-3/4 max-w-none space-y-20">
                                <div id="what-are-cookies" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">What Are Cookies?</h2>
                                    <div className="prose prose-lg dark:prose-invert text-muted-foreground space-y-6">
                                        <p>
                                            Cookies are small text files that are placed on your computer, smartphone, or other device
                                            when you visit a website. They are widely used to make websites work more efficiently and
                                            provide information to the platform owners.
                                        </p>
                                        <div className="bg-secondary/20 p-8 rounded-2xl border border-border">
                                            <h4 className="font-bold text-foreground mb-4 text-center">How Cookies Work</h4>
                                            <ul className="grid md:grid-cols-2 gap-4 text-sm">
                                                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> Created on visit</li>
                                                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> Store interaction data</li>
                                                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> Sent back on return</li>
                                                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> Remember preferences</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div id="types" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-8">Types of Cookies We Use</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { title: "Strictly Necessary", icon: ShieldCheck, desc: "Critical for the platform to function. Enables session management and security. (Always Active)" },
                                            { title: "Analytics", icon: BarChart3, desc: "Anonymously tracks visits and performance to improve our educational effectiveness." },
                                            { title: "Functional", icon: Settings, desc: "Remembers your language (Amharic/Afaan Oromo/English) and game progress settings." },
                                            { title: "Marketing", icon: Megaphone, desc: "Used for social media integration and specialized educational partner updates." }
                                        ].map((type, i) => (
                                            <div key={i} className="p-8 bg-secondary/20 rounded-2xl border border-border flex gap-4 hover:border-primary transition-all group">
                                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-all">
                                                    <type.icon className="text-primary group-hover:text-white transition-all" size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xl mb-2">{type.title}</h4>
                                                    <p className="text-muted-foreground text-sm leading-relaxed">{type.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
                                        <table className="min-w-full divide-y divide-border">
                                            <thead className="bg-secondary/20 text-xs text-left font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4">Service</th>
                                                    <th className="px-6 py-4">Purpose</th>
                                                    <th className="px-6 py-4">Privacy Link</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border text-sm">
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground">Google Analytics</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Usage statistics and platform performance tracking.</td>
                                                    <td className="px-6 py-4"><a href="https://policies.google.com/privacy" className="text-primary hover:underline">View Policy</a></td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground">Auth Service</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Maintains secure user sessions and login integrity.</td>
                                                    <td className="px-6 py-4"><a href="/privacy-policy" className="text-primary hover:underline">Our Policy</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div id="purpose" className="scroll-mt-32 p-10 bg-primary rounded-3xl text-primary-foreground shadow-2xl">
                                    <h2 className="text-3xl font-bold mb-6 text-white">Why it Matters for Learning</h2>
                                    <p className="opacity-80 text-lg mb-8 leading-relaxed">
                                        For Horizon Truth, cookies are the gears behind our personalized educational experiences.
                                        They allow us to save your game achievements, track your improvement in identifying
                                        misinformation, and optimize scenarios for better learning outcomes in Ethiopia.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6 items-start">
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-xl">Educational Hub</h4>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2"><Check className="text-secondary" /> Save achievements & streaks</li>
                                                <li className="flex items-center gap-2"><Check className="text-secondary" /> Remember learning paths</li>
                                                <li className="flex items-center gap-2"><Check className="text-secondary" /> Personalize challenges</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-4 text-right md:text-left">
                                            <h4 className="font-bold text-xl">Platform Core</h4>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2"><Check className="text-secondary" /> Secure account access</li>
                                                <li className="flex items-center gap-2"><Check className="text-secondary" /> Language persistence</li>
                                                <li className="flex items-center gap-2"><Check className="text-secondary" /> Performance optimization</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div id="management" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Controlling Data</h2>
                                    <div className="prose prose-lg dark:prose-invert text-muted-foreground space-y-8">
                                        <p>
                                            You have control over cookies. Manage them via our control panel or browser settings.
                                            Note that disabling optional cookies may impact some learning features.
                                        </p>
                                        <div className="bg-secondary/30 p-8 rounded-3xl border border-border">
                                            <h4 className="text-foreground font-bold mb-4">Browser Shortcuts</h4>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs opacity-75">
                                                <p><strong>Chrome:</strong> Privacy → Cookies</p>
                                                <p><strong>Firefox:</strong> Privacy → History</p>
                                                <p><strong>Safari:</strong> Preferences → Privacy</p>
                                                <p><strong>Edge:</strong> Settings → Permissions</p>
                                            </div>
                                        </div>
                                        <div className="text-center pt-10 border-t border-border mt-10">
                                            <p className="text-xs opacity-50 uppercase tracking-widest">Effective Date: January 1, 2025 | Last Updated: January 1, 2025</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
