import { ShieldCheck, Target, Eye, Lightbulb, Users, GraduationCap, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-primary/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <ShieldCheck size={16} className="text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Empowering Digital Citizens Since 2023</span>
                    </div>
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
            <section id="our-story" className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Our Story</span>
                            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">How Horizon Truth Began</h2>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                Horizon Truth was founded in 2023 by a team of digital literacy advocates, educators, and technology experts who recognized the growing threat of misinformation in our increasingly connected world.
                            </p>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                What started as a university research project quickly evolved into a comprehensive platform dedicated to helping individuals, especially youth, develop the critical thinking skills needed to navigate today's complex information landscape.
                            </p>
                            <Button onClick={() => navigate("/contact")} className="rounded-xl px-8 py-6 text-lg font-bold">
                                Get in Touch
                            </Button>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="bg-secondary/20 p-8 rounded-3xl border border-border">
                                <h3 className="text-2xl font-bold mb-8">Our Journey</h3>
                                <div className="space-y-8">
                                    {[
                                        { title: "Research Phase", date: "Jan 2023 - April 2023", desc: "Conducted extensive research on misinformation patterns and digital literacy gaps." },
                                        { title: "Platform Development", date: "May 2023 - Sept 2023", desc: "Built the initial version of our gamified learning platform and community tools." },
                                        { title: "Launch & Growth", date: "Oct 2023 - Present", desc: "Launched publicly and continuously expanded our resources based on feedback." }
                                    ].map((item, i) => (
                                        <div key={i} className="relative pl-8 border-l-2 border-primary/30">
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary" />
                                            <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                                            <p className="text-sm text-primary font-semibold mb-2">{item.date}</p>
                                            <p className="text-muted-foreground">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 bg-secondary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="p-10 bg-card border rounded-3xl shadow-sm hover:shadow-md transition-all text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Target className="text-primary w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                To empower individuals with the critical thinking skills and digital literacy needed to identify, analyze, and combat misinformation in all its forms, creating a more informed and resilient society.
                            </p>
                        </div>
                        <div className="p-10 bg-card border rounded-3xl shadow-sm hover:shadow-md transition-all text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Eye className="text-primary w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We envision a world where individuals are equipped to navigate the digital landscape responsibly, where truth prevails over falsehood, and where communities collaboratively foster information integrity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold uppercase tracking-widest text-sm">What We Stand For</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4">Our Values</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, title: "Integrity", desc: "We practice what we preach, ensuring our content is accurate and transparent." },
                            { icon: Lightbulb, title: "Innovation", desc: "We continuously develop new approaches to make digital literacy engaging." },
                            { icon: Users, title: "Collaboration", desc: "We believe combating misinformation requires collective effort." },
                            { icon: GraduationCap, title: "Education", desc: "We prioritize empowering people with knowledge over simply debunking." }
                        ].map((value, i) => (
                            <div key={i} className="p-8 bg-secondary/5 border rounded-2xl text-center hover:border-primary transition-all">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                                    <value.icon className="text-primary w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners & Impact Section */}
            <section className="py-24 bg-primary text-primary-foreground overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Trusted Partners</h2>
                        <p className="text-xl opacity-90 max-w-3xl mx-auto">Working together with leading institutions to build digital literacy across Ethiopia.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Jimma University", desc: "Integrating digital literacy into academic curricula and conducting groundbreaking research." },
                            { title: "Ministry of Peace", desc: "Training youth ambassadors to promote truth and transparency nationwide." },
                            { title: "Sheger City", desc: "Bringing digital literacy programs directly to local communities and schools." }
                        ].map((partner, i) => (
                            <div key={i} className="p-8 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
                                <h4 className="text-2xl font-bold mb-4">{partner.title}</h4>
                                <p className="opacity-80 leading-relaxed">{partner.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 text-center">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Active Users", value: "5,247+" },
                                { label: "Reports Submitted", value: "2,847+" },
                                { label: "Content Verified", value: "1,592+" },
                                { label: "User Satisfaction", value: "98%" }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-4xl font-extrabold mb-2">{stat.value}</div>
                                    <div className="opacity-80 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="our-team" className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold uppercase tracking-widest text-sm">Our Team</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">Meet The Horizon Truth Team</h2>
                        <p className="text-muted-foreground text-lg">Dedicated professionals working together to combat misinformation.</p>
                    </div>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[
                            { name: "Abdurahman Abrar", role: "PI, AI & Data Science Lead" },
                            { name: "Muhammed Hassen", role: "Co-PI, Data Engineering Lead" },
                            { name: "Abdurezak Yisak", role: "Co-PI, UX/UI Designer" },
                            { name: "Mohammed Ibrahim", role: "Co-PI & Lead Content Developer" },
                            { name: "Getahun Assefa", role: "Community Manager" },
                            { name: "Ajaib Mohammed", role: "DevOps Manager" },
                            { name: "Bilkes Elias", role: "AI & ML Expert" },
                            { name: "Dr. Muhammed Mumtaz", role: "ICT Consultant" }
                        ].map((member, i) => (
                            <div key={i} className="p-6 bg-card border rounded-2xl text-center shadow-sm hover:shadow-md transition-all">
                                <div className="w-24 h-24 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-secondary-foreground font-bold text-xl">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                                <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                                <div className="flex justify-center gap-3">
                                    <button className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={18} /></button>
                                    <button className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-secondary/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Join the Fight?</h2>
                    <p className="text-xl text-muted-foreground mb-10">Sign up now and start your journey towards becoming a misinformation warrior today.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={() => navigate("/dashboard/game")} size="lg" className="rounded-xl px-10 py-7 text-lg font-bold">Start Playing</Button>
                        <Button onClick={() => navigate("/contact")} size="lg" variant="outline" className="rounded-xl px-10 py-7 text-lg font-bold">Contact Us</Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
