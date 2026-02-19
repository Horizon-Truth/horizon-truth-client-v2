import { ArrowRight, ShieldCheck, Zap, Globe, Github, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";

export default function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <ShieldCheck className="text-primary-foreground w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">HORIZON TRUTH</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
                            <button
                                onClick={() => navigate("/report")}
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Crowdsourcing
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="text-sm font-medium px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2"
                            >
                                Launch App <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Mobile Navigation Trigger */}
                        <div className="md:hidden flex items-center">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="w-6 h-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] flex flex-col p-6">
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                            <ShieldCheck className="text-primary-foreground w-5 h-5" />
                                        </div>
                                        <span className="text-xl font-bold tracking-tight">HORIZON</span>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <a href="#features" className="text-lg font-medium hover:text-primary transition-colors">Features</a>
                                        <a href="#about" className="text-lg font-medium hover:text-primary transition-colors">About</a>
                                        <button
                                            onClick={() => navigate("/report")}
                                            className="text-left text-lg font-medium hover:text-primary transition-colors"
                                        >
                                            Crowdsourcing
                                        </button>
                                        <hr className="border-border" />
                                        <button
                                            onClick={() => navigate("/login")}
                                            className="text-left text-lg font-medium hover:text-primary transition-colors"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => navigate("/dashboard")}
                                            className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                        >
                                            Launch App <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">v2.0 is now live</span>
                    </div>
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Trust Infrastructure <br className="hidden md:block" /> for the Next Generation
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Horizon Truth provides a robust, decentralized integrity layer for modern applications.
                        Scale your operations with confidence and verifiable security.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate("/register")}
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            Get Started for Free <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 text-lg border border-border"
                        >
                            Login to Account
                        </button>
                    </div>
                </div>
            </section>
            ...

            {/* Features Grid */}
            <section id="features" className="py-24 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
                        <p className="text-muted-foreground">Everything you need to secure your digital assets.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Lighting Fast", desc: "Real-time verification with millisecond latency for any transaction type." },
                            { icon: Globe, title: "Global Scale", desc: "Distribute your truth nodes across 40+ regions worldwide seamlessly." },
                            { icon: ShieldCheck, title: "Air-Tight Guard", desc: "Advanced cryptographic proofs ensure your data remains untampered." }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 bg-card border rounded-2xl hover:border-primary/50 transition-all hover:shadow-lg">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                    <feature.icon className="text-primary group-hover:text-primary-foreground w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b pb-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                    <ShieldCheck className="text-primary-foreground w-4 h-4" />
                                </div>
                                <span className="font-bold">HORIZON TRUTH</span>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Building the foundations of trust for the digital sovereign.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">© 2026 Horizon Truth. All rights reserved.</p>
                    <div className="flex gap-6 text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors"><ShieldCheck size={18} /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Globe size={18} /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Github size={18} /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
