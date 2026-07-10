import { motion } from "framer-motion";
import { Linkedin, Twitter, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AbduljPhoto, AbdurehmanA, AbdurezakIsak, AjaibMoh, BilkesEl, Getahun, MohammedHas1, MohammedIb, MohammedMum, RemlaHa } from "@/assets/photos";
import { Button } from "@/shared/components/ui/button";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    other?: string;
  };
}

const teamData: TeamMember[] = [
  {
    id: 1,
    name: "Abdurahman Abrar",
    role: "Co-PI, AI & Data Science Lead",
    image: AbdurehmanA,
    description: "Leads AI and data science strategy, oversees model development and experimentation, and guides project planning in alignment with research goals."
  },
  {
    id: 2,
    name: "Muhammed Hassen",
    role: "Co-PI, Data & Web Engineering Lead",
    image: MohammedHas1,
    description: "Back-end developer responsible for data and backend architecture, database and pipeline design, and ensuring scalability and reliability of infrastructure."
  },
  {
    id: 5,
    name: "Abduljebar Sani",
    role: "CO-PI, Technical Lead",
    image: AbduljPhoto,
    description: "Leads the overall technical direction of the project, manages the development team, and ensures the technical quality of the product."
  },
  {
    id: 3,
    name: "Abdurezak Yisak",
    role: "Co-PI, UX/UI Designer",
    image: AbdurezakIsak,
    description: "UX/UI designer focused on user-friendly interfaces, inclusive design practices, and collaboration with engineers to ensure accessibility and usability."
  },
  {
    id: 4,
    name: "Mohammed Ibrahim",
    role: "Co-PI & Lead Content Developer",
    image: MohammedIb,
    description: "Develops educational narratives and scenarios with a focus on cultural relevance and pedagogy. Oversees content review and improvement."
  },
  {
    id: 6,
    name: "Ajaib Mohammed",
    role: "DevOps Manager",
    image: AjaibMoh,
    description: "Manages CI/CD pipelines, monitors system performance, ensures infrastructure scalability, and oversees cloud infrastructure and security."
  },
  {
    id: 7,
    name: "Bilkes Elias",
    role: "AI & Machine Learning Expert",
    image: BilkesEl,
    description: "Develops and fine-tunes machine learning models, performs data processing, and supports AI integration within the product platform."
  },
  {
    id: 8,
    name: "Dr. Muhammed Mumtaz",
    role: "ICT Consultant",
    image: MohammedMum,
    description: "Director of ICT at Jimma University, Provides strategic ICT guidance, supports quality assurance and code review, and offers technical advice across the stack."
  },
  {
    id: 9,
    name: "Remela Habib",
    role: "UI & UX Expert",
    image: RemlaHa,
    description: "Conducts usability testing and UI design, iterates based on feedback, and ensures accessible design across platforms."
  },
  {
    id: 10,
    name: "Getahun Assefa",
    role: "Community Manager",
    image: Getahun,
    description: "Leads community outreach, gathers user feedback for product improvement, and coordinates communication between users and the development team."
  }
];

const TeamSection = () => {
  return (
    <section id="our-team" className="py-32 bg-background relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase">The Mindset</span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-6">
            Meet the <span className="text-primary">Visionaries.</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            A diverse collective of experts dedicated to building a future where information integrity is a universal standard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamData.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative p-8 rounded-[2.5rem] bg-secondary/5 border-2 border-transparent hover:border-primary/20 transition-all duration-500 overflow-hidden"
            >
              {/* Image & Overlay */}
              <div className="relative mb-8 mx-auto w-40 h-40 overflow-hidden rounded-[2rem] border-4 border-white dark:border-white/10 shadow-2xl">
                <img
                  alt={member.name}
                  src={member.image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-foreground">{member.name}</h3>
                <p className="text-sm font-black text-primary uppercase tracking-widest">{member.role}</p>
              </div>

              <p className="mt-6 text-muted-foreground font-medium text-sm leading-relaxed text-center italic opacity-80 group-hover:opacity-100 transition-opacity">
                "{member.description}"
              </p>

              {/* Social Links */}
              <div className="flex justify-center space-x-4 mt-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <a href="#" className="p-3 bg-white dark:bg-white/5 rounded-xl shadow-lg hover:text-primary hover:-translate-y-1 transition-all">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="p-3 bg-white dark:bg-white/5 rounded-xl shadow-lg hover:text-primary hover:-translate-y-1 transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="p-3 bg-white dark:bg-white/5 rounded-xl shadow-lg hover:text-primary hover:-translate-y-1 transition-all">
                  <Globe size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Button
            variant="outline"
            asChild
            className="px-12 py-10 rounded-[2rem] font-black text-2xl border-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 group"
          >
            <Link to="/contact">
              Join Our Mission <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={32} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;