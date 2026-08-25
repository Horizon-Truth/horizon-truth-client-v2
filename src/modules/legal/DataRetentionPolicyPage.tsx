import { useState } from 'react';
import { Clock, Trash2, Server, Baby, FileQuestion, Calendar, Mail } from 'lucide-react';
import { PublicLayout } from '@/shared/layouts/PublicLayout';

const sections = [
    { id: 'why', title: 'Why We Have This Policy', icon: FileQuestion },
    { id: 'retention', title: 'How Long We Keep Things', icon: Clock },
    { id: 'deletion', title: 'How Deletion Works', icon: Trash2 },
    { id: 'storage', title: 'Where Data Is Stored', icon: Server },
    { id: 'young', title: 'Young Users', icon: Baby },
    { id: 'deleting', title: 'Deleting Your Data', icon: Trash2 },
    { id: 'exceptions', title: 'Exceptions', icon: FileQuestion },
    { id: 'review', title: 'Reviewing This Policy', icon: Calendar },
    { id: 'contact', title: 'Questions', icon: Mail },
];

const retentionData = [
    { what: 'Account details (email, username, phone, full name)', howLong: 'While the account is open, plus 30 days after closure', thenWhat: 'Anonymised — the account record stays but all identifying fields are cleared' },
    { what: 'Player profile, game progress, scores, badges, leaderboard position', howLong: 'While the account is open', thenWhat: 'Nickname replaced; progress data kept without a link to a person' },
    { what: 'Learning and behaviour data (scenario choices, scene events, response timing)', howLong: '24 months', thenWhat: 'Kept in aggregate only' },
    { what: 'Reports and content submitted for verification', howLong: '12 months identifiable', thenWhat: 'Personal details removed; the claim itself kept for research' },
    { what: 'Evidence files and images attached to reports', howLong: '6 months', thenWhat: 'Deleted' },
    { what: 'AI verification results (verdict, confidence)', howLong: '12 months linked to the reporter', thenWhat: 'Kept without the reporter link' },
    { what: 'Moderation cases, actions, notes and appeals', howLong: '24 months', thenWhat: 'Deleted' },
    { what: 'Audit log (who did what in the admin area)', howLong: '24 months', thenWhat: 'Deleted' },
    { what: 'Sessions and refresh tokens', howLong: '30 days', thenWhat: 'Deleted' },
    { what: 'Log data (hashed IP, partial IP, access times)', howLong: '90 days active, up to 12 months archived', thenWhat: 'Deleted' },
    { what: 'Guest play data (no account)', howLong: '90 days', thenWhat: 'Deleted' },
    { what: 'Contact form messages and newsletter subscriptions', howLong: '24 months, or until unsubscribe', thenWhat: 'Deleted' },
    { what: 'Backups', howLong: '35 days, rolling', thenWhat: 'Overwritten automatically' },
    { what: 'Anonymised research data', howLong: 'Kept indefinitely', thenWhat: 'No longer identifies anyone, so it stays' },
];

export default function DataRetentionPolicyPage() {
    const [activeSection, setActiveSection] = useState('why');

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen">
                <section className="py-16 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Clock className="mx-auto mb-6 text-primary" size={48} />
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4">Data <span className="text-primary">Retention Policy</span></h1>
                        <p className="text-lg text-muted-foreground opacity-80 mb-2">Dabbal Software Development PLC &middot; Addis Ababa, Ethiopia</p>
                        <p className="text-sm text-muted-foreground opacity-60">Version 1.1 &middot; Effective August 25, 2026</p>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="lg:w-1/4">
                                <div className="sticky top-32 space-y-2">
                                    <h3 className="font-bold text-lg mb-6 px-4">Policy Sections</h3>
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-left ${activeSection === section.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary text-muted-foreground"}`}
                                        >
                                            <section.icon size={18} />
                                            <span className="font-semibold text-sm">{section.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:w-3/4 max-w-none space-y-20">
                                <div id="why" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Why We Have This Policy</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>
                                            Horizon Truth is a gamified digital literacy platform with a crowdsourced content verification system, in Amharic, Afaan Oromo and English.
                                        </p>
                                        <p>
                                            Running it means holding personal data about our players and reporters, and Ethiopia's Personal Data Protection Proclamation No. 1321/2024 requires us to keep personal data no longer than we need it.
                                        </p>
                                        <p>
                                            This policy says how long we keep each kind of data and how we get rid of it.
                                        </p>
                                        <p>
                                            It sits alongside our <a href="/privacy-policy" className="text-primary hover:underline font-semibold">Privacy Policy</a>, which explains what we collect and why.
                                        </p>
                                    </div>
                                </div>

                                <div id="retention" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-8">How Long We Keep Things</h2>
                                    <div className="overflow-x-auto rounded-2xl border border-border">
                                        <table className="min-w-full divide-y divide-border">
                                            <thead className="bg-secondary/20 text-xs text-left font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4 min-w-[200px]">What</th>
                                                    <th className="px-6 py-4 min-w-[180px]">How Long</th>
                                                    <th className="px-6 py-4 min-w-[200px]">Then What</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border text-sm">
                                                {retentionData.map((row, i) => (
                                                    <tr key={i} className="hover:bg-secondary/5 transition-colors">
                                                        <td className="px-6 py-4 font-semibold text-foreground">{row.what}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{row.howLong}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{row.thenWhat}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div id="deletion" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">How Deletion Works</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>When a user asks us to delete their account we anonymise it:</p>
                                        <ul className="space-y-2">
                                            <li>• email;</li>
                                            <li>• username;</li>
                                            <li>• phone;</li>
                                            <li>• name;</li>
                                            <li>• password;</li>
                                            <li>• API key</li>
                                        </ul>
                                        <p>are cleared.</p>
                                        <div className="p-6 bg-secondary/20 rounded-xl border mt-6 space-y-3">
                                            <p>The nickname becomes: <strong className="text-foreground">"Former Player"</strong></p>
                                            <p>The account is marked: <strong className="text-foreground">ANONYMIZED</strong></p>
                                            <p>Game progress and moderation history remain, but nothing in them points to a person.</p>
                                        </div>
                                        <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 mt-6">
                                            <p className="font-semibold text-foreground">We complete deletion requests within 30 days of the request.</p>
                                        </div>
                                        <p>Backups are not edited one record at a time. They roll over within 35 days, so removed data disappears from backups within that window.</p>
                                    </div>
                                </div>

                                <div id="storage" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Where Data Is Stored</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>Personal data collected in Ethiopia is stored in Ethiopia, as Proclamation No. 1321/2024 requires.</p>
                                        <p><strong className="text-foreground">Horizon Truth does not currently send report content to any outside AI service;</strong> verification today is done by human moderators.</p>
                                        <p>An AI-assisted verification step is on our roadmap.</p>
                                        <p>Before it goes live:</p>
                                        <ul className="space-y-2">
                                            <li>• we will name the service provider(s) here;</li>
                                            <li>• confirm they do not store data outside Ethiopia without a lawful basis;</li>
                                            <li>• update this policy.</li>
                                        </ul>
                                        <p>When it launches, we will send only the text of the submitted claim — never the reporter's name, email, phone, or account identifier.</p>
                                    </div>
                                </div>

                                <div id="young" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Young Users</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>Horizon Truth is designed for young people aged roughly 16 to 25.</p>
                                        <p>For users under 16 we recommend parental guidance, and we do not knowingly collect information from anyone under 13 without verifiable parental consent.</p>
                                        <div className="p-6 bg-secondary/20 rounded-xl border mt-6">
                                            <h4 className="font-bold text-foreground mb-3">For users under 18:</h4>
                                            <ul className="space-y-2">
                                                <li>• we keep data for a maximum of 12 months after their last activity;</li>
                                                <li>• we never include their data in any published dataset;</li>
                                                <li>• we never send their data outside Ethiopia.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div id="deleting" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Deleting Your Data</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>Anyone can delete their account from account settings, or write to us.</p>
                                        <p>We reply within five working days and finish within 30 days.</p>
                                        <p>If we have to keep something because the law requires it, we tell you what and why.</p>
                                        <p>Use: <a href="mailto:privacy@horizontruth.com" className="text-primary hover:underline font-semibold">privacy@horizontruth.com</a> for this contact.</p>
                                    </div>
                                </div>

                                <div id="exceptions" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Exceptions</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>We keep data longer than stated above only where:</p>
                                        <ul className="space-y-2">
                                            <li>• the law requires it; or</li>
                                            <li>• it is needed for an ongoing investigation;</li>
                                            <li>• moderation appeal;</li>
                                            <li>• legal claim.</li>
                                        </ul>
                                        <p>Any exception is written down with a reason and a review date.</p>
                                    </div>
                                </div>

                                <div id="review" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Reviewing This Policy</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>We review this policy once a year, and whenever we:</p>
                                        <ul className="space-y-2">
                                            <li>• start collecting a new kind of data; or</li>
                                            <li>• add a new service provider.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div id="contact" className="scroll-mt-32 p-10 bg-primary rounded-3xl text-primary-foreground shadow-2xl">
                                    <h2 className="text-3xl font-bold mb-6">Questions About This Policy</h2>
                                    <div className="grid md:grid-cols-2 gap-8 font-bold">
                                        <div className="space-y-2">
                                            <p className="text-lg">Dabbal Software Development PLC</p>
                                            <p className="opacity-90">Addis Ababa, Ethiopia</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p>
                                                <a href="mailto:privacy@horizontruth.com" className="opacity-90 hover:opacity-100 transition-opacity">
                                                    privacy@horizontruth.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-12 pt-8 border-t border-white/20 text-xs opacity-60 text-center">
                                        <p>Version 1.1 &middot; Effective August 25, 2026</p>
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
