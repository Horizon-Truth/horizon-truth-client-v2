import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeroProps {
    title: string;
    subtitle: string;
    description: string;
    badge?: string;
    icon?: ReactNode;
    children?: ReactNode;
}

export const PageHero = ({ title, subtitle, description, badge, icon, children }: PageHeroProps) => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-background" aria-label={title}>
            {/* Ambient Background Blurs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        {badge && (
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                                {icon && <span className="text-primary">{icon}</span>}
                                <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">{badge}</span>
                            </div>
                        )}

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]">
                            {title} <br />
                            <span className="text-primary">{subtitle}</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                            {description}
                        </p>

                        {children && (
                            <div className="pt-4">
                                {children}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Decorative Glass Element */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </section>
    );
};
