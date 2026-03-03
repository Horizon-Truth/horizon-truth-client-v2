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
                        <Button
                            onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-lg"
                        >
                            {t("about.ourStory")}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => document.getElementById('our-team')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-lg"
                        >
                            {t("about.meetTeam")}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section id="our-story" className="py-32 bg-background overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                                <History size={16} className="text-secondary" />
                                <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">{t("about.genesisEyebrow")}</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                                {t("about.storyTitle")} <br />
                                <span className="text-primary italic">{t("about.storyTitleHighlight")}</span>
                            </h2>

                            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                                {t("about.storyP1")}
                            </p>

                            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                                {t("about.storyP2")}
                            </p>

                            <Button
                                onClick={() => navigate("/contact")}
                                className="rounded-2xl px-10 py-8 text-xl font-black bg-secondary text-secondary-foreground hover:shadow-2xl transition-all group"
                            >
                                {t("common.getInTouch")} <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={24} />
                            </Button>
                        </motion.div>