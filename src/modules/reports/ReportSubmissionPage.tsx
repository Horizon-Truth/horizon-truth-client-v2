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