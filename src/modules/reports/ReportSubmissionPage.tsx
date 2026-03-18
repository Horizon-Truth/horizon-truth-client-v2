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
