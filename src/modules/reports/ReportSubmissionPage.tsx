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
