import { useState } from 'react';
import { Shield, Users, Database, Globe, Eye, Lock, Scale, Mail, AlertTriangle, Baby, Server, FileText, ChevronRight } from 'lucide-react';
import { PublicLayout } from '@/shared/layouts/PublicLayout';

const sections = [
    { id: 'who', title: 'Who This Policy Covers', icon: Users },
    { id: 'collection', title: 'Information We Collect', icon: Database },
    { id: 'usage', title: 'How We Use Your Information', icon: Eye },
    { id: 'automated', title: 'Automated & AI Features', icon: Globe },
    { id: 'legal-basis', title: 'Legal Basis for Processing', icon: Scale },
    { id: 'sharing', title: 'Who We Share With', icon: Users },
    { id: 'cookies', title: 'Cookies', icon: Database },
    { id: 'retention', title: 'Data Retention', icon: Lock },
    { id: 'rights', title: 'Your Rights', icon: Scale },
    { id: 'children', title: 'Children & Young People', icon: Baby },
    { id: 'security', title: 'Data Security', icon: Lock },
    { id: 'storage', title: 'Where Data Is Stored', icon: Server },
    { id: 'changes', title: 'Changes to This Policy', icon: FileText },
    { id: 'contact', title: 'Contact Us', icon: Mail },
];

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState('who');

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
                        <p className="text-lg text-muted-foreground opacity-80 mb-2">Dabbal Software Development PLC &middot; Addis Ababa, Ethiopia</p>
                        <p className="text-sm text-muted-foreground opacity-60">Version 1.0 &middot; Effective August 25, 2026</p>
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
                                <div id="who" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Who This Policy Covers</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>
                                            This Privacy Policy explains what personal data Dabbal Software Development PLC ("Dabbal," "we," "our," or "us") collects through Horizon Truth — our gamified digital literacy and crowdsourced content-verification platform, available in Amharic, Afaan Oromo and English — and what we do with it.
                                        </p>
                                        <p>
                                            It applies to the Horizon Truth website, mobile experience, and API.
                                        </p>
                                        <p>
                                            It sits alongside our <a href="/data-retention" className="text-primary hover:underline font-semibold">Data Retention Policy</a>, which sets out how long we keep each kind of data, and our <a href="/cookies-policy" className="text-primary hover:underline font-semibold">Cookies Policy</a>, which covers cookies and similar technologies specifically.
                                        </p>
                                        <div className="p-6 bg-secondary/20 rounded-xl border-l-4 border-primary mt-6">
                                            <p className="text-sm font-semibold">
                                                By creating an account or otherwise using Horizon Truth, you agree to the collection and use of information as described here. If you do not agree, please do not use the Platform.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div id="collection" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Information We Collect</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed mb-8">
                                        <p>We collect the following categories of information.</p>
                                        <p className="text-sm">
                                            We do not collect financial data, government ID numbers, precise location, health data, biometric data, or information about race, ethnicity, religion, political opinion or sexual orientation, and we ask that you do not include such information in reports, evidence, or messages you submit to us.
                                        </p>
                                    </div>
                                    <div className="overflow-x-auto rounded-2xl border border-border">
                                        <table className="min-w-full divide-y divide-border">
                                            <thead className="bg-secondary/20 text-xs text-left font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4">Category</th>
                                                    <th className="px-6 py-4">Examples</th>
                                                    <th className="px-6 py-4">Source</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border text-sm">
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">Account & identity</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Email address, username, phone number, full name, password (stored as a hash, never in plain text), preferred language</td>
                                                    <td className="px-6 py-4 text-muted-foreground">You, at registration</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">Player profile</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Nickname, avatar, region (fictional, for gameplay), trust score, streaks, reputation role, badges, leaderboard position</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Generated as you play</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">Gameplay & learning activity</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Scenario choices, scenes viewed, time spent, reaction time, onboarding progress</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Generated as you play</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">Reports you submit</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Report title, description, category, source link, evidence you attach, language, and any credibility assessment or moderator notes</td>
                                                    <td className="px-6 py-4 text-muted-foreground">You, when you submit or review a report</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">Contact & newsletter</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Name, email address, and the content of any message you send us; email address if you subscribe to updates</td>
                                                    <td className="px-6 py-4 text-muted-foreground">You, via the contact form or newsletter signup</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">Organization accounts</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Organization name, type, description, country and region</td>
                                                    <td className="px-6 py-4 text-muted-foreground">You, if you register on behalf of an organization</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">Technical & log data</td>
                                                    <td className="px-6 py-4 text-muted-foreground">IP address, device type, browser, approximate network quality, access times, session identifiers, refresh tokens</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Automatically, when you use the Platform</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">Security & audit data</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Who did what, when, from which IP address and user agent, inside admin and moderation tools</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Automatically, for accountability and security</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-6 text-sm text-muted-foreground space-y-2">
                                        <p>Some information is optional, for example an organization profile or a newsletter subscription.</p>
                                        <p>Some is required to create an account and play, for example an email address or username, and a password.</p>
                                    </div>
                                </div>

                                <div id="usage" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">How We Use Your Information</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <ul className="space-y-3">
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> To create and run your account, and let you play, report and verify content.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> To calculate trust scores, streaks, badges and leaderboard position.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> To route and triage reports for human moderator review.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> To keep the Platform secure — for example, detecting suspicious login activity through our audit logs.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> To respond to you when you contact us, and to send platform or safety updates you have agreed to receive.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> To understand how the Platform is used, in aggregate, so we can improve it.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> To meet our legal obligations, including under Ethiopia's Personal Data Protection Proclamation No. 1321/2024, and to defend our legal rights.</li>
                                        </ul>
                                        <div className="p-6 bg-secondary/20 rounded-xl border-l-4 border-primary mt-6">
                                            <p className="text-sm font-semibold">
                                                We do not use your data to make automated decisions that have a legal or similarly significant effect on you without human review.
                                            </p>
                                        </div>
                                        <p>Verification of reported content is carried out by human moderators today; see "Automated and AI-assisted features" below.</p>
                                    </div>
                                </div>

                                <div id="automated" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Automated and AI-Assisted Features</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>Horizon Truth's crowdsourced verification is reviewed by people.</p>
                                        <p><strong className="text-foreground">We do not currently send report content to any outside AI service.</strong></p>
                                        <p>An AI-assisted verification step is on our roadmap; before it goes live we will name the service provider(s) here and in our Data Retention Policy, confirm how they handle data, and give you notice.</p>
                                        <div className="p-6 bg-secondary/20 rounded-xl border-l-4 border-primary mt-6">
                                            <p className="text-sm font-semibold">
                                                When it launches, only the text of a submitted claim will be sent — never your name, email, phone number, or account identifier.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div id="legal-basis" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Legal Basis for Processing (and Your Consent)</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>We process your information because:</p>
                                        <ul className="space-y-3">
                                            <li className="flex gap-3"><span className="font-bold text-primary">(a)</span> it is necessary to provide the account and features you sign up for (contract);</li>
                                            <li className="flex gap-3"><span className="font-bold text-primary">(b)</span> you have given consent, for example by ticking the consent box at registration or subscribing to the newsletter;</li>
                                            <li className="flex gap-3"><span className="font-bold text-primary">(c)</span> we have a legitimate interest in keeping the Platform secure, understanding usage, and improving it, balanced against your rights; or</li>
                                            <li className="flex gap-3"><span className="font-bold text-primary">(d)</span> we are required to by law.</li>
                                        </ul>
                                        <p>Where we rely on consent, you can withdraw it at any time — see "Your rights" below.</p>
                                    </div>
                                </div>

                                <div id="sharing" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Who We Share Information With</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed mb-8">
                                        <p><strong className="text-foreground">We do not sell your personal information.</strong></p>
                                        <p>We share it only as follows:</p>
                                    </div>
                                    <div className="overflow-x-auto rounded-2xl border border-border">
                                        <table className="min-w-full divide-y divide-border">
                                            <thead className="bg-secondary/20 text-xs text-left font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4">Recipient</th>
                                                    <th className="px-6 py-4">What they receive</th>
                                                    <th className="px-6 py-4">Why</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border text-sm">
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground">Resend (transactional email provider)</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Email address, and message content for emails we send you</td>
                                                    <td className="px-6 py-4 text-muted-foreground">To deliver account, moderation and support emails</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground">Hosting / database provider</td>
                                                    <td className="px-6 py-4 text-muted-foreground">All data stored in the Platform's database</td>
                                                    <td className="px-6 py-4 text-muted-foreground">To run the Platform</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground">Analytics provider (Google Analytics), if you accept analytics cookies</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Usage data via cookies — see our Cookies Policy</td>
                                                    <td className="px-6 py-4 text-muted-foreground">To understand aggregate platform usage</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground">Ministry of Peace (youth engagement partner)</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Name and email address, via a secured API, limited to confirming program participation</td>
                                                    <td className="px-6 py-4 text-muted-foreground">To verify participation in joint youth-engagement activities, under a written data-sharing agreement</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground">Law enforcement or regulators</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Only what is legally required</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Where required by Ethiopian law or a valid legal process</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-foreground">A successor entity</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Data needed to continue operating the Platform</td>
                                                    <td className="px-6 py-4 text-muted-foreground">Only if Horizon Truth is transferred as part of a merger, acquisition, or sale of assets, and only under equivalent privacy commitments</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="mt-6 text-sm text-muted-foreground">
                                        Every outside party that processes personal data on our behalf is bound by a written agreement covering confidentiality, security, and use limited to the purpose we specify — see our companion document, "Privacy Clauses for Agreements &amp; Vendor Contracts."
                                    </p>
                                    <p className="mt-4 text-sm text-muted-foreground">
                                        We keep an up-to-date list of active vendors and partners internally and will name a new one here before we start sharing data with them.
                                    </p>
                                </div>

                                <div id="cookies" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Cookies</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>We use strictly necessary cookies to run the Platform, and, with your consent, analytics, functional and marketing cookies.</p>
                                        <p>You can manage these at any time from the cookie preferences panel in the Platform footer.</p>
                                        <p>Full details are set out in our <a href="/cookies-policy" className="text-primary hover:underline font-semibold">Cookies Policy</a>.</p>
                                    </div>
                                </div>

                                <div id="retention" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Data Retention</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>We keep personal data only as long as we need it, and never longer than our Data Retention Policy allows.</p>
                                        <p>In short:</p>
                                        <ul className="space-y-2">
                                            <li>• account data is cleared or anonymized within 30 days of account closure;</li>
                                            <li>• gameplay and learning data is kept in aggregate after 24 months;</li>
                                            <li>• reports are de-identified after 12 months;</li>
                                            <li>• backups roll over within 35 days.</li>
                                        </ul>
                                        <p>Full retention periods, by data category, are set out in the <a href="/data-retention" className="text-primary hover:underline font-semibold">Data Retention Policy</a>.</p>
                                    </div>
                                </div>

                                <div id="rights" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Your Rights</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>Subject to Ethiopian law, you have the right to:</p>
                                        <ul className="space-y-3">
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> Access the personal data we hold about you.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> Correct inaccurate or incomplete data.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> Delete your account and have your personal data anonymized, as described in our Data Retention Policy.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> Object to, or ask us to restrict, certain processing.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> Withdraw consent at any time, where we rely on consent — this will not affect processing carried out before you withdrew it.</li>
                                            <li className="flex gap-3"><ChevronRight size={18} className="text-primary shrink-0 mt-0.5" /> Ask questions about, and lodge a complaint about, how we handle your data — including with Ethiopia's data protection authority under Proclamation No. 1321/2024.</li>
                                        </ul>
                                        <p>You can exercise most of these rights directly from your account settings, or by contacting us using the details below.</p>
                                        <div className="p-6 bg-secondary/20 rounded-xl border-l-4 border-primary mt-6">
                                            <p className="text-sm font-semibold">We reply within five working days and complete requests within 30 days.</p>
                                        </div>
                                    </div>
                                </div>

                                <div id="children" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Children and Young People</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>Horizon Truth is designed for young people aged roughly 16 to 25.</p>
                                        <p>You must be at least 13 to create an account.</p>
                                        <p>If you are under 18, we ask that a parent or guardian help you review this policy before you sign up.</p>
                                        <p>We do not knowingly collect personal information from anyone under 13 without verifiable parental consent; if we learn that we have, we will delete it.</p>
                                        <div className="p-6 bg-secondary/20 rounded-xl border mt-6">
                                            <h4 className="font-bold text-foreground mb-3">For users under 18:</h4>
                                            <ul className="space-y-2">
                                                <li>• we cap retention at 12 months after last activity;</li>
                                                <li>• we never include their data in a published dataset;</li>
                                                <li>• we never send it outside Ethiopia.</li>
                                            </ul>
                                        </div>
                                        <p>If you are a parent or guardian and believe your child has given us information without your consent, please contact us and we will remove it.</p>
                                    </div>
                                </div>

                                <div id="security" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Data Security</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>We use technical and organizational measures appropriate to the risk, including:</p>
                                        <ul className="space-y-2">
                                            <li>• password hashing;</li>
                                            <li>• role-based access control for our team;</li>
                                            <li>• input validation on everything the Platform accepts;</li>
                                            <li>• audit logging of administrative and moderation actions.</li>
                                        </ul>
                                        <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-6">
                                            <div className="flex gap-3">
                                                <AlertTriangle size={18} className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                                                <p className="text-sm">
                                                    No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
                                                </p>
                                            </div>
                                        </div>
                                        <p>If a breach affecting your personal data occurs, we will notify affected users and the relevant authority as required by law.</p>
                                    </div>
                                </div>

                                <div id="storage" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Where Your Data Is Stored</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>Personal data collected in Ethiopia is stored in Ethiopia, in line with Proclamation No. 1321/2024.</p>
                                        <p>Where we use an outside service provider located elsewhere, for example our email delivery provider, we limit what we send to what that service needs to do its job, and require it to protect the data under a written agreement.</p>
                                    </div>
                                </div>

                                <div id="changes" className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-6">Changes to This Policy</h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>We may update this policy as the Platform, our vendors, or the law change.</p>
                                        <p>We will post the new version here with an updated effective date, and for material changes we will let registered users know in advance.</p>
                                    </div>
                                </div>

                                <div id="contact" className="scroll-mt-32 p-10 bg-primary rounded-3xl text-primary-foreground shadow-2xl">
                                    <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
                                    <p className="opacity-80 mb-8">Questions, requests, or complaints about this policy:</p>
                                    <div className="grid md:grid-cols-2 gap-8 font-bold">
                                        <div className="space-y-2">
                                            <p className="text-lg">Dabbal Software Development PLC</p>
                                            <p className="opacity-90">Gobena Aba Tigu St</p>
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
                                        <p>Version 1.0 &middot; Effective August 25, 2026</p>
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
