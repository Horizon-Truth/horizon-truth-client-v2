import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Mail, Users, Gamepad, Trophy, Megaphone, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { newsletterService } from "@/services/newsletter.service";

const carouselSlides = [
    {
        id: 1,
        title: "Defending Truth in the Digital Age",
        subtitle: "Together Against Misinformation",
        description: "Horizon Truth equips you with interactive, real-world simulations to detect fake news, analyze sources, and outsmart digital deception through engaging gamified experiences.",
        image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=2070", // Person analyzing news on laptop
        ctaText: "Start Your Training",
        ctaLink: "/dashboard/game",
        badge: "Community Verified Content"
    },
    {
        id: 2,
        title: "Power of Collective Intelligence",
        subtitle: "Community-Driven Verification",
        description: "Join a growing network of digital defenders reporting, reviewing, and validating suspicious content. Together, we create a safer and more trustworthy information ecosystem.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2070", // Team collaboration discussion
        ctaText: "View Community Reports",
        ctaLink: "/crowdsourcing",
        badge: "Crowdsourced Transparency"
    },
    {
        id: 3,
        title: "Learn. Play. Protect.",
        subtitle: "Gamified Digital Literacy",
        description: "Sharpen your critical thinking skills through interactive challenges, quizzes, and scenario-based missions designed to make media literacy engaging and rewarding.",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2070", // Student learning with digital tools
        ctaText: "Begin the Journey",
        ctaLink: "/about",
        badge: "Skill Up & Earn Rewards"
    }
];

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const { setGuest } = useAuthStore();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const slide = carouselSlides[currentIndex];

    return (
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-black">
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 backdrop-blur-md border border-white/20 mb-2">
                                <ShieldCheck size={14} className="text-primary-foreground" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{slide.badge}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-tight">
                                {slide.title} <br />
                                <span className="text-primary-foreground italic text-3xl md:text-4xl lg:text-5xl opacity-90">{slide.subtitle}</span>
                            </h1>

                            <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed font-medium">
                                {slide.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="h-14 sm:h-16 px-8 sm:px-12 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.2em] shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all border-none"
                                >
                                    Access Protocol
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setGuest(true);
                                        navigate('/guest');
                                    }}
                                    className="h-14 sm:h-16 px-8 sm:px-12 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 font-black uppercase tracking-[0.2em] transition-all"
                                >
                                    Play as Guest
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Indicators */}
                    <div className="flex items-center justify-center gap-2 mt-12">
                        {carouselSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1 rounded-full transition-all duration-500 ${index === currentIndex ? "w-10 bg-primary" : "w-3 bg-white/20 hover:bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setLoading(true);
            try {
                await newsletterService.subscribe(email);
                toast.success("Newsletter Subscription Successful! You will receive an email reservation notification.");
                setIsSubscribed(true);
                setEmail("");
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to subscribe. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <PublicLayout>
            <HeroCarousel />

            {/* Game Explanation Section */}
            <section className="py-24 bg-background overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2"
                        >
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Interactive Learning</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Master Digital Literacy <br /><span className="text-primary">Through Play</span></h2>
                            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                                Our gamified platform transforms complex media literacy concepts into engaging challenges. Learn to spot deepfakes, verify sources, and understand viral mechanics in a safe, simulated environment.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    { title: "Real Scenarios", desc: "Face actual misinformation cases reconstructed for learning." },
                                    { title: "Instant Feedback", desc: "Understand why content is misleading as you play." },
                                    { title: "Skill Progression", desc: "Level up your 'Truth-Seeker' rank as you master new skills." },
                                    { title: "Earn Rewards", desc: "Get recognized for your growth with badges and points." }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-2 p-4 rounded-3xl bg-primary/5 border border-primary/10">
                                        <h4 className="font-extrabold text-foreground">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[4rem] flex items-center justify-center p-8 relative">
                                <div className="absolute inset-0 border-2 border-primary/20 rounded-[4rem] animate-pulse" />
                                <Gamepad size={200} className="text-primary drop-shadow-2xl" />
                                <div className="absolute -top-4 -right-4 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl animate-bounce">
                                    <Trophy size={40} className="text-yellow-500" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Crowdsourcing Explanation Section */}
            <section className="py-24 bg-secondary/5 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Collective Intelligence</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Together Against Deception</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Harness the power of thousands. Our community-driven reporting system allows every user to be a guardian of the digital truth.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Megaphone,
                                title: "Report Suspicious Content",
                                desc: "Find something fishy? Flag it instantly for community review with our simple reporting tools.",
                                color: "text-primary"
                            },
                            {
                                icon: Users,
                                title: "Community Verification",
                                desc: "Join the 'Truth Nodes'—users who vote and provide evidence to verify or debunk reported content.",
                                color: "text-secondary"
                            },
                            {
                                icon: ShieldCheck,
                                title: "Consensus Credibility",
                                desc: "Our algorithm calculates a credibility score based on community consensus and expert verification.",
                                color: "text-green-500"
                            }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                className="group p-10 bg-card border rounded-[3rem] hover:border-primary/50 transition-all hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -rotate-45 translate-x-12 -translate-y-12 group-hover:bg-primary/10 transition-all" />
                                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8">
                                    <card.icon className={`${card.color}`} size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4">{card.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Redesigned Mission Section */}
            <section className="py-24 bg-background relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2"
                        >
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Our North Star</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Why Horizon <br /><span className="text-primary">Truth Matters</span></h2>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                In an era where information can be weaponized, truth is our most valuable asset. We believe that empowering citizens with critical thinking is more effective than any censorship.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { title: "Radical Transparency", desc: "Every verification is backed by community consensus and open data." },
                                    { title: "Empowerment First", desc: "We don't tell you what to believe; we give you the tools to decide." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-6 rounded-3xl bg-secondary/5 border border-secondary/10 hover:border-secondary transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                                            <ShieldCheck className="text-secondary" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-foreground text-lg">{item.title}</h4>
                                            <p className="text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75" />
                                <div className="relative z-10 p-1 rounded-[3rem] bg-gradient-to-br from-primary/30 to-secondary/30">
                                    <div className="bg-background rounded-[2.8rem] p-12 aspect-square flex flex-col justify-center">
                                        <h3 className="text-6xl font-black text-center mb-4">98%</h3>
                                        <p className="text-center text-muted-foreground font-bold uppercase tracking-widest text-sm">User Confidence Score</p>
                                        <div className="mt-8 flex justify-center gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Trophy key={star} className="text-yellow-500" size={32} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Redesigned Partners Section (Migrated from About) */}
            <section className="py-24 bg-secondary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Trusted Ecosystem</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Our Foundational Partners</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Collaborating with leading institutions to build digital resilience across the nation.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Jimma University", desc: "Academic curriculum integration & research." },
                            { title: "Ministry of Peace", desc: "National youth ambassador programs." },
                            { title: "Sheger City", desc: "Community-driven digital literacy workshops." }
                        ].map((partner, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="p-10 rounded-[3rem] bg-background border-2 border-transparent hover:border-primary/20 shadow-xl transition-all flex flex-col items-center text-center"
                            >
                                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 text-2xl font-black text-primary">
                                    {partner.title[0]}
                                </div>
                                <h4 className="text-2xl font-black mb-4">{partner.title}</h4>
                                <p className="text-muted-foreground font-medium">{partner.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Redesigned Stats Section */}
            <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "Active Users", value: "5,247+" },
                            { label: "Reports Debunked", value: "2,847+" },
                            { label: "Community Verifiers", value: "1,592+" },
                            { label: "Accuracy Rate", value: "99.8%" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="text-5xl md:text-6xl font-black mb-4 tracking-tight">{stat.value}</div>
                                <div className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Redesigned FAQ Section */}
            <section id="faq" className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/3">
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Help Center</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-6">Expert <br />Answers</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Quick guide to understanding how Horizon Truth protects the digital frontier.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/faq")}
                                className="px-8 py-6 rounded-2xl font-bold border-2 flex items-center gap-2 group"
                            >
                                Full Knowledge Base <ArrowRight size={20} className="group-hover:translate-x-1 transition-all" />
                            </Button>
                        </div>
                        <div className="lg:w-2/3 space-y-4">
                            {[
                                { q: "What is Horizon Truth?", a: "A gamified digital literacy platform designed to combat misinformation through interactive learning and community verification." },
                                { q: "How does the game work?", a: "You engage in simulated real-world misinformation challenges, learning to spot fake news through quizzes and critical exercises." },
                                { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption and collect minimal data necessary for your learning progress." },
                                { q: "How can I contribute?", a: "By reporting suspicious content you find online and participating in community verification votes." }
                            ].map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 bg-secondary/5 border rounded-[2rem] hover:border-primary/30 transition-all group"
                                >
                                    <h4 className="text-xl font-black mb-3 flex items-center justify-between">
                                        {faq.q}
                                    </h4>
                                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right transform scale-110" />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-gradient-to-br from-card to-background border border-primary/20 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:bg-secondary/20 transition-all duration-700" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {isSubscribed ? (
                                <div className="animate-in fade-in zoom-in duration-500 py-4 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                                        <CheckCircle size={40} className="text-primary relative z-10" />
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Welcome to the Frontline</h2>
                                    <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                                        Your subscription is confirmed. You are now part of a global network of digital defenders. Watch your inbox for high-priority updates.
                                    </p>
                                    <Button
                                        onClick={() => setIsSubscribed(false)}
                                        variant="ghost"
                                        className="text-primary font-bold hover:bg-primary/5 rounded-xl"
                                    >
                                        Subscribe another email
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 transform group-hover:rotate-12 transition-transform duration-500">
                                        <Mail className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Stay Ahead of Deception</h2>
                                    <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                                        Join our community of digital defenders. Subscribe to get the latest insights on media literacy, platform updates, and verified news straight to your inbox.
                                    </p>

                                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                                        <div className="relative flex-1">
                                            <input
                                                type="email"
                                                placeholder="Enter your email address"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-14 px-6 rounded-2xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary bg-background/50 backdrop-blur-sm transition-all"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={loading}
                                            className="h-14 rounded-2xl px-10 font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all"
                                        >
                                            {loading ? "Subscribing..." : "Subscribe Now"}
                                            <ArrowRight size={20} className="ml-2" />
                                        </Button>
                                    </form>
                                </>
                            )}
                            {!isSubscribed && (
                                <p className="mt-6 text-xs text-muted-foreground opacity-70">
                                    By subscribing, you agree to our <span className="underline cursor-pointer">Privacy Policy</span>. No spam, just truth.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
