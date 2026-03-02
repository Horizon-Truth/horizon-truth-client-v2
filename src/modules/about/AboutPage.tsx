import { motion } from "framer-motion";
import { ShieldCheck, Target, Eye, Lightbulb, Users, GraduationCap, ArrowRight, Calendar, History } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import TeamSection from "./components/TeamSection";

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-primary/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        About <span className="text-primary">Horizon Truth</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        We're on a mission to combat misinformation through education, technology, and community engagement.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-lg"
                        >
                            Our Story
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => document.getElementById('our-team')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-lg"
                        >
                            Meet Our Team
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
                                <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">Our Genesis</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                                How Horizon <br />
                                <span className="text-primary italic">Truth Began.</span>
                            </h2>

                            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                                Horizon Truth was founded in 2023 by a team of digital literacy advocates, educators, and technology experts who recognized the growing threat of misinformation in our increasingly connected world.
                            </p>

                            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                                What started as a university research project quickly evolved into a comprehensive platform dedicated to helping individuals, especially youth, develop the critical thinking skills needed to navigate today's complex information landscape.
                            </p>

                            <Button
                                onClick={() => navigate("/contact")}
                                className="rounded-2xl px-10 py-8 text-xl font-black bg-secondary text-secondary-foreground hover:shadow-2xl transition-all group"
                            >
                                Get in Touch <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={24} />
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
                                    The Journey
                                </h3>

                                <div className="space-y-12">
                                    {[
                                        { title: "Research Phase", date: "Jan 2023 - April 2023", desc: "Conducted extensive research on misinformation patterns and digital literacy gaps." },
                                        { title: "Platform Development", date: "May 2023 - Sept 2023", desc: "Built the initial version of our gamified learning platform and community tools." },
                                        { title: "Launch & Growth", date: "Oct 2023 - Present", desc: "Launched publicly and continuously expanded our resources based on feedback." }
                                    ].map((item, i) => (
                                        <div key={i} className="relative pl-12 border-l-4 border-primary/20">
                                            <div className="absolute left-[-14px] top-0 w-6 h-6 rounded-full bg-primary border-4 border-background" />
                                            <h4 className="text-2xl font-black mb-1">{item.title}</h4>
                                            <p className="text-sm text-primary font-black uppercase tracking-widest mb-3">{item.date}</p>
                                            <p className="text-lg text-muted-foreground font-medium leading-normal">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-32 bg-secondary/5 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12">
                        {[
                            {
                                icon: Target,
                                title: "Our Mission",
                                desc: "To empower individuals with the critical thinking skills and digital literacy needed to identify, analyze, and combat misinformation in all its forms, creating a more informed and resilient society.",
                                color: "text-primary",
                                bg: "bg-primary/10"
                            },
                            {
                                icon: Eye,
                                title: "Our Vision",
                                desc: "We envision a world where individuals are equipped to navigate the digital landscape responsibly, where truth prevails over falsehood, and where communities collaboratively foster information integrity.",
                                color: "text-secondary",
                                bg: "bg-secondary/10"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                whileHover={{ y: -5 }}
                                className="p-12 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[3rem] shadow-xl dark:bg-white/5 dark:border-white/10 group"
                            >
                                <div className={`w-20 h-20 ${item.bg} rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500`}>
                                    <item.icon className={`${item.color} w-10 h-10`} />
                                </div>
                                <h3 className="text-4xl font-black mb-6">{item.title}</h3>
                                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-32 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs">Our North Star</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Intrinsic <span className="text-primary">Values.</span></h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, title: "Integrity", desc: "We practice what we preach, ensuring our content is accurate and transparent." },
                            { icon: Lightbulb, title: "Innovation", desc: "We continuously develop new approaches to make digital literacy engaging." },
                            { icon: Users, title: "Collaboration", desc: "We believe combating misinformation requires collective effort." },
                            { icon: GraduationCap, title: "Education", desc: "We prioritize empowering people with knowledge over simply debunking." }
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="p-10 bg-secondary/5 border-2 border-transparent hover:border-primary/20 rounded-[2.5rem] text-center transition-all duration-500"
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                    <value.icon className="text-primary w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black mb-4">{value.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Team Section */}
            <TeamSection />

            {/* CTA Section */}
            <section className="py-32 bg-secondary/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-10"
                    >
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                            Ready to Join <br />
                            <span className="text-primary italic">the Fight?</span>
                        </h2>

                        <p className="text-2xl text-muted-foreground font-medium leading-relaxed">
                            Sign up now and start your journey towards becoming a misinformation warrior today.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Button
                                onClick={() => navigate("/dashboard/game")}
                                className="w-full sm:w-auto px-12 py-10 rounded-[2rem] font-black text-2xl bg-primary text-primary-foreground hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-2 transition-all group"
                            >
                                Start Playing <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={32} />
                            </Button>
                            <Button
                                onClick={() => navigate("/contact")}
                                variant="outline"
                                className="w-full sm:w-auto px-12 py-10 rounded-[2rem] font-black text-2xl border-4 hover:bg-white/10 transition-all"
                            >
                                Contact Us
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
