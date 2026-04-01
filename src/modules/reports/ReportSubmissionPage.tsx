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
    const [authResolved, setAuthResolved] = useState(0);

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
        // Signal the form that authentication completed so it can resume the pending submission.
        setAuthResolved((n) => n + 1);
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