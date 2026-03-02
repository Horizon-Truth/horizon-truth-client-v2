import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Mail, Users, Gamepad, Trophy, BookOpen, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";

const carouselSlides = [
    {
        id: 1,
        title: "Empowering Minds,",
        subtitle: "Fighting Misinformation",
        description: "Horizon Truth provides interactive tools and resources to help individuals identify and combat misinformation. Through gamified learning and community-driven verification, we are building a more informed and transparent society.",
        image: "/src/assets/hero-1.png",
        ctaText: "Start the Game",
        ctaLink: "/dashboard/game",
        badge: "Verified community content"
    },
    {
        id: 2,
        title: "Collective Intelligence,",
        subtitle: "Community Verification",
        description: "Join thousands of users in reporting and verifying suspicious content. Our crowdsourced platform leverages the power of the community to ensure information integrity in the digital age.",
        image: "/src/assets/hero-2.png",
        ctaText: "Explore Reports",
        ctaLink: "/crowdsourcing",
        badge: "Crowdsourced Integrity"
    },
    {
        id: 3,
        title: "Future-Ready Skills,",
        subtitle: "Gamified Education",
        description: "Learn to navigate the complex information landscape through fun and engaging challenges. Earn rewards as you master the art of critical thinking and digital literacy.",
        image: "/src/assets/hero-3.png",
        ctaText: "Get Started",
        ctaLink: "/about",
        badge: "Learn & Earn"
    }
];

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const slide = carouselSlides[currentIndex];

    return (
        <section className="relative min-h-[600px] lg:h-[80vh] flex items-center overflow-hidden bg-background">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10" />
                    <img
                        src={slide.image}
                        alt={slide.subtitle}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
                <div className="max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                                <ShieldCheck size={16} className="text-primary" />
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{slide.badge}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
                                {slide.title}<br />
                                <span className="text-primary">{slide.subtitle}</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                                {slide.description}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    onClick={() => navigate(slide.ctaLink)}
                                    className="w-full sm:w-auto px-8 py-6 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
                                >
                                    {slide.ctaText} <ArrowRight size={20} />
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Carousel Indicators */}
                    <div className="flex items-center gap-3 mt-16">
                        {carouselSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-12 bg-primary" : "w-3 bg-primary/20 hover:bg-primary/40"
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
            <HeroCarousel />

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
