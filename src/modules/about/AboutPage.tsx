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

                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-1/2 w-full"
                        >
                            <div className="relative p-10 rounded-[3rem] bg-secondary/5 border-4 border-secondary/10 backdrop-blur-xl shadow-2xl">
                                <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />

                                <h3 className="text-3xl font-black mb-10 flex items-center gap-3">
                                    <Calendar className="text-primary" size={32} />
                                    {t("about.journeyTitle")}
                                </h3>

                                <div className="space-y-12">
                                    {[
                                        { title: t("about.journey1Title"), date: t("about.journey1Date"), desc: t("about.journey1Desc") },
                                        { title: t("about.journey2Title"), date: t("about.journey2Date"), desc: t("about.journey2Desc") },
                                        { title: t("about.journey3Title"), date: t("about.journey3Date"), desc: t("about.journey3Desc") }
                                    ].map((item, i) => (
                                        <div key={i} className="relative pl-12 border-l-4 border-primary/20">
                                            <div className="absolute left-[-14px] top-0 w-6 h-6 rounded-full bg-primary border-4 border-background" />
                                            <h4 className="text-2xl font-black mb-1">{item.title}</h4>
                                            <p className="text-sm text-primary font-black uppercase tracking-widest mb-3">{item.date}</p>
                                            <p className="text-lg text-muted-foreground font-medium leading-normal">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>