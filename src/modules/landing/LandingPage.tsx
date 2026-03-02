import { ArrowRight, ShieldCheck, Mail, Users, Gamepad, Trophy, BookOpen, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";

export default function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            toast.success("Newsletter Subscription Successful! You will receive an email reservation notification.");
            setEmail("");
        }
    };

    return (
        <PublicLayout>
            {/* Hero Section */}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <ShieldCheck size={16} className="text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Verified community content</span>
                    </div>
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Empowering Minds,<br />
                        <span className="text-primary">Fighting Misinformation</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Horizon Truth provides interactive tools and resources to help individuals identify and combat misinformation.
                        Through gamified learning and community-driven verification, we are building a more informed and transparent society.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            onClick={() => navigate("/dashboard/game")}
                            className="w-full sm:w-auto px-8 py-6 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            Start the Game <ArrowRight size={20} />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/about")}
                            className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* About Mission Section */}
            <section id="about" className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm">About Horizon Truth</span>
                            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">Our Mission to Fight Misinformation</h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Horizon Truth is dedicated to empowering individuals, especially youth, to navigate the digital world responsibly.
                                We believe that in today's fast-paced information age, digital literacy is key to making informed decisions.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { icon: Gamepad, title: "Gamified Learning", desc: "Interactive games to teach literacy skills." },
                                    { icon: Users, title: "Community Power", desc: "Crowdsourced verification for everyone." },
                                    { icon: BookOpen, title: "Educational Resources", desc: "Materials to improve media literacy." },
                                    { icon: Trophy, title: "Reward System", desc: "Earn points for your contributions." }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-secondary/20">
                                        <item.icon className="text-primary w-6 h-6 mb-2" />
                                        <h4 className="font-bold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-primary/10 rounded-3xl p-8 aspect-video flex items-center justify-center relative overflow-hidden group">
                            <ShieldCheck size={120} className="text-primary/20 group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features (Game + Crowdsource) */}
            <section id="features" className="py-24 bg-secondary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold uppercase tracking-widest text-sm">Explore Our Tools</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">Key Features of Horizon Truth</h2>
                        <p className="text-muted-foreground text-lg">Powerful tools designed to combat misinformation effectively.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Gamepad, title: "Gamified Learning Platform", desc: "Engage in fun, interactive games to boost digital literacy skills and learn to spot misinformation." },
                            { icon: Megaphone, title: "Crowdsourced Reporting", desc: "Flag and verify content through our community-driven reporting system leveraging collective intelligence." },
                            { icon: Users, title: "Community Engagement", desc: "Earn rewards and recognition for actively contributing to a more truthful digital space." }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 bg-card border rounded-2xl hover:border-primary transition-all shadow-sm hover:shadow-md">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <feature.icon className="text-primary w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed mb-6">{feature.desc}</p>
                                <button className="text-primary font-bold flex items-center gap-2 group">
                                    Read more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section / How It Works */}
            <section className="py-24 bg-primary text-primary-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="font-semibold uppercase tracking-widest text-sm opacity-80">How It Works</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 text-white">Start Fighting Misinformation Today</h2>
                        <p className="text-lg opacity-90 max-w-2xl mx-auto">Simple steps to become a misinformation warrior and earn rewards.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Engage in Scenarios", desc: "Navigate real-world challenges to understand how false content spreads." },
                            { step: "02", title: "Evaluate Content", desc: "Analyze health myths and manipulation using critical thinking tools." },
                            { step: "03", title: "Earn Rewards", desc: "Identifying misinformation earns you points and valuable rewards." }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                                <div className="text-4xl font-bold mb-4 opacity-50">{item.step}</div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="opacity-80 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Section / Stats */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Accounts Verified", value: "50k+" },
                            { label: "Reports Analyzed", value: "1.2M+" },
                            { label: "Truth Nodes", value: "40+" },
                            { label: "Community Members", value: "100k+" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl font-extrabold text-primary mb-2">{stat.value}</div>
                                <div className="text-muted-foreground font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-16 border-y bg-secondary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                        {/* Placeholder for Partners */}
                        <div className="text-2xl font-bold tracking-tighter">PARTNER-1</div>
                        <div className="text-2xl font-bold tracking-tighter">PARTNER-2</div>
                        <div className="text-2xl font-bold tracking-tighter">PARTNER-3</div>
                        <div className="text-2xl font-bold tracking-tighter">PARTNER-4</div>
                        <div className="text-2xl font-bold tracking-tighter">PARTNER-5</div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold uppercase tracking-widest text-sm">Got Questions?</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground text-lg">Quick answers to common questions about Horizon Truth.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                        {[
                            { q: "What is Horizon Truth?", a: "A gamified digital literacy platform designed to combat misinformation through interactive learning and community verification." },
                            { q: "How does the game work?", a: "You engage in simulated real-world misinformation challenges, learning to spot fake news through quizzes and critical exercises." },
                            { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption and collect minimal data necessary for your learning progress." },
                            { q: "How can I contribute?", a: "By reporting suspicious content you find online and participating in community verification votes." }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 bg-secondary/10 rounded-2xl border border-border">
                                <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                                <p className="text-muted-foreground text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/faq")}
                            className="px-8 py-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-lg mx-auto"
                        >
                            View All FAQs <ArrowRight size={20} />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 bg-primary/5 border-t">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
                    <p className="text-muted-foreground mb-8 text-lg">Subscribe to our newsletter and receive an email reservation notification for upcoming platform features.</p>
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 h-12 px-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        />
                        <Button type="submit" size="lg" className="rounded-xl px-8">Subscribe</Button>
                    </form>
                </div>
            </section>

        </PublicLayout>
    );
}
