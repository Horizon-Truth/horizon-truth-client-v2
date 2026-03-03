import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ShieldAlert,
    ArrowLeft,
    CheckCircle2,
    Info
} from "lucide-react";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { Button } from "@/shared/components/ui/button";
import { ReportForm } from "./components/ReportForm";
import { AuthModal } from "@/shared/components/auth/AuthModal";

export default function ReportSubmissionPage() {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");

    const handleSuccess = () => {
        setIsSubmitted(true);
        setTimeout(() => navigate("/crowdsourcing"), 3000);
    };

    const openAuth = (mode: "login" | "register") => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false);
    };

    if (isSubmitted) {
        return (
            <PublicLayout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-6 max-w-lg"
                    >
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tight">Intelligence Received</h1>
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                            Thank you for your contribution to digital integrity. Your report has been entered into our database for community verification.
                        </p>
                        <div className="pt-8">
                            <Button
                                onClick={() => navigate("/crowdsourcing")}
                                className="h-12 rounded-xl px-8 font-black uppercase tracking-widest bg-primary hover:shadow-lg hover:shadow-primary/20"
                            >
                                Return to Dashboard
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-background relative overflow-hidden pb-20">
                {/* Decorative Background */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header Section */}
                    <div className="py-12 md:py-20">
                        <motion.button
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            onClick={() => navigate("/crowdsourcing")}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-black text-xs uppercase tracking-widest group mb-12"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Dashboard
                        </motion.button>

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            <div className="max-w-2xl">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
                                >
                                    <ShieldAlert size={14} className="text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Incident Reporting Module</span>
                                </motion.div>
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]"
                                >
                                    Register <span className="text-primary">New Case</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg text-muted-foreground mt-6 font-medium max-w-xl"
                                >
                                    Provide accurate details regarding the misinformation or incident you've encountered. Your data empowers the community to verify the truth.
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="hidden lg:flex flex-col items-end text-right"
                            >
                                <div className="text-3xl font-black text-primary/20 select-none tracking-tighter">TRUTH-V1</div>
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Status: Ready for Intake</div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Form and Guide Grid */}
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* Form Card */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="lg:col-span-8"
                        >
                            <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden">
                                <div className="p-8 md:p-12">
                                    <ReportForm
                                        onSuccess={handleSuccess}
                                        onRequireAuth={() => openAuth("login")}
                                        onCancel={() => navigate("/crowdsourcing")}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Guide Sidebar */}
                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="lg:col-span-4 space-y-8"
                        >
                            <div className="bg-primary p-10 rounded-[2.5rem] text-primary-foreground shadow-xl shadow-primary/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-[2s]" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                                    <Info className="opacity-50" /> Filing Guide
                                </h3>
                                <ul className="space-y-8">
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 font-black text-xs border border-white/20">01</div>
                                        <div>
                                            <p className="font-bold text-sm uppercase tracking-wide">Clear Title</p>
                                            <p className="text-xs opacity-70 mt-1 leading-relaxed">Summarize the core claim in a few powerful words for immediate recognition.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 font-black text-xs border border-white/20">02</div>
                                        <div>
                                            <p className="font-bold text-sm uppercase tracking-wide">Source Verification</p>
                                            <p className="text-xs opacity-70 mt-1 leading-relaxed">Provide the direct URL where the content originated for evidence gathering.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 font-black text-xs border border-white/20">03</div>
                                        <div>
                                            <p className="font-bold text-sm uppercase tracking-wide">Dossier Detail</p>
                                            <p className="text-xs opacity-70 mt-1 leading-relaxed">Explain the specific falsehoods or misleading elements within the report.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-10 bg-secondary/10 border-2 border-dashed border-secondary/20 rounded-[2.5rem] hover:bg-secondary/20 transition-colors">
                                <h4 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <ShieldAlert size={20} className="text-secondary" /> Accountability
                                </h4>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    Incident reporting requires verifiable identity to maintain the integrity of our crowdsourced intelligence network.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
                onSuccess={handleAuthSuccess}
            />
        </PublicLayout>
    );
}
