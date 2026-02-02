import { motion } from "framer-motion";
import { ShieldCheck, Target, Eye, Lightbulb, Users, GraduationCap, ArrowRight, Calendar, History } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import TeamSection from "./components/TeamSection";
import { useTranslation } from "@/shared/i18n/useTranslation";

export default function AboutPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-primary/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        {t("about.heroTitle")} <span className="text-primary">{t("about.heroHighlight")}</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t("about.heroDesc")}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">