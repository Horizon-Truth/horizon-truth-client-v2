import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Mail, Users, Gamepad, Trophy, Megaphone, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { newsletterService } from "@/services/newsletter.service";
import { statsService, type PublicStats } from "@/services/stats.service";
import { useTranslation } from "@/shared/i18n/useTranslation";

const slideMeta = [
    {
        id: 1,
        key: "slide1",
        image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=2070",
        ctaLink: "/dashboard/game",
    },
    {
        id: 2,
        key: "slide2",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2070",
        ctaLink: "/crowdsourcing",
    },
    {
        id: 3,
        key: "slide3",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2070",
        ctaLink: "/about",
    },
];

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const { setGuest } = useAuthStore();
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slideMeta.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const slide = slideMeta[currentIndex];

    return (
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-black">
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <img
                        src={slide.image}
                        alt={t(`landing.${slide.key}Title`)}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 backdrop-blur-md border border-white/20 mb-2">
                                <ShieldCheck size={14} className="text-primary-foreground" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{t(`landing.${slide.key}Badge`)}</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-tight">
                                {t(`landing.${slide.key}Title`)} <br />
                                <span className="text-primary-foreground italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-90">{t(`landing.${slide.key}Subtitle`)}</span>
                            </h1>

                            <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed font-medium">
                                {t(`landing.${slide.key}Desc`)}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
                                <Button
                                    onClick={() => navigate(slide.ctaLink)}
                                    className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-12 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.2em] shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all border-none w-full sm:w-auto"
                                >
                                    {t(`landing.${slide.key}Cta`)}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {